import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  views: number;
  sales: number;
}

const initialProducts: Product[] = [
  { id: 1, name: "جاكيت جلد كلاسيك", price: 1200, category: "ملابس", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&q=80", views: 320, sales: 45 },
  { id: 2, name: "عطر oud فاخر", price: 3500, category: "إكسسوارات", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&q=80", views: 280, sales: 38 },
  { id: 3, name: "ساعة كلاسيكية", price: 4200, category: "إكسسوارات", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80", views: 250, sales: 32 },
  { id: 4, name: "برجر واجيو", price: 180, category: "مطاعم", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80", views: 410, sales: 120 },
  { id: 5, name: "فستان سهرة", price: 2500, category: "ملابس", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&q=80", views: 190, sales: 28 },
];

const categories = ["ملابس", "إكسسوارات", "مطاعم"];

const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", price: "", category: "ملابس", image: "" });
  const { toast } = useToast();

  const resetForm = () => {
    setForm({ name: "", price: "", category: "ملابس", image: "" });
    setEditingProduct(null);
  };

  const handleSave = () => {
    if (!form.name || !form.price) {
      toast({ title: "خطأ", description: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }

    if (editingProduct) {
      setProducts(products.map(p =>
        p.id === editingProduct.id
          ? { ...p, name: form.name, price: Number(form.price), category: form.category, image: form.image }
          : p
      ));
      toast({ title: "تم التعديل", description: "تم تعديل المنتج بنجاح" });
    } else {
      const newProduct: Product = {
        id: Date.now(),
        name: form.name,
        price: Number(form.price),
        category: form.category,
        image: form.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80",
        views: 0,
        sales: 0,
      };
      setProducts([...products, newProduct]);
      toast({ title: "تمت الإضافة", description: "تم إضافة المنتج بنجاح" });
    }

    resetForm();
    setDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({ name: product.name, price: String(product.price), category: product.category, image: product.image });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast({ title: "تم الحذف", description: "تم حذف المنتج" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">المنتجات ({products.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 ml-2" /> إضافة منتج</Button>
          </DialogTrigger>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="اسم المنتج" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="السعر" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input placeholder="رابط الصورة" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
              <Button onClick={handleSave} className="w-full">{editingProduct ? "حفظ التعديلات" : "إضافة"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المنتج</TableHead>
                <TableHead className="text-right">التصنيف</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right">المشاهدات</TableHead>
                <TableHead className="text-right">المبيعات</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                      <span className="font-medium text-foreground">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.category}</TableCell>
                  <TableCell className="font-medium">{product.price} ج.م</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="w-3 h-3" /> {product.views}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.sales}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsManager;
