import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Heart, Gift, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mockProducts = [
  { id: "1", name: "باقة ورد طبيعي فاخرة", price: 450, image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&q=80", category: "ورد" },
  { id: "2", name: "صندوق شوكولاتة بلجيكية", price: 350, image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&q=80", category: "شوكولاتة" },
  { id: "3", name: "طقم هدية عطر ومبخرة", price: 899, image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&q=80", category: "هدايا", featured: true },
  { id: "4", name: "تغليف هدية فاخر مع بطاقة", price: 120, image: "https://images.unsplash.com/photo-1607469256872-48b2f30fae24?w=600&q=80", category: "تغليف هدايا" },
  { id: "5", name: "دبدوب مع باقة ورد", price: 550, image: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=600&q=80", category: "هدايا" },
  { id: "6", name: "بوكس شوكولاتة وورد", price: 750, image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&q=80", category: "شوكولاتة", featured: true },
  { id: "7", name: "شمعة عطرية فاخرة", price: 280, image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&q=80", category: "هدايا" },
  { id: "8", name: "ورد مجفف ملون", price: 320, image: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&q=80", category: "ورد" },
];

const categories = ["الكل", "هدايا", "ورد", "شوكولاتة", "تغليف هدايا"];

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`gift-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const DemoGiftsStore = () => {
  const navigate = useNavigate();

  const grouped = categories.slice(1).reduce((acc, cat) => {
    acc[cat] = mockProducts.filter(p => p.category === cat);
    return acc;
  }, {} as Record<string, typeof mockProducts>);

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(340, 30%, 97%)", fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b" style={{ borderColor: "hsl(340,40%,90%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5" style={{ color: "hsl(340, 60%, 55%)" }} />
            <h1 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(340, 60%, 40%)" }}>
              هدايا ستور
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" style={{ color: "hsl(340,60%,55%)" }}>
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" style={{ color: "hsl(340,60%,55%)" }}>
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "hsl(340,60%,55%)" }}>2</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Demo Banner */}
      <div className="text-center py-2.5 text-sm font-medium text-white" style={{ background: "linear-gradient(90deg, hsl(340,60%,55%), hsl(350,70%,60%))" }}>
        <span>هذا عرض تجريبي لمتجر هدايا ومناسبات • </span>
        <button onClick={() => navigate("/register?type=gifts")} className="underline font-bold hover:opacity-80">
          سجّل الآن
        </button>
      </div>

      {/* Hero - Romantic/Soft */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(340,30%,95%) 0%, hsl(340,30%,97%) 100%)" }}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute w-80 h-80 rounded-full -top-20 right-1/4" style={{ backgroundColor: "hsl(340,60%,85%)" }} />
          <div className="absolute w-60 h-60 rounded-full bottom-0 left-10" style={{ backgroundColor: "hsl(20,80%,88%)" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
              style={{ backgroundColor: "hsl(340,60%,92%)", color: "hsl(340,60%,45%)" }}>
              <Sparkles className="w-3.5 h-3.5" /> لحظات سعادة لا تُنسى
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-5xl lg:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(340,60%,30%)" }}>
              اصنع<br />لحظة سعادة
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-lg mb-8 max-w-md" style={{ color: "hsl(340,20%,50%)" }}>
              هدايا، ورد، شوكولاتة وتغليف فاخر لكل المناسبات
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Button className="rounded-full px-8 py-6 text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, hsl(340,60%,55%), hsl(350,70%,60%))" }}>
                تسوق الآن <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9, rotate: 3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }} className="hidden lg:grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&q=80" alt="" className="w-full h-48 object-cover rounded-2xl shadow-lg" />
            <img src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80" alt="" className="w-full h-48 object-cover rounded-2xl shadow-lg mt-8" />
            <img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&q=80" alt="" className="w-full h-48 object-cover rounded-2xl shadow-lg -mt-4" />
            <img src="https://images.unsplash.com/photo-1607469256872-48b2f30fae24?w=400&q=80" alt="" className="w-full h-48 object-cover rounded-2xl shadow-lg mt-4" />
          </motion.div>
        </div>
      </section>

      {/* Category Nav */}
      <div className="sticky top-[69px] z-30 bg-white/95 backdrop-blur-xl shadow-sm border-b" style={{ borderColor: "hsl(340,40%,92%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto">
          {categories.map((cat) => (
            <button key={cat} onClick={() => cat === "الكل" ? window.scrollTo({ top: 700, behavior: "smooth" }) : scrollToSection(cat)}
              className="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border"
              style={{ borderColor: "hsl(340,40%,88%)", color: "hsl(340,60%,45%)" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products by Category - Masonry-ish */}
      {categories.slice(1).map((cat, catIdx) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        return (
          <section key={cat} id={`gift-cat-${cat}`} className="max-w-7xl mx-auto px-6 py-12 scroll-mt-36">
            <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-xl font-bold mb-8 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(340,60%,35%)" }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "hsl(340,60%,90%)" }}>
                <Sparkles className="w-3 h-3" style={{ color: "hsl(340,60%,55%)" }} />
              </div>
              {cat}
            </motion.h3>
            <div className={`grid gap-5 ${catIdx % 2 === 0 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
              {items.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ${product.featured && catIdx % 2 === 0 ? "row-span-2" : ""}`}
                  style={{ border: "1px solid hsl(340,40%,92%)" }}>
                  <div className={`overflow-hidden relative ${product.featured ? "aspect-[3/4]" : "aspect-square"}`}>
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <button className="absolute top-3 left-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Heart className="w-4 h-4" style={{ color: "hsl(340,60%,55%)" }} />
                    </button>
                    {product.featured && (
                      <span className="absolute top-3 right-3 text-[10px] px-3 py-1 rounded-full font-medium text-white"
                        style={{ background: "linear-gradient(135deg, hsl(340,60%,55%), hsl(350,70%,60%))" }}>
                        ✨ مميز
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-2.5 h-2.5" style={{ fill: "hsl(340,60%,55%)", color: "hsl(340,60%,55%)" }} />
                      ))}
                    </div>
                    <h4 className="font-medium text-sm mb-2" style={{ color: "hsl(340,60%,25%)" }}>{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="font-bold" style={{ color: "hsl(340,60%,50%)" }}>{product.price} ج.م</p>
                      <Button size="sm" className="rounded-full text-[10px] h-8 text-white"
                        style={{ background: "linear-gradient(135deg, hsl(340,60%,55%), hsl(350,70%,60%))" }}>
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

      {/* Trust */}
      <section className="py-16" style={{ backgroundColor: "hsl(340,30%,95%)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: "تغليف فاخر", desc: "تغليف احترافي يليق بكل مناسبة" },
            { title: "توصيل سريع", desc: "توصيل في نفس اليوم داخل المدينة" },
            { title: "بطاقات إهداء", desc: "أضف رسالتك الشخصية مع كل هدية" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="p-6 bg-white rounded-2xl" style={{ border: "1px solid hsl(340,40%,90%)" }}>
              <h4 className="font-bold mb-1" style={{ color: "hsl(340,60%,40%)" }}>{f.title}</h4>
              <p className="text-sm" style={{ color: "hsl(340,20%,55%)" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(340,60%,35%)" }}>
            عايز تفتح متجر هدايا؟
          </h3>
          <p className="mb-8 max-w-md mx-auto text-sm" style={{ color: "hsl(340,20%,55%)" }}>سجّل الآن واحصل على متجرك بتصميم رومانسي احترافي</p>
          <Button onClick={() => navigate("/register?type=gifts")} size="lg" className="rounded-full px-10 text-white"
            style={{ background: "linear-gradient(135deg, hsl(340,60%,55%), hsl(350,70%,60%))" }}>
            ابدأ متجرك الآن <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: "hsl(340,40%,90%)", color: "hsl(340,20%,70%)" }}>
        <p>© 2026 StoreHub - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default DemoGiftsStore;
