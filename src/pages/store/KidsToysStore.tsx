import { motion } from "framer-motion";
import { ShoppingBag, Heart, Baby, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`kids-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const KidsToysStore = () => {
  const { organization, products, categories, groupedProducts, uncategorizedProducts, isLoading, orgId } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "hsl(45, 50%, 97%)" }}>جاري التحميل...</div>;

  const heroTitle = settings?.hero_title || "عالم المرح والسعادة";
  const heroSubtitle = settings?.hero_subtitle || "ملابس أطفال، ألعاب تعليمية، عربات ومستلزمات الرضع";
  const heroButton = settings?.hero_button_text || "تسوق الآن";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80";

  const colors = ["hsl(280,60%,55%)", "hsl(200,70%,55%)", "hsl(45,80%,50%)", "hsl(340,60%,55%)"];

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(45, 50%, 97%)", fontFamily: "'Inter', sans-serif" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b" style={{ borderColor: "hsl(45,40%,88%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(280,60%,60%), hsl(200,70%,55%))" }}>
              <Baby className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black" style={{ color: "hsl(280, 60%, 45%)" }}>{organization?.name || "كيدز لاند"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" style={{ color: "hsl(280,60%,55%)" }}><Heart className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="relative" style={{ color: "hsl(280,60%,55%)" }}><ShoppingBag className="w-5 h-5" /></Button>
          </div>
        </div>
      </nav>

      {/* Hero - Playful */}
      <section className="relative overflow-hidden py-16 lg:py-24" style={{ background: "linear-gradient(135deg, hsl(280,50%,92%) 0%, hsl(200,60%,92%) 50%, hsl(45,70%,92%) 100%)" }}>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div key={i} initial={{ y: 0 }} animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-16 h-16 rounded-full opacity-20"
              style={{
                backgroundColor: i % 3 === 0 ? "hsl(280,60%,60%)" : i % 3 === 1 ? "hsl(200,70%,55%)" : "hsl(45,80%,55%)",
                top: `${15 + (i * 25) % 70}%`, left: `${10 + (i * 30) % 80}%`,
              }} />
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl mb-4">🎈🧸🎁</motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
              <span style={{ color: "hsl(280,60%,45%)" }}>{heroTitle}</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-lg mb-8 max-w-md" style={{ color: "hsl(280,20%,45%)" }}>{heroSubtitle}</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Button className="rounded-full px-10 py-7 text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, hsl(280,60%,55%), hsl(200,70%,55%))" }}>
                {heroButton} 🛒 <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }} className="hidden lg:block">
            <img src={heroImage} alt="" className="w-full h-72 object-cover rounded-[2rem] shadow-2xl border-4 border-white" />
          </motion.div>
        </div>
      </section>

      {/* Category Bubbles */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
          <div className="flex gap-4 justify-center flex-wrap">
            {categories.map((cat, i) => (
              <motion.button key={cat.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                onClick={() => scrollToSection(cat.name)}
                whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
                className="bg-white rounded-[1.5rem] px-6 py-5 text-center shadow-md hover:shadow-xl transition-shadow"
                style={{ border: "2px solid hsl(45,40%,90%)" }}>
                <span className="text-xs font-bold" style={{ color: "hsl(280,60%,40%)" }}>{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      {groupedProducts.length > 0 ? (
        groupedProducts.map((group, catIdx) => {
          const accentColor = colors[catIdx % colors.length];
          return (
            <section key={group.category.id} id={`kids-cat-${group.category.name}`} className="max-w-7xl mx-auto px-6 py-12 scroll-mt-28">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="flex items-center gap-3 mb-8">
                <h3 className="text-xl font-black" style={{ color: accentColor }}>{group.category.name}</h3>
                <div className="flex-1 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)`, opacity: 0.2 }} />
              </motion.div>
              <div className={`grid gap-5 ${catIdx % 2 === 0 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                {group.products.map((product, i) => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 25, rotate: -2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8, rotate: 1 }}
                    className="group bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
                    style={{ border: "2px solid hsl(45,40%,90%)" }}>
                    <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: "hsl(45,50%,95%)" }}>
                      {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-10 h-10 opacity-20" /></div>}
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }}
                        className="absolute top-3 left-3 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                        <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : ""}`} style={{ color: isFavorite(product.id) ? undefined : "hsl(340,70%,55%)" }} />
                      </button>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-sm mb-2" style={{ color: "hsl(280,40%,25%)" }}>{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <p className="font-black" style={{ color: accentColor }}>{product.price.toLocaleString()} ج.م</p>
                        <Button size="sm" className="rounded-full text-[10px] h-8 text-white"
                          style={{ background: `linear-gradient(135deg, ${accentColor}, hsl(200,70%,55%))` }}>أضف 🛒</Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })
      ) : products.length === 0 ? (
        <div className="text-center py-20" style={{ color: "hsl(280,20%,55%)" }}>لا توجد منتجات حالياً</div>
      ) : null}

      {uncategorizedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-xl font-black mb-8" style={{ color: "hsl(280,60%,40%)" }}>أخرى</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {uncategorizedProducts.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[1.5rem] overflow-hidden shadow-sm" style={{ border: "2px solid hsl(45,40%,90%)" }}>
                <div className="aspect-square overflow-hidden" style={{ backgroundColor: "hsl(45,50%,95%)" }}>
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-10 h-10 opacity-20" /></div>}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-sm mb-2" style={{ color: "hsl(280,40%,25%)" }}>{p.name}</h4>
                  <p className="font-black" style={{ color: "hsl(280,60%,55%)" }}>{p.price.toLocaleString()} ج.م</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: "hsl(45,40%,88%)", color: "hsl(45,20%,55%)" }}>
        <p>© 2026 {organization?.name || "StoreHub"} - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default KidsToysStore;
