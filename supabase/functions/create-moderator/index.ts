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

    const { data: { user: caller }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !caller) throw new Error("Unauthorized");

    // Check caller is admin
    const { data: callerProfile } = await supabaseAdmin
      .from("profiles")
      .select("organization_id")
      .eq("user_id", caller.id)
      .single();

    if (!callerProfile?.organization_id) throw new Error("No organization found");

    const { data: roleCheck } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .single();

    if (!roleCheck) throw new Error("Not an admin");

    const { name, email, password, permissions } = await req.json();

    if (!name || !email || !password) throw new Error("Missing required fields");
    if (password.length < 8) throw new Error("Password must be at least 8 characters");

    // Create moderator auth user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: name },
    });

    if (createError) throw createError;

    // Assign moderator role
    await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: newUser.user.id, role: "moderator" });

    // Link to same organization
    await supabaseAdmin
      .from("profiles")
      .update({ organization_id: callerProfile.organization_id })
      .eq("user_id", newUser.user.id);

    // Save permissions
    await supabaseAdmin
      .from("moderator_permissions")
      .insert({
        user_id: newUser.user.id,
        organization_id: callerProfile.organization_id,
        can_manage_products: permissions?.can_manage_products || false,
        can_edit_prices: permissions?.can_edit_prices || false,
        can_manage_orders: permissions?.can_manage_orders || false,
        full_control: permissions?.full_control || false,
      });

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
