import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Star, Heart, Zap, Search, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`elec-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const ElectronicsStore = () => {
  const { organization, products, categories, groupedProducts, uncategorizedProducts, isLoading, orgId } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "hsl(220, 25%, 6%)", color: "white" }}>جاري التحميل...</div>;
  if (!organization) return <div className="min-h-screen flex items-center justify-center" dir="rtl" style={{ backgroundColor: "hsl(220, 25%, 6%)", color: "white/50" }}>المتجر غير موجود</div>;

  const heroTitle = settings?.hero_title || "عالم التقنية بين يديك";
  const heroSubtitle = settings?.hero_subtitle || "جوالات، لابتوبات، سماعات وأكثر بأفضل الأسعار وضمان رسمي";
  const heroButton = settings?.hero_button_text || "تسوق الآن";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80";

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(220, 25%, 6%)", fontFamily: "'Inter', sans-serif", color: "white" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-2xl border-b" style={{ backgroundColor: "hsla(220,25%,6%,0.85)", borderColor: "hsla(220,70%,50%,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(220,70%,50%), hsl(260,70%,60%))" }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(220,70%,60%), hsl(260,70%,70%))" }}>
              {organization.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/5"><Search className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/5 relative"><ShoppingBag className="w-5 h-5" /></Button>
          </div>
        </div>
      </nav>

      {/* Hero - Futuristic */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] -top-40 -right-40" style={{ backgroundColor: "hsl(220,70%,50%)" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[80px] bottom-20 left-20" style={{ backgroundColor: "hsl(260,70%,60%)" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6 border"
              style={{ borderColor: "hsla(220,70%,50%,0.3)", color: "hsl(220,70%,65%)" }}>
              <Zap className="w-3 h-3" /> أحدث التقنيات
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-5xl lg:text-7xl font-bold mb-6 leading-[1.1]">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, white, hsl(220,70%,70%))" }}>{heroTitle}</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-white/40 text-lg mb-10 max-w-md">{heroSubtitle}</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Button className="rounded-xl px-8 py-6 text-sm font-semibold text-white border-0" style={{ background: "linear-gradient(135deg, hsl(220,70%,50%), hsl(260,70%,55%))" }}>
                {heroButton} <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }} className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl opacity-30 blur-xl" style={{ background: "linear-gradient(135deg, hsl(220,70%,50%), hsl(260,70%,60%))" }} />
              <img src={heroImage} alt="" className="w-full h-80 object-cover rounded-3xl relative z-10 border" style={{ borderColor: "hsla(220,70%,50%,0.2)" }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Nav */}
      {categories.length > 0 && (
        <div className="sticky top-[69px] z-30 border-y" style={{ backgroundColor: "hsla(220,25%,8%,0.95)", borderColor: "hsla(220,70%,50%,0.1)", backdropFilter: "blur(20px)" }}>
          <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => scrollToSection(cat.name)}
                className="px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border"
                style={{ borderColor: "hsla(220,70%,50%,0.15)", color: "hsla(0,0%,100%,0.5)" }}>{cat.name}</button>
            ))}
          </div>
        </div>
      )}

      {/* Products by Category */}
      {groupedProducts.length > 0 ? (
        groupedProducts.map((group) => (
          <section key={group.category.id} id={`elec-cat-${group.category.name}`} className="max-w-7xl mx-auto px-6 py-14 scroll-mt-36">
            <motion.h3 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="text-xl font-bold mb-8 flex items-center gap-3">
              <div className="w-1.5 h-6 rounded-full" style={{ background: "linear-gradient(180deg, hsl(220,70%,50%), hsl(260,70%,60%))" }} />
              {group.category.name}
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.products.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer rounded-2xl border overflow-hidden transition-all duration-300 hover:border-[hsla(220,70%,50%,0.3)]"
                  style={{ backgroundColor: "hsla(220,25%,10%,0.5)", borderColor: "hsla(220,70%,50%,0.08)" }}>
                  <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: "hsla(220,25%,12%,0.5)" }}>
                    {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-12 h-12 opacity-20" /></div>}
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }}
                      className="absolute top-3 left-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, s) => <Star key={s} className="w-2.5 h-2.5" style={{ fill: "hsl(45,100%,51%)", color: "hsl(45,100%,51%)" }} />)}
                    </div>
                    <h4 className="font-medium text-sm mb-3 text-white/90">{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="font-bold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(220,70%,60%), hsl(260,70%,70%))" }}>
                        {product.price.toLocaleString()} ج.م
                      </p>
                      <Button size="sm" className="rounded-lg text-[10px] h-8 text-white border-0" style={{ background: "linear-gradient(135deg, hsl(220,70%,50%), hsl(260,70%,55%))" }}>أضف للسلة</Button>
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
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <div className="w-1.5 h-6 rounded-full" style={{ background: "linear-gradient(180deg, hsl(220,70%,50%), hsl(260,70%,60%))" }} />أخرى
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {uncategorizedProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group cursor-pointer rounded-2xl border overflow-hidden" style={{ backgroundColor: "hsla(220,25%,10%,0.5)", borderColor: "hsla(220,70%,50%,0.08)" }}>
                <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: "hsla(220,25%,12%,0.5)" }}>
                  {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-12 h-12 opacity-20" /></div>}
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-sm mb-3 text-white/90">{product.name}</h4>
                  <p className="font-bold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(220,70%,60%), hsl(260,70%,70%))" }}>{product.price.toLocaleString()} ج.م</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 border-t" style={{ borderColor: "hsla(220,70%,50%,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "ضمان رسمي", desc: "جميع المنتجات بضمان رسمي" },
            { icon: Zap, title: "شحن سريع", desc: "توصيل خلال 24 ساعة" },
            { icon: Headphones, title: "دعم فني", desc: "فريق دعم متاح على مدار الساعة" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="p-6 rounded-2xl border text-center" style={{ backgroundColor: "hsla(220,25%,10%,0.3)", borderColor: "hsla(220,70%,50%,0.08)" }}>
              <f.icon className="w-8 h-8 mx-auto mb-3" style={{ color: "hsl(220,70%,60%)" }} />
              <h4 className="font-bold text-sm mb-1">{f.title}</h4>
              <p className="text-xs text-white/30">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-white/15" style={{ borderColor: "hsla(220,70%,50%,0.1)" }}>
        <p>© 2026 {organization.name} - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default ElectronicsStore;
