import { motion } from "framer-motion";
import { ShoppingBag, Heart, Flame, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";
import { useState } from "react";

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`rest-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const RestaurantStore = () => {
  const { organization, products, categories, groupedProducts, uncategorizedProducts, isLoading, orgId } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);
  const [activeCategory, setActiveCategory] = useState("الكل");

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "hsl(20, 30%, 5%)", color: "hsl(30, 20%, 60%)" }}>جاري التحميل...</div>;
  }

  const heroTitle = settings?.hero_title || "نكهات لا تُنسى";
  const heroSubtitle = settings?.hero_subtitle || "أطباق مُعدّة بشغف من أجود المكونات الطازجة";
  const heroButton = settings?.hero_button_text || "اطلب الآن";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80";

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(20, 30%, 5%)", fontFamily: "'Inter', sans-serif", color: "hsl(30, 20%, 90%)" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl border-b" style={{ backgroundColor: "hsla(20,30%,5%,0.85)", borderColor: "hsla(15,80%,50%,0.15)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6" style={{ color: "hsl(15, 80%, 55%)" }} />
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(15, 80%, 55%)" }}>
              {organization?.name || "ذوق"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: "hsla(15,80%,50%,0.15)", color: "hsl(15,80%,60%)" }}>
              <Clock className="w-3.5 h-3.5" />
              <span>مفتوح الآن</span>
            </div>
            <Button variant="ghost" size="icon" className="relative hover:bg-white/5" style={{ color: "hsl(30,20%,80%)" }}>
              <ShoppingBag className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero - Immersive */}
      <div className="relative h-[85vh] overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsla(20,30%,5%,0.3) 0%, hsla(20,30%,5%,0.7) 50%, hsl(20,30%,5%) 100%)" }} />
        <div className="relative z-10 h-full flex items-end pb-20">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <motion.h2 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
              className="text-6xl md:text-8xl font-bold mb-4 leading-[1]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {heroTitle}
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="text-base max-w-md mb-8" style={{ color: "hsla(30,20%,90%,0.5)" }}>
              {heroSubtitle}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
              className="flex gap-4">
              <Button className="rounded-full px-8 py-6 text-sm font-semibold" style={{ backgroundColor: "hsl(15, 80%, 50%)", color: "white" }}>
                {heroButton}
              </Button>
              <Button variant="outline" className="rounded-full px-8 py-6 text-sm" style={{ borderColor: "hsla(30,20%,90%,0.2)", color: "hsl(30,20%,90%)" }}>
                القائمة الكاملة
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Category Quick Nav - Floating Cards */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat, i) => (
              <motion.button key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                onClick={() => { setActiveCategory(cat.name); scrollToSection(cat.name); }}
                className={`flex-shrink-0 flex flex-col items-center gap-2 px-8 py-5 rounded-2xl border transition-all duration-300 ${
                  activeCategory === cat.name ? "scale-105" : "hover:scale-105"
                }`}
                style={{
                  backgroundColor: activeCategory === cat.name ? "hsl(15,80%,50%)" : "hsla(20,30%,12%,0.9)",
                  borderColor: activeCategory === cat.name ? "hsl(15,80%,50%)" : "hsla(30,20%,90%,0.05)",
                  backdropFilter: "blur(20px)",
                  color: activeCategory === cat.name ? "white" : "hsl(30,20%,80%)"
                }}>
                <span className="text-sm font-medium">{cat.name}</span>
                <span className="text-[10px] opacity-60">{groupedProducts.find(g => g.category.id === cat.id)?.products.length || 0} أصناف</span>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* Menu by Category */}
      {groupedProducts.length > 0 ? (
        groupedProducts.map((group) => (
          <section key={group.category.id} id={`rest-cat-${group.category.name}`} className="max-w-7xl mx-auto px-6 py-14 scroll-mt-28">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="flex items-center gap-3 mb-8">
              <h3 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(15,80%,55%)" }}>
                {group.category.name}
              </h3>
              <div className="flex-1 h-[1px]" style={{ backgroundColor: "hsla(15,80%,50%,0.15)" }} />
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {group.products.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group flex gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                  style={{ backgroundColor: "hsla(20,30%,10%,0.6)", borderColor: "hsla(30,20%,90%,0.05)" }}>
                  <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "hsla(20,30%,15%,0.5)" }}>
                        <ShoppingBag className="w-8 h-8 opacity-20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{product.name}</h4>
                      </div>
                      {product.description && <p className="text-xs leading-relaxed" style={{ color: "hsla(30,20%,90%,0.4)" }}>{product.description}</p>}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-bold" style={{ color: "hsl(15, 80%, 55%)" }}>{product.price} ج.م</p>
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                          style={{ backgroundColor: "hsla(30,20%,90%,0.1)" }}>
                          <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-white/60"}`} />
                        </button>
                        <Button size="sm" className="rounded-full text-xs h-8" style={{ backgroundColor: "hsl(15,80%,50%)", color: "white" }}>
                          أضف للسلة
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))
      ) : products.length === 0 ? (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center py-12" style={{ color: "hsla(30,20%,90%,0.4)" }}>لا توجد أطباق حالياً</div>
        </section>
      ) : null}

      {uncategorizedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-14">
          <h3 className="text-2xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(15,80%,55%)" }}>أخرى</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {uncategorizedProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group flex gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                style={{ backgroundColor: "hsla(20,30%,10%,0.6)", borderColor: "hsla(30,20%,90%,0.05)" }}>
                <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "hsla(20,30%,15%,0.5)" }}><ShoppingBag className="w-8 h-8 opacity-20" /></div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{product.name}</h4>
                    {product.description && <p className="text-xs" style={{ color: "hsla(30,20%,90%,0.4)" }}>{product.description}</p>}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-bold" style={{ color: "hsl(15, 80%, 55%)" }}>{product.price} ج.م</p>
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }}>
                      <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-white/60"}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="py-20 border-t" style={{ borderColor: "hsla(30,20%,90%,0.05)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: Clock, title: "ساعات العمل", desc: "يومياً من 11 ص حتى 12 م" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="text-center p-8 rounded-2xl border" style={{ backgroundColor: "hsla(20,30%,10%,0.4)", borderColor: "hsla(30,20%,90%,0.05)" }}>
              <f.icon className="w-8 h-8 mx-auto mb-4" style={{ color: "hsl(15,80%,55%)" }} />
              <h4 className="font-bold mb-2">{f.title}</h4>
              <p className="text-sm" style={{ color: "hsla(30,20%,90%,0.4)" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: "hsla(30,20%,90%,0.05)", color: "hsla(30,20%,90%,0.2)" }}>
        <p>© 2026 {organization?.name || "StoreHub"} - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default RestaurantStore;
