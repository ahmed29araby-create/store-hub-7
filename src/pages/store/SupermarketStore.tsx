import { motion } from "framer-motion";
import { ShoppingCart, Heart, Apple, Leaf, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`super-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const SupermarketStore = () => {
  const { organization, products, categories, groupedProducts, uncategorizedProducts, isLoading, orgId } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "hsl(80, 20%, 97%)" }}>جاري التحميل...</div>;

  const heroTitle = settings?.hero_title || "كل ما تحتاجه";
  const heroSubtitle = settings?.hero_subtitle || "مواد غذائية، خضار وفواكه طازجة بأسعار تنافسية";
  const heroButton = settings?.hero_button_text || "تسوق الآن";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80";

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(80, 20%, 97%)", fontFamily: "'Inter', sans-serif" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b" style={{ borderColor: "hsl(80,30%,88%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "hsl(130, 55%, 45%)" }}>
              <Apple className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold" style={{ color: "hsl(130, 55%, 25%)" }}>{organization?.name || "فريش ماركت"}</h1>
          </div>
          <Button variant="ghost" size="icon" className="relative" style={{ color: "hsl(130,55%,35%)" }}><ShoppingCart className="w-5 h-5" /></Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(130,55%,45%) 0%, hsl(90,50%,40%) 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[500px] h-[500px] rounded-full -bottom-40 -left-40 bg-white" />
          <div className="absolute w-[300px] h-[300px] rounded-full top-10 right-20 bg-white" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6 bg-white/15">
              <Leaf className="w-3.5 h-3.5" /> طازج يومياً
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">{heroTitle}</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-white/70 text-lg mb-8 max-w-md">{heroSubtitle}</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex gap-3">
              <Button className="bg-white hover:bg-white/90 rounded-full px-8 py-6 text-sm font-bold" style={{ color: "hsl(130,55%,30%)" }}>{heroButton}</Button>
              <Button variant="outline" className="rounded-full px-8 py-6 text-sm text-white border-white/30 hover:bg-white/10">
                العروض اليومية <Tag className="w-4 h-4 mr-1" />
              </Button>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="hidden lg:block">
            <img src={heroImage} alt="" className="w-full h-72 object-cover rounded-3xl shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Category Cards */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
          <div className="grid grid-cols-5 gap-3">
            {categories.map((cat, i) => (
              <motion.button key={cat.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                onClick={() => scrollToSection(cat.name)}
                className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all hover:scale-105"
                style={{ border: "1px solid hsl(80,20%,90%)" }}>
                <span className="text-xs font-medium" style={{ color: "hsl(130,55%,25%)" }}>{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      {groupedProducts.length > 0 ? (
        groupedProducts.map((group, catIdx) => (
          <section key={group.category.id} id={`super-cat-${group.category.name}`} className="max-w-7xl mx-auto px-6 py-12 scroll-mt-28">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: "hsl(130,55%,20%)" }}>{group.category.name}</h3>
            </motion.div>
            <div className={`grid gap-4 ${catIdx % 2 === 0 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-4"}`}>
              {group.products.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer" style={{ border: "1px solid hsl(80,20%,90%)" }}>
                  <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: "hsl(80,20%,95%)" }}>
                    {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center"><ShoppingCart className="w-10 h-10 opacity-20" /></div>}
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }}
                      className="absolute bottom-2 left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      style={{ color: "hsl(130,55%,45%)" }}>
                      <Heart className={`w-3.5 h-3.5 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-xs mb-1 line-clamp-2" style={{ color: "hsl(130,55%,15%)" }}>{product.name}</h4>
                    <p className="font-bold text-sm" style={{ color: "hsl(130,55%,40%)" }}>{product.price} ج.م</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))
      ) : products.length === 0 ? (
        <div className="text-center py-20" style={{ color: "hsl(130,20%,50%)" }}>لا توجد منتجات حالياً</div>
      ) : null}

      {uncategorizedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-xl font-bold mb-6" style={{ color: "hsl(130,55%,20%)" }}>أخرى</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {uncategorizedProducts.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer" style={{ border: "1px solid hsl(80,20%,90%)" }}>
                <div className="aspect-square overflow-hidden" style={{ backgroundColor: "hsl(80,20%,95%)" }}>
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingCart className="w-10 h-10 opacity-20" /></div>}
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-xs mb-1" style={{ color: "hsl(130,55%,15%)" }}>{p.name}</h4>
                  <p className="font-bold text-sm" style={{ color: "hsl(130,55%,40%)" }}>{p.price} ج.م</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: "hsl(80,20%,88%)", color: "hsl(80,10%,55%)" }}>
        <p>© 2026 {organization?.name || "StoreHub"} - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default SupermarketStore;
