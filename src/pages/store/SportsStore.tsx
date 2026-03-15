import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Heart, Dumbbell, Search, Trophy, Timer, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`sport-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const SportsStore = () => {
  const { organization, products, categories, groupedProducts, uncategorizedProducts, isLoading, orgId } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "hsl(0, 0%, 3%)", color: "white" }}>جاري التحميل...</div>;

  const heroTitle = settings?.hero_title || "ابدأ رحلتك";
  const heroSubtitle = settings?.hero_subtitle || "ملابس رياضية، أجهزة، مكملات غذائية وأدوات تدريب احترافية";
  const heroButton = settings?.hero_button_text || "تسوق الآن";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80";

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(0, 0%, 3%)", fontFamily: "'Inter', sans-serif", color: "white" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-2xl border-b" style={{ backgroundColor: "hsla(0,0%,3%,0.85)", borderColor: "hsla(145,80%,40%,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6" style={{ color: "hsl(145, 80%, 45%)" }} />
            <h1 className="text-xl font-black uppercase tracking-wider" style={{ color: "hsl(145, 80%, 45%)" }}>{organization?.name || "FIT STORE"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/5"><Search className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/5 relative"><ShoppingBag className="w-5 h-5" /></Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[90vh] overflow-hidden">
        <motion.div initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2 }} className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsla(0,0%,0%,0.8) 0%, hsla(0,0%,0%,0.4) 50%, hsla(145,80%,20%,0.3) 100%)" }} />
        <div className="absolute bottom-0 inset-x-0 h-24" style={{ background: "linear-gradient(175deg, transparent 50%, hsl(0,0%,3%) 50%)" }} />
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6">
          <div>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-2 mb-6">
              <div className="w-12 h-[3px]" style={{ backgroundColor: "hsl(145,80%,45%)" }} />
              <span className="text-xs font-bold uppercase tracking-[0.4em]" style={{ color: "hsl(145,80%,45%)" }}>NO LIMITS</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              className="text-6xl md:text-9xl font-black mb-6 leading-[0.85] uppercase">
              {heroTitle.split(" ").map((word, i) => (
                <span key={i} style={i > 0 ? { color: "hsl(145, 80%, 45%)" } : undefined}>{word}<br/></span>
              ))}
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-white/40 text-lg mb-10 max-w-md">{heroSubtitle}</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
              <Button className="rounded-none px-10 py-7 text-sm font-black uppercase tracking-wider text-black" style={{ backgroundColor: "hsl(145,80%,45%)" }}>
                {heroButton} <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y" style={{ borderColor: "hsla(145,80%,45%,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Trophy, label: "عملاء سعداء", value: "+5,000" },
            { icon: Timer, label: "توصيل سريع", value: "24 ساعة" },
            { icon: Target, label: "منتج أصلي", value: "100%" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: "hsl(145,80%,45%)" }} />
              <p className="text-2xl font-black" style={{ color: "hsl(145,80%,45%)" }}>{stat.value}</p>
              <p className="text-xs text-white/30">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Category Nav */}
      {categories.length > 0 && (
        <div className="sticky top-[69px] z-30 border-b" style={{ backgroundColor: "hsla(0,0%,5%,0.95)", borderColor: "hsla(145,80%,45%,0.1)" }}>
          <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => scrollToSection(cat.name)}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all rounded-none border"
                style={{ borderColor: "hsla(145,80%,45%,0.2)", color: "hsla(0,0%,100%,0.4)" }}>{cat.name}</button>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {groupedProducts.length > 0 ? (
        groupedProducts.map((group, catIdx) => (
          <section key={group.category.id} id={`sport-cat-${group.category.name}`} className="max-w-7xl mx-auto px-6 py-14 scroll-mt-36">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-4 mb-8">
              <div className="w-8 h-[3px]" style={{ backgroundColor: "hsl(145,80%,45%)" }} />
              <h3 className="text-lg font-black uppercase tracking-wider">{group.category.name}</h3>
            </motion.div>
            <div className={`grid gap-5 ${catIdx % 2 === 0 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
              {group.products.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer border overflow-hidden transition-all duration-300 hover:border-[hsla(145,80%,45%,0.3)]"
                  style={{ borderColor: "hsla(145,80%,45%,0.08)", backgroundColor: "hsla(0,0%,8%,0.5)" }}>
                  <div className="aspect-square overflow-hidden relative">
                    {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-10 h-10 opacity-20" /></div>}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }}
                      className="absolute top-3 left-3 w-8 h-8 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-sm text-white/90 mb-2">{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="font-black" style={{ color: "hsl(145,80%,45%)" }}>{product.price.toLocaleString()} ج.م</p>
                      <Button size="sm" className="rounded-none text-[10px] h-8 font-bold uppercase text-black" style={{ backgroundColor: "hsl(145,80%,45%)" }}>أضف</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-white/30">لا توجد منتجات حالياً</div>
      ) : null}

      {uncategorizedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex items-center gap-4 mb-8"><div className="w-8 h-[3px]" style={{ backgroundColor: "hsl(145,80%,45%)" }} /><h3 className="text-lg font-black uppercase tracking-wider">أخرى</h3></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {uncategorizedProducts.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group cursor-pointer border overflow-hidden" style={{ borderColor: "hsla(145,80%,45%,0.08)", backgroundColor: "hsla(0,0%,8%,0.5)" }}>
                <div className="aspect-square overflow-hidden relative">
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-10 h-10 opacity-20" /></div>}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-sm text-white/90 mb-2">{p.name}</h4>
                  <p className="font-black" style={{ color: "hsl(145,80%,45%)" }}>{p.price.toLocaleString()} ج.م</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t py-8 text-center text-xs text-white/15" style={{ borderColor: "hsla(145,80%,45%,0.1)" }}>
        <p>© 2026 {organization?.name || "StoreHub"} - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default SportsStore;
