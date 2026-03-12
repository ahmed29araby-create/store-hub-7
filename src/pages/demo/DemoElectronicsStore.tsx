import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Star, Heart, Cpu, Search, Zap, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mockProducts = [
  { id: "1", name: "آيفون 16 برو ماكس", price: 52999, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80", category: "جوالات", hot: true },
  { id: "2", name: "ماك بوك برو M4", price: 89999, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80", category: "لابتوبات" },
  { id: "3", name: "سماعات AirPods Pro", price: 1299, image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80", category: "سماعات" },
  { id: "4", name: "ساعة Apple Watch Ultra", price: 3699, image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&q=80", category: "ساعات ذكية" },
  { id: "5", name: "شاحن لاسلكي MagSafe", price: 299, image: "https://images.unsplash.com/photo-1628815113969-0487917e8b76?w=600&q=80", category: "إكسسوارات موبايلات" },
  { id: "6", name: "مكنسة روبوت ذكية", price: 4500, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80", category: "أجهزة منزلية" },
  { id: "7", name: "آيباد برو M4", price: 44999, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80", category: "لابتوبات" },
  { id: "8", name: "سماعة JBL بلوتوث", price: 899, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80", category: "سماعات" },
];

const categories = ["الكل", "جوالات", "لابتوبات", "سماعات", "ساعات ذكية", "إكسسوارات موبايلات", "أجهزة منزلية"];

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`elec-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const DemoElectronicsStore = () => {
  const navigate = useNavigate();

  const grouped = categories.slice(1).reduce((acc, cat) => {
    acc[cat] = mockProducts.filter(p => p.category === cat);
    return acc;
  }, {} as Record<string, typeof mockProducts>);

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(220, 25%, 6%)", fontFamily: "'Inter', sans-serif", color: "white" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl border-b" style={{ backgroundColor: "hsla(220,25%,6%,0.85)", borderColor: "hsla(220,70%,50%,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(220,70%,50%), hsl(260,70%,60%))" }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(220,70%,60%), hsl(260,70%,70%))" }}>
              تِك ستور
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/5">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/5 relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg, hsl(220,70%,50%), hsl(260,70%,60%))" }}>2</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Demo Banner */}
      <div className="text-center py-2.5 text-sm font-medium text-white" style={{ background: "linear-gradient(90deg, hsl(220,70%,50%), hsl(260,70%,55%))" }}>
        <span>هذا عرض تجريبي لمتجر إلكترونيات • </span>
        <button onClick={() => navigate("/register?type=electronics")} className="underline font-bold hover:opacity-80">
          سجّل الآن وابدأ متجرك
        </button>
      </div>

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
              <Zap className="w-3 h-3" /> أحدث التقنيات لعام 2026
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-5xl lg:text-7xl font-bold mb-6 leading-[1.1]">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, white, hsl(220,70%,70%))" }}>
                عالم التقنية
              </span>
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(220,70%,60%), hsl(260,70%,65%))" }}>
                بين يديك
              </span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-white/40 text-lg mb-10 max-w-md">
              جوالات، لابتوبات، سماعات وأكثر بأفضل الأسعار وضمان رسمي
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Button className="rounded-xl px-8 py-6 text-sm font-semibold text-white border-0"
                style={{ background: "linear-gradient(135deg, hsl(220,70%,50%), hsl(260,70%,55%))" }}>
                تسوق الآن <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 40, rotateY: -10 }} animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ delay: 0.5, duration: 1 }} className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl opacity-30 blur-xl" style={{ background: "linear-gradient(135deg, hsl(220,70%,50%), hsl(260,70%,60%))" }} />
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" alt=""
                className="w-full h-80 object-cover rounded-3xl relative z-10 border" style={{ borderColor: "hsla(220,70%,50%,0.2)" }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Nav */}
      <div className="sticky top-[69px] z-30 border-y" style={{ backgroundColor: "hsla(220,25%,8%,0.95)", borderColor: "hsla(220,70%,50%,0.1)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button key={cat} onClick={() => cat === "الكل" ? window.scrollTo({ top: 800, behavior: "smooth" }) : scrollToSection(cat)}
              className="px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border"
              style={{ borderColor: "hsla(220,70%,50%,0.15)", color: "hsla(0,0%,100%,0.5)" }}>
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
          <section key={cat} id={`elec-cat-${cat}`} className="max-w-7xl mx-auto px-6 py-14 scroll-mt-36">
            <motion.h3 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="text-xl font-bold mb-8 flex items-center gap-3">
              <div className="w-1.5 h-6 rounded-full" style={{ background: "linear-gradient(180deg, hsl(220,70%,50%), hsl(260,70%,60%))" }} />
              {cat}
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer rounded-2xl border overflow-hidden transition-all duration-300 hover:border-[hsla(220,70%,50%,0.3)]"
                  style={{ backgroundColor: "hsla(220,25%,10%,0.5)", borderColor: "hsla(220,70%,50%,0.08)" }}>
                  <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: "hsla(220,25%,12%,0.5)" }}>
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    {product.hot && (
                      <span className="absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-full font-bold text-white"
                        style={{ background: "linear-gradient(135deg, hsl(220,70%,50%), hsl(260,70%,55%))" }}>
                        🔥 الأكثر مبيعاً
                      </span>
                    )}
                    <button className="absolute top-3 left-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-2.5 h-2.5" style={{ fill: "hsl(45,100%,51%)", color: "hsl(45,100%,51%)" }} />
                      ))}
                      <span className="text-[10px] text-white/30 mr-1">(42)</span>
                    </div>
                    <h4 className="font-medium text-sm mb-3 text-white/90">{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="font-bold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(220,70%,60%), hsl(260,70%,70%))" }}>
                        {product.price.toLocaleString()} ج.م
                      </p>
                      <Button size="sm" className="rounded-lg text-[10px] h-8 text-white border-0"
                        style={{ background: "linear-gradient(135deg, hsl(220,70%,50%), hsl(260,70%,55%))" }}>
                        أضف للسلة
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Features */}
      <section className="py-16 border-t" style={{ borderColor: "hsla(220,70%,50%,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "ضمان رسمي", desc: "جميع المنتجات بضمان رسمي من الوكيل" },
            { icon: Zap, title: "شحن سريع", desc: "توصيل خلال 24 ساعة لجميع المدن" },
            { icon: Headphones, title: "دعم فني", desc: "فريق دعم فني متاح على مدار الساعة" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="p-6 rounded-2xl border text-center" style={{ backgroundColor: "hsla(220,25%,10%,0.3)", borderColor: "hsla(220,70%,50%,0.08)" }}>
              <f.icon className="w-8 h-8 mx-auto mb-3" style={{ color: "hsl(220,70%,60%)" }} />
              <h4 className="font-bold text-sm mb-1">{f.title}</h4>
              <p className="text-xs text-white/30">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-3xl font-bold mb-4">عايز تفتح متجر إلكترونيات أونلاين؟</h3>
          <p className="text-white/30 mb-8 max-w-md mx-auto text-sm">سجّل الآن واحصل على متجرك الإلكتروني بتصميم احترافي</p>
          <Button onClick={() => navigate("/register?type=electronics")} size="lg" className="rounded-xl px-10 text-white border-0"
            style={{ background: "linear-gradient(135deg, hsl(220,70%,50%), hsl(260,70%,55%))" }}>
            ابدأ متجرك الآن <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-white/15" style={{ borderColor: "hsla(220,70%,50%,0.1)" }}>
        <p>© 2026 StoreHub - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default DemoElectronicsStore;
