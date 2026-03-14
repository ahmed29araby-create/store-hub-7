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

    const { store_name, email, password, store_type } = await req.json();

    if (!store_name || !email || !password || !store_type) {
      throw new Error("جميع الحقول مطلوبة");
    }
    if (password.length < 12) {
      throw new Error("كلمة المرور يجب أن تكون 12 حرف على الأقل");
    }
    if (!["clothing", "accessories", "restaurant", "pharmacy", "electronics", "sports", "gifts", "home_decor", "supermarket", "kids_toys"].includes(store_type)) {
      throw new Error("نوع المتجر غير صالح");
    }

    // Try to create the user directly - Supabase will return error if email exists
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: store_name },
    });

    if (createError) {
      if (createError.message?.includes("already been registered") || createError.message?.includes("email_exists")) {
        throw new Error("البريد الإلكتروني مسجل بالفعل. استخدم بريد إلكتروني آخر أو سجل دخول بحسابك الحالي.");
      }
      throw createError;
    }

    const { data: org, error: orgError } = await supabaseAdmin
      .from("organizations")
      .insert({
        name: store_name,
        email,
        store_type,
        is_active: false,
        approval_status: "pending",
      })
      .select()
      .single();
    if (orgError) throw orgError;

    await supabaseAdmin
      .from("profiles")
      .update({ organization_id: org.id })
      .eq("user_id", newUser.user.id);

    await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: newUser.user.id, role: "admin" });

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
