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

    // Verify super admin
    const { data: roleCheck } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "super_admin")
      .single();
    if (!roleCheck) throw new Error("Not a super admin");

    const { organization_id, action, trial_months } = await req.json();

    if (!organization_id || !action) {
      throw new Error("Missing required fields");
    }

    if (action === "approve") {
      const updateData: Record<string, unknown> = {
        approval_status: "approved",
        is_active: true,
        trial_months: trial_months || 0,
      };

      if (trial_months && trial_months > 0) {
        const trialEnd = new Date();
        trialEnd.setMonth(trialEnd.getMonth() + trial_months);
        updateData.trial_end_date = trialEnd.toISOString();
      }

      const { error } = await supabaseAdmin
        .from("organizations")
        .update(updateData)
        .eq("id", organization_id);
      if (error) throw error;

    } else if (action === "reject") {
      const { error } = await supabaseAdmin
        .from("organizations")
        .update({ approval_status: "rejected", is_active: false })
        .eq("id", organization_id);
      if (error) throw error;
    } else {
      throw new Error("Invalid action");
    }

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
