import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Heart, Building, Search, Shield, Truck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mockProducts = [
  { id: "1", name: "شقة 120م² - المعادي", price: 1500000, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80", category: "شقق", tag: "مميز" },
  { id: "2", name: "فيلا 350م² - التجمع", price: 5500000, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80", category: "فلل" },
  { id: "3", name: "أرض 500م² - 6 أكتوبر", price: 2000000, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80", category: "أراضي" },
  { id: "4", name: "محل تجاري 80م²", price: 800000, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80", category: "محلات تجارية" },
  { id: "5", name: "شقة 200م² - مدينة نصر", price: 2200000, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80", category: "شقق", tag: "جديد" },
  { id: "6", name: "فيلا 500م² - الشيخ زايد", price: 8000000, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80", category: "فلل" },
  { id: "7", name: "أرض 1000م² - العين السخنة", price: 3500000, image: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=600&q=80", category: "أراضي" },
  { id: "8", name: "مكتب إداري 150م²", price: 1200000, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80", category: "محلات تجارية" },
];

const categories = ["الكل", "شقق", "فلل", "أراضي", "محلات تجارية"];

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`re-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const DemoRealEstateStore = () => {
  const navigate = useNavigate();

  const grouped = categories.slice(1).reduce((acc, cat) => {
    acc[cat] = mockProducts.filter(p => p.category === cat);
    return acc;
  }, {} as Record<string, typeof mockProducts>);

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(220, 25%, 97%)", fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b" style={{ borderColor: "hsl(220,20%,90%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "hsl(220, 60%, 45%)" }}>
              <Building className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold" style={{ color: "hsl(220, 50%, 25%)" }}>عقاراتي</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-white border rounded-full px-4 py-2 gap-2" style={{ borderColor: "hsl(220,20%,85%)" }}>
              <Search className="w-4 h-4 text-gray-400" />
              <input placeholder="ابحث عن عقار..." className="text-sm bg-transparent outline-none w-40" />
            </div>
            <Button variant="ghost" size="icon" className="relative" style={{ color: "hsl(220,60%,35%)" }}>
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "hsl(220,60%,45%)" }}>2</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Demo Banner */}
      <div className="text-center py-2.5 text-sm font-medium text-white" style={{ backgroundColor: "hsl(220, 60%, 45%)" }}>
        <span>هذا عرض تجريبي لموقع عقارات • </span>
        <button onClick={() => navigate("/register?type=real_estate")} className="underline font-bold hover:opacity-80">
          سجّل الآن وابدأ موقعك العقاري
        </button>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(220,60%,45%) 0%, hsl(230,50%,35%) 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 rounded-full -top-20 -left-20" style={{ backgroundColor: "white" }} />
          <div className="absolute w-64 h-64 rounded-full bottom-10 right-10" style={{ backgroundColor: "white" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6" style={{ backgroundColor: "hsla(0,0%,100%,0.15)" }}>
              <Shield className="w-3.5 h-3.5" /> عقارات موثوقة ومضمونة
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              عقارك المثالي<br />ينتظرك
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-white/70 text-lg mb-8 max-w-md">
              شقق، فلل، أراضي، ومحلات تجارية بأفضل المواقع والأسعار
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Button className="bg-white hover:bg-white/90 rounded-full px-8 py-6 text-sm font-semibold" style={{ color: "hsl(220,60%,35%)" }}>
                تصفح العقارات <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            className="hidden lg:block">
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" alt=""
              className="w-full h-80 object-cover rounded-3xl shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Category Pills */}
      <div className="sticky top-[69px] z-30 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto">
          {categories.map((cat) => (
            <button key={cat} onClick={() => cat === "الكل" ? window.scrollTo({ top: 600, behavior: "smooth" }) : scrollToSection(cat)}
              className="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border"
              style={{ borderColor: "hsl(220,20%,85%)", color: "hsl(220,60%,35%)" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products by Category */}
      {categories.slice(1).map((cat) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        return (
          <section key={cat} id={`re-cat-${cat}`} className="max-w-7xl mx-auto px-6 py-12 scroll-mt-36">
            <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: "hsl(220,50%,25%)" }}>
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: "hsl(220,60%,45%)" }} />
              {cat}
            </motion.h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  style={{ borderColor: "hsl(220,20%,92%)" }}>
                  <div className="aspect-[4/5] overflow-hidden relative" style={{ backgroundColor: "hsl(220,25%,95%)" }}>
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.tag && (
                      <span className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded-full font-bold text-white" style={{ backgroundColor: "hsl(220,60%,45%)" }}>
                        {product.tag}
                      </span>
                    )}
                    <button className="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Heart className="w-3.5 h-3.5" style={{ color: "hsl(220,60%,45%)" }} />
                    </button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm mb-2" style={{ color: "hsl(220,50%,15%)" }}>{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm" style={{ color: "hsl(220,60%,45%)" }}>{product.price.toLocaleString("ar-EG")} ج.م</p>
                      <Button size="sm" className="rounded-full text-[10px] h-7 px-3 text-white" style={{ backgroundColor: "hsl(220,60%,45%)" }}>
                        تفاصيل
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Trust Section */}
      <section className="py-16" style={{ backgroundColor: "hsl(220,25%,95%)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Truck, title: "زيارة مجانية", desc: "زيارة ومعاينة العقار مجاناً" },
            { icon: Shield, title: "عقارات موثوقة", desc: "جميع العقارات موثقة وقانونية" },
            { icon: MessageCircle, title: "استشارة عقارية", desc: "خبراء متاحون للإجابة على استفساراتك" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}
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

      {/* CTA */}
      <section className="py-20 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-3xl font-bold mb-4" style={{ color: "hsl(220,50%,25%)" }}>عايز تفتح موقع عقارات أونلاين؟</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">سجّل الآن واحصل على موقعك العقاري بتصميم احترافي</p>
          <Button onClick={() => navigate("/register?type=real_estate")} size="lg" className="rounded-full px-10 text-white"
            style={{ backgroundColor: "hsl(220,60%,45%)" }}>
            ابدأ موقعك الآن <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-gray-400" style={{ borderColor: "hsl(220,20%,90%)" }}>
        <p>© 2026 StoreHub - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default DemoRealEstateStore;
