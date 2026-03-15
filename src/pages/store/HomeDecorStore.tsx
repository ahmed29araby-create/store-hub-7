import { motion } from "framer-motion";
import { ShoppingBag, Heart, ArrowLeft, Lamp, Sofa, Star, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`home-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const HomeDecorStore = () => {
  const { organization, products, categories, groupedProducts, uncategorizedProducts, isLoading, orgId } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "hsl(30, 25%, 96%)" }}>جاري التحميل...</div>;

  const heroTitle = settings?.hero_title || "صمّم بيتك بذوقك";
  const heroSubtitle = settings?.hero_subtitle || "أثاث، ديكور، إضاءة ومفروشات بأعلى جودة";
  const heroButton = settings?.hero_button_text || "تسوق الآن";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80";

  const catIcons = [Sofa, ChefHat, Star, Lamp, Heart, ShoppingBag];

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(30, 25%, 96%)", fontFamily: "'Inter', sans-serif" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b" style={{ borderColor: "hsl(30,20%,88%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(30, 30%, 25%)" }}>{organization?.name || "بيتي"}</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" style={{ color: "hsl(30,30%,40%)" }}><Heart className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="relative" style={{ color: "hsl(30,30%,40%)" }}><ShoppingBag className="w-5 h-5" /></Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[80vh] overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsla(30,30%,15%,0.7) 0%, hsla(30,20%,20%,0.4) 100%)" }} />
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6">
          <div className="text-white max-w-lg">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-xs uppercase tracking-[0.5em] mb-4" style={{ color: "hsl(30,60%,70%)" }}>جمال بيتك يبدأ من هنا</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>{heroTitle}</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-white/60 text-lg mb-10">{heroSubtitle}</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
              <Button className="rounded-full px-10 py-6 text-sm font-semibold text-white" style={{ backgroundColor: "hsl(30, 50%, 45%)" }}>
                {heroButton} <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Icons */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
          <div className="bg-white rounded-3xl shadow-lg p-6 grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat, i) => {
              const Icon = catIcons[i % catIcons.length];
              return (
                <motion.button key={cat.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  onClick={() => scrollToSection(cat.name)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:shadow-md" style={{ backgroundColor: "hsl(30,25%,97%)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "hsl(30,40%,90%)" }}>
                    <Icon className="w-5 h-5" style={{ color: "hsl(30,50%,45%)" }} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: "hsl(30,30%,35%)" }}>{cat.name}</span>
                </motion.button>
              );
            })}
          </div>
        </section>
      )}

      {/* Products */}
      {groupedProducts.length > 0 ? (
        groupedProducts.map((group, catIdx) => (
          <section key={group.category.id} id={`home-cat-${group.category.name}`} className="max-w-7xl mx-auto px-6 py-14 scroll-mt-36">
            <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-2xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(30,30%,25%)" }}>{group.category.name}</motion.h3>
            <div className={`grid gap-5 ${catIdx % 2 === 0 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2"}`}>
              {group.products.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500" style={{ border: "1px solid hsl(30,20%,90%)" }}>
                  <div className="aspect-square overflow-hidden relative">
                    {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "hsl(30,25%,94%)" }}><ShoppingBag className="w-10 h-10 opacity-20" /></div>}
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }}
                      className="absolute top-3 left-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : ""}`} style={{ color: isFavorite(product.id) ? undefined : "hsl(30,50%,45%)" }} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-sm mb-2" style={{ color: "hsl(30,30%,20%)" }}>{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="font-bold" style={{ color: "hsl(30,50%,40%)" }}>{product.price.toLocaleString()} ج.م</p>
                      <Button size="sm" className="rounded-full text-[10px] h-8 text-white" style={{ backgroundColor: "hsl(30,50%,45%)" }}>أضف</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))
      ) : products.length === 0 ? (
        <div className="text-center py-20" style={{ color: "hsl(30,20%,55%)" }}>لا توجد منتجات حالياً</div>
      ) : null}

      {uncategorizedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-14">
          <h3 className="text-2xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(30,30%,25%)" }}>أخرى</h3>
          <div className="grid grid-cols-2 gap-5">
            {uncategorizedProducts.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: "1px solid hsl(30,20%,90%)" }}>
                <div className="aspect-square overflow-hidden">{p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "hsl(30,25%,94%)" }}><ShoppingBag className="w-10 h-10 opacity-20" /></div>}</div>
                <div className="p-4">
                  <h4 className="font-medium text-sm mb-2" style={{ color: "hsl(30,30%,20%)" }}>{p.name}</h4>
                  <p className="font-bold" style={{ color: "hsl(30,50%,40%)" }}>{p.price.toLocaleString()} ج.م</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: "hsl(30,20%,88%)", color: "hsl(30,15%,60%)" }}>
        <p>© 2026 {organization?.name || "StoreHub"} - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default HomeDecorStore;
