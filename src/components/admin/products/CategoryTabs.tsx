import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
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

const MAX_VISIBLE_TABS = 4;

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
  const [showAll, setShowAll] = useState(false);
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
  const hasMore = categories.length > MAX_VISIBLE_TABS;
  const visibleCategories = hasMore && !showAll ? categories.slice(0, MAX_VISIBLE_TABS) : categories;

  const renderCategoryButton = (cat: Category) => (
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
          <DropdownMenuItem onClick={() => {
            const count = productCounts[cat.id] || 0;
            if (!cat.is_visible && count === 0) {
              toast.error("يجب إضافة منتجات داخل القسم قبل إظهاره");
              return;
            }
            onToggleVisibility(cat.id, !cat.is_visible);
          }}>
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
  );

  return (
    <div className="space-y-3">
      {/* Top row: الكل + first 4 categories + عرض الكل + إضافة قسم */}
      <div className="flex items-center gap-2 flex-wrap pb-2">
        <Button
          variant={selectedCategoryId === null ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(null)}
          className="shrink-0"
        >
          الكل ({totalProducts})
        </Button>

        {(!showAll ? visibleCategories : []).map(renderCategoryButton)}

        {hasMore && !showAll && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAll(true)}
            className="shrink-0"
          >
            عرض الكل ({categories.length})
            <ChevronDown className="w-4 h-4 mr-1" />
          </Button>
        )}

        {showAll && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAll(false)}
            className="shrink-0"
          >
            إخفاء
            <ChevronUp className="w-4 h-4 mr-1" />
          </Button>
        )}

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

      {/* Expanded grid: show all categories in rows of 5 */}
      {showAll && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-3 rounded-lg border border-border bg-muted/30">
          {categories.map(renderCategoryButton)}
        </div>
      )}

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
