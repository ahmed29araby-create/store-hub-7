import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Pencil, Trash2, Upload, X, Image, MoreVertical, Copy } from "lucide-react";
import { toast } from "sonner";

const MAX_IMAGE_SIZE = 800; // max width/height in pixels
const JPEG_QUALITY = 0.7;

const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_IMAGE_SIZE || height > MAX_IMAGE_SIZE) {
        if (width > height) {
          height = (height / width) * MAX_IMAGE_SIZE;
          width = MAX_IMAGE_SIZE;
        } else {
          width = (width / height) * MAX_IMAGE_SIZE;
          height = MAX_IMAGE_SIZE;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    img.onerror = reject;
    img.src = url;
  });
};

const CompanyProductsManager = () => {
  const { organization } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["company-products", organization?.id],
    queryFn: async () => {
      if (!organization) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("organization_id", organization.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!organization,
  });

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!organization) return null;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const fileName = `${organization.id}/${Date.now()}.jpg`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, compressed, { contentType: "image/jpeg" });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
      return urlData.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!organization) throw new Error("No organization");

      let imageUrl: string | null = imagePreview && !imageFile ? imagePreview : null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload: any = {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price) || 0,
        organization_id: organization.id,
      };
      // Only update image if a new one was selected or we're creating
      if (imageFile || !editId) {
        payload.image_url = imageUrl;
      }

      if (editId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editId ? "تم تعديل المنتج" : "تم إضافة المنتج");
      queryClient.invalidateQueries({ queryKey: ["company-products"] });
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم حذف المنتج");
      queryClient.invalidateQueries({ queryKey: ["company-products"] });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (product: any) => {
      if (!organization) throw new Error("No organization");
      const { error } = await supabase.from("products").insert({
        name: `${product.name} (نسخة)`,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        organization_id: organization.id,
        is_available: product.is_available,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم تكرار المنتج");
      queryClient.invalidateQueries({ queryKey: ["company-products"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const resetForm = () => {
    setOpen(false);
    setEditId(null);
    setForm({ name: "", description: "", price: "" });
    setImageFile(null);
    setImagePreview(null);
  };

  const openEdit = (product: any) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
    });
    setImagePreview(product.image_url || null);
    setImageFile(null);
    setOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">المنتجات</h2>
        <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 ml-2" />إضافة منتج</Button>
          </DialogTrigger>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle>{editId ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>اسم المنتج</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>السعر</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>صورة المنتج</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {imagePreview ? (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 left-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-80 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">اضغط لرفع صورة</span>
                  </button>
                )}
              </div>

              <Button
                className="w-full"
                onClick={() => saveMutation.mutate()}
                disabled={!form.name || saveMutation.isPending || uploading}
              >
                {uploading ? "جاري رفع الصورة..." : saveMutation.isPending ? "جاري الحفظ..." : editId ? "تعديل" : "إضافة"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">لا توجد منتجات بعد. أضف أول منتج!</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المنتج</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center">
                          <Image className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.description && <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.price} ج.م</TableCell>
                  <TableCell>
                    <div className="flex gap-1 items-center">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => duplicateMutation.mutate(product)}>
                            <Copy className="w-4 h-4 ml-2" />
                            تكرار المنتج
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CompanyProductsManager;
