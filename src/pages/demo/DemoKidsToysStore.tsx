import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Heart, Star, Baby, Puzzle, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mockProducts = [
  { id: "1", name: "فستان أطفال زهري", price: 350, image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80", category: "ملابس أطفال" },
  { id: "2", name: "مكعبات ليجو 500 قطعة", price: 450, image: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&q=80", category: "ألعاب", hot: true },
  { id: "3", name: "عربة أطفال فاخرة", price: 4500, image: "https://images.unsplash.com/photo-1586048956606-16d237a9b4b2?w=600&q=80", category: "عربات أطفال" },
  { id: "4", name: "رضّاعة مضادة للمغص", price: 120, image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80", category: "مستلزمات الرضع" },
  { id: "5", name: "بدلة أطفال رسمية", price: 550, image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80", category: "ملابس أطفال" },
  { id: "6", name: "لعبة تعليمية خشبية", price: 180, image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80", category: "ألعاب" },
  { id: "7", name: "كرسي سيارة للأطفال", price: 2800, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80", category: "عربات أطفال" },
  { id: "8", name: "حفاضات عبوة كبيرة", price: 250, image: "https://images.unsplash.com/photo-1584839404428-3a1e8e5d35a3?w=600&q=80", category: "مستلزمات الرضع" },
];

const categories = ["الكل", "ملابس أطفال", "ألعاب", "عربات أطفال", "مستلزمات الرضع"];

const catEmojis: Record<string, string> = {
  "ملابس أطفال": "👕",
  "ألعاب": "🧩",
  "عربات أطفال": "🍼",
  "مستلزمات الرضع": "👶",
};

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`kids-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const DemoKidsToysStore = () => {
  const navigate = useNavigate();

  const grouped = categories.slice(1).reduce((acc, cat) => {
    acc[cat] = mockProducts.filter(p => p.category === cat);
    return acc;
  }, {} as Record<string, typeof mockProducts>);

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(45, 50%, 97%)", fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b" style={{ borderColor: "hsl(45,40%,88%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(280,60%,60%), hsl(200,70%,55%))" }}>
              <Baby className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black" style={{ color: "hsl(280, 60%, 45%)" }}>كيدز لاند</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" style={{ color: "hsl(280,60%,55%)" }}>
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" style={{ color: "hsl(280,60%,55%)" }}>
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg, hsl(280,60%,55%), hsl(200,70%,55%))" }}>3</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Demo Banner */}
      <div className="text-center py-2.5 text-sm font-medium text-white" style={{ background: "linear-gradient(90deg, hsl(280,60%,55%), hsl(200,70%,55%), hsl(45,80%,55%))" }}>
        <span>عرض تجريبي لمتجر أطفال وألعاب 🎈 • </span>
        <button onClick={() => navigate("/register?type=kids_toys")} className="underline font-bold hover:opacity-80">
          سجّل الآن
        </button>
      </div>

      {/* Hero - Playful & Colorful */}
      <section className="relative overflow-hidden py-16 lg:py-24" style={{ background: "linear-gradient(135deg, hsl(280,50%,92%) 0%, hsl(200,60%,92%) 50%, hsl(45,70%,92%) 100%)" }}>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div key={i} initial={{ y: 0 }} animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-16 h-16 rounded-full opacity-20"
              style={{
                backgroundColor: i % 3 === 0 ? "hsl(280,60%,60%)" : i % 3 === 1 ? "hsl(200,70%,55%)" : "hsl(45,80%,55%)",
                top: `${15 + (i * 25) % 70}%`,
                left: `${10 + (i * 30) % 80}%`,
              }} />
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-4xl mb-4">🎈🧸🎁</motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
              <span style={{ color: "hsl(280,60%,45%)" }}>عالم</span>{" "}
              <span style={{ color: "hsl(200,70%,45%)" }}>المرح</span>{" "}
              <span style={{ color: "hsl(45,80%,45%)" }}>والسعادة</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-lg mb-8 max-w-md" style={{ color: "hsl(280,20%,45%)" }}>
              ملابس أطفال، ألعاب تعليمية، عربات ومستلزمات الرضع
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Button className="rounded-full px-10 py-7 text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, hsl(280,60%,55%), hsl(200,70%,55%))" }}>
                تسوق الآن 🛒 <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }} className="hidden lg:block">
            <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80" alt=""
              className="w-full h-72 object-cover rounded-[2rem] shadow-2xl border-4 border-white" />
          </motion.div>
        </div>
      </section>

      {/* Category Bubbles */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="flex gap-4 justify-center">
          {categories.slice(1).map((cat, i) => (
            <motion.button key={cat} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              onClick={() => scrollToSection(cat)}
              whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
              className="bg-white rounded-[1.5rem] px-6 py-5 text-center shadow-md hover:shadow-xl transition-shadow"
              style={{ border: "2px solid transparent", borderImage: "linear-gradient(135deg, hsl(280,60%,80%), hsl(200,70%,80%)) 1" }}>
              <span className="text-3xl block mb-2">{catEmojis[cat]}</span>
              <span className="text-xs font-bold" style={{ color: "hsl(280,60%,40%)" }}>{cat}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Products by Category */}
      {categories.slice(1).map((cat, catIdx) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        const colors = ["hsl(280,60%,55%)", "hsl(200,70%,55%)", "hsl(45,80%,50%)", "hsl(340,60%,55%)"];
        const accentColor = colors[catIdx % colors.length];
        return (
          <section key={cat} id={`kids-cat-${cat}`} className="max-w-7xl mx-auto px-6 py-12 scroll-mt-28">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="flex items-center gap-3 mb-8">
              <span className="text-3xl">{catEmojis[cat]}</span>
              <h3 className="text-xl font-black" style={{ color: accentColor }}>{cat}</h3>
              <div className="flex-1 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)`, opacity: 0.2 }} />
            </motion.div>
            <div className={`grid gap-5 ${catIdx % 2 === 0 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
              {items.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 25, rotate: -2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, rotate: 1 }}
                  className="group bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
                  style={{ border: `2px solid hsl(45,40%,90%)` }}>
                  <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: "hsl(45,50%,95%)" }}>
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {product.hot && (
                      <span className="absolute top-3 right-3 text-[10px] px-3 py-1 rounded-full font-black text-white"
                        style={{ background: "linear-gradient(135deg, hsl(340,70%,55%), hsl(20,90%,55%))" }}>
                        🔥 الأكثر مبيعاً
                      </span>
                    )}
                    <button className="absolute top-3 left-3 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <Heart className="w-4 h-4" style={{ color: "hsl(340,70%,55%)" }} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-sm mb-2" style={{ color: "hsl(280,40%,25%)" }}>{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="font-black" style={{ color: accentColor }}>{product.price.toLocaleString()} ج.م</p>
                      <Button size="sm" className="rounded-full text-[10px] h-8 text-white"
                        style={{ background: `linear-gradient(135deg, ${accentColor}, hsl(200,70%,55%))` }}>
                        أضف 🛒
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
      <section className="py-20 text-center px-6" style={{ background: "linear-gradient(135deg, hsl(280,50%,95%) 0%, hsl(200,60%,95%) 50%, hsl(45,70%,95%) 100%)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-4xl mb-4">🎠🧸🎪</p>
          <h3 className="text-3xl font-black mb-4" style={{ color: "hsl(280,60%,40%)" }}>عايز تفتح متجر أطفال أونلاين؟</h3>
          <p className="mb-8 max-w-md mx-auto text-sm" style={{ color: "hsl(280,20%,50%)" }}>سجّل الآن واحصل على متجرك بتصميم ممتع وجذاب</p>
          <Button onClick={() => navigate("/register?type=kids_toys")} size="lg" className="rounded-full px-10 text-white font-bold"
            style={{ background: "linear-gradient(135deg, hsl(280,60%,55%), hsl(200,70%,55%))" }}>
            ابدأ متجرك الآن 🚀 <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: "hsl(45,40%,88%)", color: "hsl(45,20%,55%)" }}>
        <p>© 2026 StoreHub - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default DemoKidsToysStore;
