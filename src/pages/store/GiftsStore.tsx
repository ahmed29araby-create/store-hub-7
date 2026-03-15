import { motion } from "framer-motion";
import { ShoppingBag, Heart, Gift, Sparkles, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`gift-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const GiftsStore = () => {
  const { organization, products, categories, groupedProducts, uncategorizedProducts, isLoading, orgId } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "hsl(340, 30%, 97%)" }}>جاري التحميل...</div>;

  const heroTitle = settings?.hero_title || "اصنع لحظة سعادة";
  const heroSubtitle = settings?.hero_subtitle || "هدايا، ورد، شوكولاتة وتغليف فاخر لكل المناسبات";
  const heroButton = settings?.hero_button_text || "تسوق الآن";

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(340, 30%, 97%)", fontFamily: "'Inter', sans-serif" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b" style={{ borderColor: "hsl(340,40%,90%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5" style={{ color: "hsl(340, 60%, 55%)" }} />
            <h1 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(340, 60%, 40%)" }}>{organization?.name || "هدايا ستور"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" style={{ color: "hsl(340,60%,55%)" }}><Heart className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="relative" style={{ color: "hsl(340,60%,55%)" }}><ShoppingBag className="w-5 h-5" /></Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(340,30%,95%) 0%, hsl(340,30%,97%) 100%)" }}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute w-80 h-80 rounded-full -top-20 right-1/4" style={{ backgroundColor: "hsl(340,60%,85%)" }} />
          <div className="absolute w-60 h-60 rounded-full bottom-0 left-10" style={{ backgroundColor: "hsl(20,80%,88%)" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative z-10">
          <div className="max-w-lg">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
              style={{ backgroundColor: "hsl(340,60%,92%)", color: "hsl(340,60%,45%)" }}>
              <Sparkles className="w-3.5 h-3.5" /> لحظات سعادة لا تُنسى
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-5xl lg:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(340,60%,30%)" }}>
              {heroTitle}
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-lg mb-8 max-w-md" style={{ color: "hsl(340,20%,50%)" }}>{heroSubtitle}</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Button className="rounded-full px-8 py-6 text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, hsl(340,60%,55%), hsl(350,70%,60%))" }}>
                {heroButton} <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Nav */}
      {categories.length > 0 && (
        <div className="sticky top-[69px] z-30 bg-white/95 backdrop-blur-xl shadow-sm border-b" style={{ borderColor: "hsl(340,40%,92%)" }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => scrollToSection(cat.name)}
                className="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border"
                style={{ borderColor: "hsl(340,40%,88%)", color: "hsl(340,60%,45%)" }}>{cat.name}</button>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {groupedProducts.length > 0 ? (
        groupedProducts.map((group, catIdx) => (
          <section key={group.category.id} id={`gift-cat-${group.category.name}`} className="max-w-7xl mx-auto px-6 py-12 scroll-mt-36">
            <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-xl font-bold mb-8 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(340,60%,35%)" }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "hsl(340,60%,90%)" }}>
                <Sparkles className="w-3 h-3" style={{ color: "hsl(340,60%,55%)" }} />
              </div>
              {group.category.name}
            </motion.h3>
            <div className={`grid gap-5 ${catIdx % 2 === 0 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
              {group.products.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                  style={{ border: "1px solid hsl(340,40%,92%)" }}>
                  <div className="aspect-square overflow-hidden relative">
                    {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "hsl(340,30%,95%)" }}><Gift className="w-10 h-10 opacity-20" /></div>}
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }}
                      className="absolute top-3 left-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : ""}`} style={{ color: isFavorite(product.id) ? undefined : "hsl(340,60%,55%)" }} />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, s) => <Star key={s} className="w-2.5 h-2.5" style={{ fill: "hsl(340,60%,55%)", color: "hsl(340,60%,55%)" }} />)}
                    </div>
                    <h4 className="font-medium text-sm mb-2" style={{ color: "hsl(340,60%,25%)" }}>{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="font-bold" style={{ color: "hsl(340,60%,50%)" }}>{product.price} ج.م</p>
                      <Button size="sm" className="rounded-full text-[10px] h-8 text-white" style={{ background: "linear-gradient(135deg, hsl(340,60%,55%), hsl(350,70%,60%))" }}>أضف</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))
      ) : products.length === 0 ? (
        <div className="text-center py-20" style={{ color: "hsl(340,20%,60%)" }}>لا توجد منتجات حالياً</div>
      ) : null}

      {uncategorizedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(340,60%,35%)" }}>أخرى</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {uncategorizedProducts.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm" style={{ border: "1px solid hsl(340,40%,92%)" }}>
                <div className="aspect-square overflow-hidden relative">
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "hsl(340,30%,95%)" }}><Gift className="w-10 h-10 opacity-20" /></div>}
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-sm mb-2" style={{ color: "hsl(340,60%,25%)" }}>{p.name}</h4>
                  <p className="font-bold" style={{ color: "hsl(340,60%,50%)" }}>{p.price} ج.م</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="py-16" style={{ backgroundColor: "hsl(340,30%,95%)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: "تغليف فاخر", desc: "تغليف احترافي يليق بكل مناسبة" },
            { title: "توصيل سريع", desc: "توصيل في نفس اليوم" },
            { title: "بطاقات إهداء", desc: "أضف رسالتك الشخصية" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="p-6 bg-white rounded-2xl" style={{ border: "1px solid hsl(340,40%,90%)" }}>
              <h4 className="font-bold mb-1" style={{ color: "hsl(340,60%,40%)" }}>{f.title}</h4>
              <p className="text-sm" style={{ color: "hsl(340,20%,55%)" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: "hsl(340,40%,90%)", color: "hsl(340,20%,70%)" }}>
        <p>© 2026 {organization?.name || "StoreHub"} - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default GiftsStore;
