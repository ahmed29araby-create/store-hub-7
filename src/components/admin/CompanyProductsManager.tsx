import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Pencil, Trash2, Image, MoreVertical, Copy, Eye, EyeOff, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import CategoryTabs, { type Category } from "./products/CategoryTabs";
import ProductFormDialog, { compressImage } from "./products/ProductFormDialog";

const CompanyProductsManager = () => {
  const { organization } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories", organization?.id],
    queryFn: async () => {
      if (!organization) return [];
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("organization_id", organization.id)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Category[];
    },
    enabled: !!organization,
  });

  // Fetch products
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

  // Product counts per category
  const productCounts: Record<string, number> = {};
  products.forEach((p) => {
    const cat = p.category || "uncategorized";
    productCounts[cat] = (productCounts[cat] || 0) + 1;
  });

  // Filtered products
  const filteredProducts = selectedCategoryId
    ? products.filter((p) => p.category === selectedCategoryId)
    : products;

  // Category mutations
  const addCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!organization) throw new Error("No org");
      const { error } = await supabase.from("categories").insert({
        name,
        organization_id: organization.id,
        sort_order: categories.length,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم إضافة القسم");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const editCategoryMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase.from("categories").update({ name }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم تعديل القسم");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      // Clear category from products first
      await supabase.from("products").update({ category: null }).eq("category", id);
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم حذف القسم");
      if (selectedCategoryId) setSelectedCategoryId(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["company-products"] });
    },
  });

  const toggleCategoryVisibility = useMutation({
    mutationFn: async ({ id, visible }: { id: string; visible: boolean }) => {
      const { error } = await supabase.from("categories").update({ is_visible: visible }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم تحديث القسم");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  // Product mutations
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!organization) return null;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const fileName = `${organization.id}/${Date.now()}.jpg`;
      const { error } = await supabase.storage.from("product-images").upload(fileName, compressed, { contentType: "image/jpeg" });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
      return urlData.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async ({ form, imageFile, keepExistingImage }: { form: any; imageFile: File | null; keepExistingImage: boolean }) => {
      if (!organization) throw new Error("No organization");
      let imageUrl: string | null = keepExistingImage ? (editingProduct?.image_url || null) : null;
      if (imageFile) imageUrl = await uploadImage(imageFile);

      const payload: any = {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price) || 0,
        organization_id: organization.id,
        category: form.categoryId || null,
      };
      if (imageFile || !editingProduct) payload.image_url = imageUrl;

      if (editingProduct) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingProduct ? "تم تعديل المنتج" : "تم إضافة المنتج");
      queryClient.invalidateQueries({ queryKey: ["company-products"] });
      setDialogOpen(false);
      setEditingProduct(null);
    },
    onError: (e: Error) => toast.error(e.message),
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
      if (!organization) throw new Error("No org");
      const { error } = await supabase.from("products").insert({
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        organization_id: organization.id,
        is_available: product.is_available,
        category: product.category,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم تكرار المنتج");
      queryClient.invalidateQueries({ queryKey: ["company-products"] });
    },
  });

  const toggleAvailability = useMutation({
    mutationFn: async ({ id, available }: { id: string; available: boolean }) => {
      const { error } = await supabase.from("products").update({ is_available: available }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم تحديث المنتج");
      queryClient.invalidateQueries({ queryKey: ["company-products"] });
    },
  });

  const moveProductMutation = useMutation({
    mutationFn: async ({ productId, categoryId }: { productId: string; categoryId: string | null }) => {
      const { error } = await supabase.from("products").update({ category: categoryId }).eq("id", productId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم نقل المنتج");
      queryClient.invalidateQueries({ queryKey: ["company-products"] });
    },
  });

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const getCategoryName = (catId: string | null) => {
    if (!catId) return "بدون قسم";
    return categories.find((c) => c.id === catId)?.name || "بدون قسم";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">المنتجات ({products.length})</h2>
        <Button onClick={() => { setEditingProduct(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 ml-2" />إضافة منتج
        </Button>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
        onAdd={(name) => addCategoryMutation.mutate(name)}
        onEdit={(id, name) => editCategoryMutation.mutate({ id, name })}
        onDelete={(id) => deleteCategoryMutation.mutate(id)}
        onToggleVisibility={(id, visible) => toggleCategoryVisibility.mutate({ id, visible })}
        productCounts={productCounts}
      />

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={(o) => { if (!o) { setDialogOpen(false); setEditingProduct(null); } else setDialogOpen(true); }}
        categories={categories}
        isEditing={!!editingProduct}
        initialData={editingProduct ? {
          name: editingProduct.name,
          description: editingProduct.description || "",
          price: editingProduct.price.toString(),
          categoryId: editingProduct.category || "",
          imagePreview: editingProduct.image_url,
        } : undefined}
        defaultCategoryId={selectedCategoryId}
        onSave={(form, imageFile, keepExisting) => saveMutation.mutate({ form, imageFile, keepExistingImage: keepExisting })}
        saving={saveMutation.isPending}
        uploading={uploading}
      />

      {/* Products Table */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {selectedCategoryId ? "لا توجد منتجات في هذا القسم" : "لا توجد منتجات بعد. أضف أول منتج!"}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المنتج</TableHead>
                <TableHead className="text-right">القسم</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className={!product.is_available ? "opacity-50" : ""}>
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
                  <TableCell className="text-muted-foreground text-sm">{getCategoryName(product.category)}</TableCell>
                  <TableCell>{product.price} ج.م</TableCell>
                  <TableCell>
                    <div className="flex gap-1 items-center">
                      {/* Visibility toggle */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleAvailability.mutate({ id: product.id, available: !product.is_available })}
                        title={product.is_available ? "إخفاء المنتج" : "إظهار المنتج"}
                      >
                        {product.is_available ? (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-destructive" />
                        )}
                      </Button>
                      {/* Edit */}
                      <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      {/* Delete */}
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {/* More actions */}
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
                          {categories.length > 0 && (
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <ArrowRightLeft className="w-4 h-4 ml-2" />
                                نقل إلى قسم
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                {categories
                                  .filter((c) => c.id !== product.category)
                                  .map((c) => (
                                    <DropdownMenuItem
                                      key={c.id}
                                      onClick={() => moveProductMutation.mutate({ productId: product.id, categoryId: c.id })}
                                    >
                                      {c.name}
                                    </DropdownMenuItem>
                                  ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          )}
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
