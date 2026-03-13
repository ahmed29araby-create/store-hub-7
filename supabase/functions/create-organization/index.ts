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

    // Verify user via getUser
    const { data: { user: caller }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !caller) throw new Error("Unauthorized");

    const userId = caller.id;

    const { data: roleCheck } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "super_admin")
      .single();

    if (!roleCheck) throw new Error("Not a super admin");

    const { name, email, password, store_type } = await req.json();

    if (!name || !email || !password || !store_type) {
      throw new Error("Missing required fields");
    }
    if (password.length < 12) {
      throw new Error("Password must be at least 12 characters");
    }

    // Create auth user for admin
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: name },
    });

    if (createError) throw createError;

    // Create organization
    const { data: org, error: orgError } = await supabaseAdmin
      .from("organizations")
      .insert({ name, email, store_type })
      .select()
      .single();

    if (orgError) throw orgError;

    // Link profile to org
    await supabaseAdmin
      .from("profiles")
      .update({ organization_id: org.id })
      .eq("user_id", newUser.user.id);

    // Assign admin role
    await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: newUser.user.id, role: "admin" });

    // Create default store settings
    await supabaseAdmin
      .from("store_settings")
      .insert({ organization_id: org.id });

    return new Response(JSON.stringify({ success: true, organization: org }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
