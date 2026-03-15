import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";
import { useRef } from "react";

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`clothing-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const ClothingStore = () => {
  const { organization, products, categories, groupedProducts, uncategorizedProducts, isLoading, orgId } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  if (isLoading) return <div className="min-h-screen bg-[hsl(0,0%,4%)] text-white flex items-center justify-center">جاري التحميل...</div>;

  const heroTitle = settings?.hero_title || "أناقة بلا حدود";
  const heroSubtitle = settings?.hero_subtitle || "اكتشف أحدث صيحات الموضة والأزياء العصرية";
  const heroButton = settings?.hero_button_text || "تسوق الآن";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80";

  return (
    <div className="min-h-screen bg-[hsl(0,0%,4%)] text-white" dir="rtl" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-2xl bg-black/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>
            {organization?.name || "NOIR"}
          </h1>
          <div className="flex items-center gap-5">
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/5"><Heart className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/5 relative"><ShoppingBag className="w-5 h-5" /></Button>
          </div>
        </div>
      </nav>

      {/* Hero - Editorial Full Screen */}
      <div ref={heroRef} className="relative h-screen overflow-hidden pt-[69px]">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0 bg-cover bg-center">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="relative z-10 h-full flex items-end pb-20 max-w-7xl mx-auto px-6">
          <div>
            <motion.div initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.3, duration: 1 }} className="h-[1px] bg-white/40 mb-6" />
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-xs uppercase tracking-[0.5em] text-white/50 mb-4">{heroSubtitle}</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }}
              className="text-6xl md:text-8xl font-bold mb-6 leading-[0.9]" style={{ fontFamily: "'Playfair Display', serif" }}>{heroTitle}</motion.h2>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex gap-4">
              <Button className="bg-white text-black hover:bg-white/90 rounded-none px-10 py-6 text-xs uppercase tracking-[0.3em]">{heroButton}</Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-none px-10 py-6 text-xs uppercase tracking-[0.3em]">المجموعة الجديدة</Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Category Sticky Strip */}
      {categories.length > 0 && (
        <div className="sticky top-[69px] z-30 bg-black/90 backdrop-blur-xl border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex gap-6 overflow-x-auto">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => scrollToSection(cat.name)}
                className="text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors whitespace-nowrap pb-1 border-b border-transparent hover:border-white">
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products by Category */}
      {groupedProducts.length > 0 ? (
        groupedProducts.map((group) => (
          <section key={group.category.id} id={`clothing-cat-${group.category.name}`} className="max-w-7xl mx-auto px-6 py-16 scroll-mt-40">
            <motion.h3 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="text-2xl font-bold mb-8 border-r-2 border-white/30 pr-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {group.category.name}
            </motion.h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {group.products.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden mb-3 relative bg-white/5">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s] ease-out" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-12 h-12 opacity-20" /></div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }}
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-black"}`} />
                        </button>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center"><Eye className="w-4 h-4 text-black" /></button>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center"><ShoppingBag className="w-4 h-4 text-black" /></button>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-medium text-sm text-white/90">{product.name}</h4>
                  <p className="text-white/40 text-sm mt-1">{product.price} ج.م</p>
                </motion.div>
              ))}
            </div>
          </section>
        ))
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-white/30">لا توجد منتجات حالياً</div>
      ) : null}

      {uncategorizedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h3 className="text-2xl font-bold mb-8 border-r-2 border-white/30 pr-4" style={{ fontFamily: "'Playfair Display', serif" }}>أخرى</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {uncategorizedProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden mb-3 relative bg-white/5">
                  {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s]" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-12 h-12 opacity-20" /></div>}
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }} className="absolute top-3 left-3 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-black"}`} />
                  </button>
                </div>
                <h4 className="font-medium text-sm text-white/90">{product.name}</h4>
                <p className="text-white/40 text-sm mt-1">{product.price} ج.م</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: "شحن مجاني", desc: "على الطلبات فوق 500 ج.م" },
            { title: "إرجاع سهل", desc: "خلال 14 يوم من الاستلام" },
            { title: "دفع آمن", desc: "طرق دفع متعددة ومؤمنة" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-2 text-white/80">{f.title}</h4>
              <p className="text-xs text-white/30">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-white/20">
        <p>© 2026 {organization?.name || "StoreHub"} - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default ClothingStore;
