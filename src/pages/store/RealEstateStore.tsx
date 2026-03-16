import { motion } from "framer-motion";
import { ShoppingBag, Heart, Building, Search, Shield, Truck, MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`re-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const RealEstateStore = () => {
  const { organization, products, categories, groupedProducts, uncategorizedProducts, isLoading, orgId } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "hsl(220, 25%, 97%)" }}>جاري التحميل...</div>;

  const heroTitle = settings?.hero_title || "عقارك المثالي ينتظرك";
  const heroSubtitle = settings?.hero_subtitle || "شقق، فلل، أراضي، ومحلات تجارية بأفضل المواقع والأسعار";
  const heroButton = settings?.hero_button_text || "تصفح العقارات";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(220, 25%, 97%)", fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b" style={{ borderColor: "hsl(220,20%,90%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "hsl(220, 60%, 45%)" }}>
              <Building className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold" style={{ color: "hsl(220, 50%, 25%)" }}>{organization?.name || "عقاراتي"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-white border rounded-full px-4 py-2 gap-2" style={{ borderColor: "hsl(220,20%,85%)" }}>
              <Search className="w-4 h-4 text-gray-400" />
              <input placeholder="ابحث عن عقار..." className="text-sm bg-transparent outline-none w-40" />
            </div>
            <Button variant="ghost" size="icon" className="relative" style={{ color: "hsl(220,60%,35%)" }}>
              <ShoppingBag className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(220,60%,45%) 0%, hsl(230,50%,35%) 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 rounded-full -top-20 -left-20 bg-white" />
          <div className="absolute w-64 h-64 rounded-full bottom-10 right-10 bg-white" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6" style={{ backgroundColor: "hsla(0,0%,100%,0.15)" }}>
              <Shield className="w-3.5 h-3.5" /> عقارات موثوقة ومضمونة
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">{heroTitle}</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-white/70 text-lg mb-8 max-w-md">{heroSubtitle}</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Button className="bg-white hover:bg-white/90 rounded-full px-8 py-6 text-sm font-semibold" style={{ color: "hsl(220,60%,35%)" }}>
                {heroButton} <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="hidden lg:block">
            <img src={heroImage} alt="" className="w-full h-80 object-cover rounded-3xl shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="sticky top-[69px] z-30 bg-white/95 backdrop-blur-xl shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => scrollToSection(cat.name)}
                className="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border"
                style={{ borderColor: "hsl(220,20%,85%)", color: "hsl(220,60%,35%)" }}>{cat.name}</button>
            ))}
          </div>
        </div>
      )}

      {/* Products by Category */}
      {groupedProducts.length > 0 ? (
        groupedProducts.map((group) => (
          <section key={group.category.id} id={`re-cat-${group.category.name}`} className="max-w-7xl mx-auto px-6 py-12 scroll-mt-36">
            <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: "hsl(220,50%,25%)" }}>
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: "hsl(220,60%,45%)" }} />
              {group.category.name}
            </motion.h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {group.products.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  style={{ borderColor: "hsl(220,20%,92%)" }}>
                  <div className="aspect-[4/5] overflow-hidden relative" style={{ backgroundColor: "hsl(220,25%,95%)" }}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Building className="w-10 h-10 opacity-20" /></div>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }}
                      className="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Heart className={`w-3.5 h-3.5 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : ""}`} style={{ color: isFavorite(product.id) ? undefined : "hsl(220,60%,45%)" }} />
                    </button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm mb-2" style={{ color: "hsl(220,50%,15%)" }}>{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm" style={{ color: "hsl(220,60%,45%)" }}>{product.price} ج.م</p>
                      <Button size="sm" className="rounded-full text-[10px] h-7 px-3 text-white" style={{ backgroundColor: "hsl(220,60%,45%)" }}>تفاصيل</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))
      ) : products.length === 0 ? (
        <div className="text-center py-20" style={{ color: "hsl(220,20%,50%)" }}>لا توجد عقارات حالياً</div>
      ) : null}

      {uncategorizedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: "hsl(220,50%,25%)" }}>
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: "hsl(220,60%,45%)" }} />أخرى
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {uncategorizedProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all cursor-pointer" style={{ borderColor: "hsl(220,20%,92%)" }}>
                <div className="aspect-[4/5] overflow-hidden relative" style={{ backgroundColor: "hsl(220,25%,95%)" }}>
                  {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><Building className="w-10 h-10 opacity-20" /></div>}
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }} className="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <Heart className={`w-3.5 h-3.5 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : ""}`} style={{ color: isFavorite(product.id) ? undefined : "hsl(220,60%,45%)" }} />
                  </button>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-2" style={{ color: "hsl(220,50%,15%)" }}>{product.name}</h4>
                  <p className="font-bold text-sm" style={{ color: "hsl(220,60%,45%)" }}>{product.price} ج.م</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Trust Section */}
      <section className="py-16" style={{ backgroundColor: "hsl(220,25%,95%)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Truck, title: "زيارة مجانية", desc: "زيارة ومعاينة العقار مجاناً" },
            { icon: Shield, title: "عقارات موثوقة", desc: "جميع العقارات موثقة وقانونية" },
            { icon: MessageCircle, title: "استشارة عقارية", desc: "خبراء متاحون للإجابة على استفساراتك" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="flex items-start gap-4 p-6 bg-white rounded-2xl" style={{ border: "1px solid hsl(220,20%,90%)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "hsl(220,60%,92%)" }}>
                <f.icon className="w-6 h-6" style={{ color: "hsl(220,60%,45%)" }} />
              </div>
              <div>
                <h4 className="font-bold mb-1" style={{ color: "hsl(220,50%,20%)" }}>{f.title}</h4>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-gray-400" style={{ borderColor: "hsl(220,20%,90%)" }}>
        <p>© 2026 {organization?.name || "StoreHub"} - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default RealEstateStore;
