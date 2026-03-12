import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Save, Eye, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StoreSettings {
  id?: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  hero_button_text: string;
  categories: string[];
}

const StoreAppearanceEditor = () => {
  const { organization } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<StoreSettings>({
    hero_title: "",
    hero_subtitle: "",
    hero_image_url: "",
    hero_button_text: "",
    categories: [],
  });
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!organization?.id) return;
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("store_settings")
        .select("*")
        .eq("organization_id", organization.id)
        .single();

      if (data) {
        setSettings({
          id: data.id,
          hero_title: data.hero_title || "",
          hero_subtitle: data.hero_subtitle || "",
          hero_image_url: data.hero_image_url || "",
          hero_button_text: data.hero_button_text || "",
          categories: Array.isArray(data.categories) ? (data.categories as string[]) : [],
        });
      }
      setLoading(false);
    };
    fetchSettings();
  }, [organization?.id]);

  const handleSave = async () => {
    if (!organization?.id) return;
    setSaving(true);

    const payload = {
      organization_id: organization.id,
      hero_title: settings.hero_title,
      hero_subtitle: settings.hero_subtitle,
      hero_image_url: settings.hero_image_url,
      hero_button_text: settings.hero_button_text,
      categories: settings.categories as any,
    };

    let error;
    if (settings.id) {
      ({ error } = await supabase
        .from("store_settings")
        .update(payload)
        .eq("id", settings.id));
    } else {
      const { data, error: insertError } = await supabase
        .from("store_settings")
        .insert(payload)
        .select()
        .single();
      error = insertError;
      if (data) setSettings((s) => ({ ...s, id: data.id }));
    }

    setSaving(false);
    if (error) {
      toast({ title: "خطأ", description: "فشل حفظ الإعدادات", variant: "destructive" });
    } else {
      toast({ title: "تم الحفظ", description: "تم حفظ إعدادات المتجر بنجاح" });
    }
  };

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !settings.categories.includes(trimmed)) {
      setSettings((s) => ({ ...s, categories: [...s.categories, trimmed] }));
      setNewCategory("");
    }
  };

  const removeCategory = (cat: string) => {
    setSettings((s) => ({ ...s, categories: s.categories.filter((c) => c !== cat) }));
  };

  const handleViewStore = () => {
    if (organization?.store_type && organization?.id) {
      window.open(`/store/${organization.store_type}/${organization.id}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">تخصيص واجهة المتجر</h2>
          <p className="text-sm text-muted-foreground mt-1">عدّل المحتوى اللي بيظهر للعملاء في صفحة المتجر</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleViewStore}>
          <Eye className="w-4 h-4 ml-2" />
          معاينة المتجر
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">القسم الرئيسي (Hero)</CardTitle>
          <CardDescription>العنوان والوصف اللي بيظهروا في أعلى صفحة المتجر</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>العنوان الرئيسي</Label>
            <Input
              value={settings.hero_title}
              onChange={(e) => setSettings((s) => ({ ...s, hero_title: e.target.value }))}
              placeholder="مثال: أناقة بلا حدود"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label>الوصف / النص الفرعي</Label>
            <Textarea
              value={settings.hero_subtitle}
              onChange={(e) => setSettings((s) => ({ ...s, hero_subtitle: e.target.value }))}
              placeholder="مثال: اكتشف أحدث صيحات الموضة والأزياء العصرية بأسعار تنافسية"
              dir="rtl"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>نص الزر</Label>
            <Input
              value={settings.hero_button_text}
              onChange={(e) => setSettings((s) => ({ ...s, hero_button_text: e.target.value }))}
              placeholder="مثال: تسوق الآن"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              رابط صورة الخلفية
            </Label>
            <Input
              value={settings.hero_image_url}
              onChange={(e) => setSettings((s) => ({ ...s, hero_image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              dir="ltr"
            />
            {settings.hero_image_url && (
              <div className="mt-2 rounded-lg overflow-hidden border border-border h-32">
                <img
                  src={settings.hero_image_url}
                  alt="معاينة"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">التصنيفات</CardTitle>
          <CardDescription>التصنيفات اللي بتظهر للعملاء (مثال: Jacket, T-Shirt, بنطلون)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="اكتب اسم التصنيف..."
              dir="rtl"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
            />
            <Button onClick={addCategory} size="icon" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {settings.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {settings.categories.map((cat) => (
                <Badge key={cat} variant="secondary" className="text-sm py-1 px-3 gap-1">
                  {cat}
                  <button onClick={() => removeCategory(cat)} className="mr-1 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          {settings.categories.length === 0 && (
            <p className="text-sm text-muted-foreground">لم تتم إضافة تصنيفات بعد</p>
          )}
        </CardContent>
      </Card>

      {/* Save */}
      <Button onClick={handleSave} disabled={saving} className="w-full" size="lg">
        {saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
        حفظ التعديلات
      </Button>
    </div>
  );
};

export default StoreAppearanceEditor;
