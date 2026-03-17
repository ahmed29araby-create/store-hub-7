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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");
    const token = authHeader.replace("Bearer ", "");

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) throw new Error("Unauthorized");
    const userId = claimsData.claims.sub as string;

    const { data: roleCheck } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "super_admin")
      .single();

    if (!roleCheck) throw new Error("Not a super admin");

    const { organization_id, password } = await req.json();

    if (!password) throw new Error("كلمة المرور مطلوبة");

    // Verify password
    const userEmail = claimsData.claims.email as string;
    const verifyClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );
    const { error: verifyError } = await verifyClient.auth.signInWithPassword({
      email: userEmail,
      password,
    });
    if (verifyError) throw new Error("كلمة المرور غير صحيحة");

    // Get all users in this org
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("user_id")
      .eq("organization_id", organization_id);

    // Delete auth users
    if (profiles) {
      for (const profile of profiles) {
        await supabaseAdmin.auth.admin.deleteUser(profile.user_id);
      }
    }

    // Delete organization (cascades to products, orders, profiles)
    const { error } = await supabaseAdmin
      .from("organizations")
      .delete()
      .eq("id", organization_id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
