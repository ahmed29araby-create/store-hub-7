import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface Category {
  id: string;
  name: string;
  is_visible: boolean;
  sort_order: number;
  organization_id: string;
}

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelect: (id: string | null) => void;
  onAdd: (name: string) => void;
  onEdit: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
  productCounts: Record<string, number>;
}

const CategoryTabs = ({
  categories,
  selectedCategoryId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  onToggleVisibility,
  productCounts,
}: CategoryTabsProps) => {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAdd = () => {
    if (!newName.trim()) {
      toast.error("يرجى إدخال اسم القسم");
      return;
    }
    onAdd(newName.trim());
    setNewName("");
    setAddOpen(false);
  };

  const handleEdit = () => {
    if (!newName.trim() || !editingCategory) return;
    onEdit(editingCategory.id, newName.trim());
    setNewName("");
    setEditingCategory(null);
    setEditOpen(false);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setNewName(cat.name);
    setEditOpen(true);
  };

  const totalProducts = Object.values(productCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {/* All products tab */}
        <Button
          variant={selectedCategoryId === null ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(null)}
          className="shrink-0"
        >
          الكل ({totalProducts})
        </Button>

        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-0 shrink-0">
            <Button
              variant={selectedCategoryId === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => onSelect(cat.id)}
              className={cn(
                "rounded-l-none border-l-0",
                !cat.is_visible && "opacity-60 line-through"
              )}
            >
              {cat.name} ({productCounts[cat.id] || 0})
              {!cat.is_visible && <EyeOff className="w-3 h-3 mr-1 text-destructive" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={selectedCategoryId === cat.id ? "default" : "outline"}
                  size="sm"
                  className="rounded-r-none px-1.5"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEdit(cat)}>
                  <Pencil className="w-4 h-4 ml-2" />
                  تعديل الاسم
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleVisibility(cat.id, !cat.is_visible)}>
                  {cat.is_visible ? (
                    <>
                      <EyeOff className="w-4 h-4 ml-2" />
                      إخفاء القسم
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 ml-2" />
                      إظهار القسم
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(cat.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف القسم
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}

        {/* Add category button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAddOpen(true)}
          className="shrink-0 border border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary"
        >
          <Plus className="w-4 h-4 ml-1" />
          إضافة قسم
        </Button>
      </div>

      {/* Add category dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة قسم جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="اسم القسم (مثال: ساعات، عطور...)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd} className="w-full">إضافة</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit category dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تعديل القسم</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEdit()}
            />
            <Button onClick={handleEdit} className="w-full">حفظ</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryTabs;
