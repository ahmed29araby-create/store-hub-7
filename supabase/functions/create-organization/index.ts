import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const defaultCategories: Record<string, string[]> = {
  clothing: ["ملابس رجالي", "ملابس حريمي", "أطفال", "أحذية", "إكسسوارات"],
  accessories: ["ساعات", "عطور", "نظارات", "مجوهرات", "محافظ"],
  restaurant: ["مشاوي", "مقبلات", "مشروبات", "حلويات", "سلطات"],
  pharmacy: ["أدوية", "فيتامينات", "عناية شخصية", "مستحضرات تجميل", "أجهزة طبية"],
  electronics: ["هواتف", "لابتوب", "سماعات", "ألعاب", "إكسسوارات"],
  sports: ["ملابس رياضية", "أحذية رياضية", "معدات", "مكملات غذائية"],
  gifts: ["هدايا", "ورد", "شوكولاتة", "تغليف هدايا"],
  home_decor: ["أثاث", "إضاءة", "ديكور", "مفروشات"],
  supermarket: ["خضار وفاكهة", "لحوم", "مشروبات", "منظفات", "حلويات"],
  kids_toys: ["ألعاب تعليمية", "ألعاب أطفال", "ملابس أطفال", "مستلزمات رضع"],
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

    const { name, email, password, store_type } = await req.json();

    if (!name || !email || !password || !store_type) {
      throw new Error("Missing required fields");
    }
    if (password.length < 12) {
      throw new Error("Password must be at least 12 characters");
    }

    const validTypes = ["clothing", "accessories", "restaurant", "pharmacy", "electronics", "sports", "gifts", "home_decor", "supermarket", "kids_toys"];
    if (!validTypes.includes(store_type)) {
      throw new Error("نوع المتجر غير صالح");
    }

    // Create auth user for admin
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: name },
    });

    if (createError) {
      if (createError.message?.includes("already been registered") || createError.message?.includes("email_exists")) {
        throw new Error("البريد الإلكتروني مسجل بالفعل.");
      }
      throw createError;
    }

    // Create organization
    const { data: org, error: orgError } = await supabaseAdmin
      .from("organizations")
      .insert({ name, email, store_type })
      .select()
      .single();

    if (orgError) throw orgError;

    // Seed default categories for this store type
    const cats = defaultCategories[store_type] || [];
    if (cats.length > 0) {
      const categoryRows = cats.map((catName, i) => ({
        name: catName,
        organization_id: org.id,
        sort_order: i,
        is_visible: true,
      }));
      await supabaseAdmin.from("categories").insert(categoryRows);
    }

    // Wait for trigger to create profile, then update
    let retries = 0;
    let profileUpdated = false;
    while (retries < 5 && !profileUpdated) {
      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("user_id", newUser.user.id)
        .single();

      if (existingProfile) {
        await supabaseAdmin
          .from("profiles")
          .update({ organization_id: org.id })
          .eq("user_id", newUser.user.id);
        profileUpdated = true;
      } else {
        retries++;
        await new Promise(r => setTimeout(r, 300));
      }
    }

    if (!profileUpdated) {
      await supabaseAdmin
        .from("profiles")
        .upsert({
          user_id: newUser.user.id,
          display_name: name,
          email,
          organization_id: org.id,
        }, { onConflict: "user_id" });
    }

    // Assign admin role
    await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: newUser.user.id, role: "admin" });

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
