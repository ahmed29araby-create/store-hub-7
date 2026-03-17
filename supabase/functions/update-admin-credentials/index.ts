import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify caller using getClaims
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    
    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) throw new Error("Unauthorized");
    
    const userId = claimsData.claims.sub as string;
    const userEmail = claimsData.claims.email as string;

    const { new_email, current_password, new_password } = await req.json();

    // Verify current password using a fresh client
    if (current_password) {
      const verifyClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!
      );
      const { error: verifyError } = await verifyClient.auth.signInWithPassword({
        email: userEmail,
        password: current_password,
      });
      if (verifyError) throw new Error("كلمة المرور الحالية غير صحيحة");
    }

    const updates: any = {};
    if (new_email) updates.email = new_email;
    if (new_password) {
      if (new_password.length < 8) throw new Error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      updates.password = new_password;
    }
    if (new_email) updates.email_confirm = true;

    if (Object.keys(updates).length === 0) throw new Error("No changes provided");

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, updates);
    if (updateError) throw updateError;

    // Update profile email too
    if (new_email) {
      await supabaseAdmin.from("profiles").update({ email: new_email }).eq("user_id", userId);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
