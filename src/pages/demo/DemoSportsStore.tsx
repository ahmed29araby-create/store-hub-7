import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Star, Heart, Dumbbell, Search, Trophy, Timer, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mockProducts = [
  { id: "1", name: "طقم رياضي Nike Dri-FIT", price: 1899, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80", category: "ملابس رياضية" },
  { id: "2", name: "حبل قفز احترافي", price: 199, image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80", category: "أدوات رياضية" },
  { id: "3", name: "بروتين واي جولد", price: 1450, image: "https://images.unsplash.com/photo-1593095948071-474c5cc2c3cf?w=600&q=80", category: "مكملات غذائية", badge: "الأكثر مبيعاً" },
  { id: "4", name: "جهاز مشي كهربائي", price: 12500, image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=80", category: "أجهزة رياضية" },
  { id: "5", name: "حذاء جري Adidas", price: 2799, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", category: "ملابس رياضية", badge: "جديد" },
  { id: "6", name: "دمبل قابل للتعديل 20 كجم", price: 3200, image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80", category: "أجهزة رياضية" },
  { id: "7", name: "قفازات تمرين", price: 180, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80", category: "أدوات رياضية" },
  { id: "8", name: "BCAA أمينو", price: 650, image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&q=80", category: "مكملات غذائية" },
];

const categories = ["الكل", "ملابس رياضية", "أدوات رياضية", "مكملات غذائية", "أجهزة رياضية"];

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`sport-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const DemoSportsStore = () => {
  const navigate = useNavigate();

  const grouped = categories.slice(1).reduce((acc, cat) => {
    acc[cat] = mockProducts.filter(p => p.category === cat);
    return acc;
  }, {} as Record<string, typeof mockProducts>);

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(0, 0%, 3%)", fontFamily: "'Inter', sans-serif", color: "white" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl border-b" style={{ backgroundColor: "hsla(0,0%,3%,0.85)", borderColor: "hsla(145,80%,40%,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6" style={{ color: "hsl(145, 80%, 45%)" }} />
            <h1 className="text-xl font-black uppercase tracking-wider" style={{ color: "hsl(145, 80%, 45%)" }}>
              FIT STORE
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/5">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/5 relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-black font-bold" style={{ backgroundColor: "hsl(145,80%,45%)" }}>2</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Demo Banner */}
      <div className="text-center py-2.5 text-sm font-bold text-black uppercase tracking-wider" style={{ backgroundColor: "hsl(145, 80%, 45%)" }}>
        <span>عرض تجريبي • </span>
        <button onClick={() => navigate("/register?type=sports")} className="underline hover:opacity-80">
          سجّل الآن
        </button>
      </div>

      {/* Hero - Bold Athletic */}
      <section className="relative h-[90vh] overflow-hidden">
        <motion.div initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2 }}
          className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80" alt=""
            className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsla(0,0%,0%,0.8) 0%, hsla(0,0%,0%,0.4) 50%, hsla(145,80%,20%,0.3) 100%)" }} />
        
        {/* Diagonal Cut */}
        <div className="absolute bottom-0 inset-x-0 h-24" style={{ background: "linear-gradient(175deg, transparent 50%, hsl(0,0%,3%) 50%)" }} />
        
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6">
          <div>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mb-6">
              <div className="w-12 h-[3px]" style={{ backgroundColor: "hsl(145,80%,45%)" }} />
              <span className="text-xs font-bold uppercase tracking-[0.4em]" style={{ color: "hsl(145,80%,45%)" }}>
                NO LIMITS
              </span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              className="text-6xl md:text-9xl font-black mb-6 leading-[0.85] uppercase">
              ابدأ<br />
              <span style={{ color: "hsl(145, 80%, 45%)" }}>رحلتك</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="text-white/40 text-lg mb-10 max-w-md">
              ملابس رياضية، أجهزة، مكملات غذائية وأدوات تدريب احترافية
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
              <Button className="rounded-none px-10 py-7 text-sm font-black uppercase tracking-wider text-black"
                style={{ backgroundColor: "hsl(145,80%,45%)" }}>
                تسوق الآن <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y" style={{ borderColor: "hsla(145,80%,45%,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Trophy, label: "عملاء سعداء", value: "+5,000" },
            { icon: Timer, label: "توصيل سريع", value: "24 ساعة" },
            { icon: Target, label: "منتج أصلي", value: "100%" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: "hsl(145,80%,45%)" }} />
              <p className="text-2xl font-black" style={{ color: "hsl(145,80%,45%)" }}>{stat.value}</p>
              <p className="text-xs text-white/30">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Category Nav */}
      <div className="sticky top-[69px] z-30 border-b" style={{ backgroundColor: "hsla(0,0%,5%,0.95)", borderColor: "hsla(145,80%,45%,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button key={cat} onClick={() => cat === "الكل" ? window.scrollTo({ top: 900, behavior: "smooth" }) : scrollToSection(cat)}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all rounded-none border"
              style={{ borderColor: "hsla(145,80%,45%,0.2)", color: "hsla(0,0%,100%,0.4)" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products by Category */}
      {categories.slice(1).map((cat, catIdx) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        return (
          <section key={cat} id={`sport-cat-${cat}`} className="max-w-7xl mx-auto px-6 py-14 scroll-mt-36">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="flex items-center gap-4 mb-8">
              <div className="w-8 h-[3px]" style={{ backgroundColor: "hsl(145,80%,45%)" }} />
              <h3 className="text-lg font-black uppercase tracking-wider">{cat}</h3>
            </motion.div>
            <div className={`grid gap-5 ${catIdx % 2 === 0 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
              {items.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer border overflow-hidden transition-all duration-300 hover:border-[hsla(145,80%,45%,0.3)]"
                  style={{ borderColor: "hsla(145,80%,45%,0.08)", backgroundColor: "hsla(0,0%,8%,0.5)" }}>
                  <div className="aspect-square overflow-hidden relative">
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    {product.badge && (
                      <span className="absolute top-3 right-3 text-[10px] px-2 py-1 font-black uppercase text-black"
                        style={{ backgroundColor: "hsl(145,80%,45%)" }}>
                        {product.badge}
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
                    <button className="absolute top-3 left-3 w-8 h-8 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-sm text-white/90 mb-2">{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="font-black" style={{ color: "hsl(145,80%,45%)" }}>{product.price.toLocaleString()} ج.م</p>
                      <Button size="sm" className="rounded-none text-[10px] h-8 font-bold uppercase text-black"
                        style={{ backgroundColor: "hsl(145,80%,45%)" }}>
                        أضف
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="py-24 text-center px-6 border-t" style={{ borderColor: "hsla(145,80%,45%,0.1)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-3xl font-black uppercase mb-4">عايز تفتح متجر رياضة؟</h3>
          <p className="text-white/30 mb-8 max-w-md mx-auto text-sm">سجّل الآن واحصل على متجرك بتصميم احترافي</p>
          <Button onClick={() => navigate("/register?type=sports")} size="lg" className="rounded-none px-12 font-black uppercase text-black"
            style={{ backgroundColor: "hsl(145,80%,45%)" }}>
            ابدأ متجرك الآن <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-white/15" style={{ borderColor: "hsla(145,80%,45%,0.1)" }}>
        <p>© 2026 StoreHub - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default DemoSportsStore;
