import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import type { Category } from "./CategoryTabs";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  categoryId: string;
}

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  initialData?: ProductFormData & { imagePreview?: string | null };
  isEditing: boolean;
  onSave: (data: ProductFormData, imageFile: File | null, keepExistingImage: boolean) => void;
  saving: boolean;
  uploading: boolean;
  defaultCategoryId?: string | null;
}

const MAX_IMAGE_SIZE = 800;
const JPEG_QUALITY = 0.7;

export const compressImage = (file: File): Promise<Blob> => {
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

const ProductFormDialog = ({
  open,
  onOpenChange,
  categories,
  initialData,
  isEditing,
  onSave,
  saving,
  uploading,
  defaultCategoryId,
}: ProductFormDialogProps) => {
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    categoryId: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          name: initialData.name,
          description: initialData.description,
          price: initialData.price,
          categoryId: initialData.categoryId,
        });
        setImagePreview(initialData.imagePreview || null);
      } else {
        setForm({
          name: "",
          description: "",
          price: "",
          categoryId: defaultCategoryId || categories[0]?.id || "",
        });
        setImagePreview(null);
      }
      setImageFile(null);
    }
  }, [open, initialData, defaultCategoryId, categories]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
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
          <div className="space-y-2">
            <Label>القسم</Label>
            <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="اختر القسم" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>صورة المنتج</Label>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
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
            onClick={() => onSave(form, imageFile, !!imagePreview && !imageFile)}
            disabled={!form.name || !form.categoryId || saving || uploading}
          >
            {uploading ? "جاري رفع الصورة..." : saving ? "جاري الحفظ..." : isEditing ? "تعديل" : "إضافة"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
