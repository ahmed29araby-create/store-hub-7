import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Heart, Star, Lamp, Sofa, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mockProducts = [
  { id: "1", name: "كنبة مودرن رمادية", price: 8500, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", category: "أثاث", featured: true },
  { id: "2", name: "طقم أواني طبخ سيراميك", price: 1200, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80", category: "أدوات مطبخ" },
  { id: "3", name: "لوحة فنية ذهبية", price: 650, image: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&q=80", category: "ديكور" },
  { id: "4", name: "نجفة كريستال مودرن", price: 3200, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&q=80", category: "إضاءة" },
  { id: "5", name: "طقم ملايات قطن مصري", price: 890, image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80", category: "مفروشات" },
  { id: "6", name: "منظم مطبخ خشبي", price: 350, image: "https://images.unsplash.com/photo-1556909172-89cf0e0ee4ae?w=600&q=80", category: "أدوات منزلية" },
  { id: "7", name: "مرآة حائط دائرية", price: 1100, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80", category: "ديكور", featured: true },
  { id: "8", name: "أباجورة خشبية", price: 480, image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&q=80", category: "إضاءة" },
];

const categories = ["الكل", "أثاث", "أدوات مطبخ", "ديكور", "إضاءة", "مفروشات", "أدوات منزلية"];

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`home-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const DemoHomeDecorStore = () => {
  const navigate = useNavigate();

  const grouped = categories.slice(1).reduce((acc, cat) => {
    acc[cat] = mockProducts.filter(p => p.category === cat);
    return acc;
  }, {} as Record<string, typeof mockProducts>);

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(30, 25%, 96%)", fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b" style={{ borderColor: "hsl(30,20%,88%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(30, 30%, 25%)" }}>
            بيتي
          </h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" style={{ color: "hsl(30,30%,40%)" }}>
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" style={{ color: "hsl(30,30%,40%)" }}>
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "hsl(30,50%,45%)" }}>1</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Demo Banner */}
      <div className="text-center py-2.5 text-sm font-medium text-white" style={{ backgroundColor: "hsl(30, 50%, 45%)" }}>
        <span>هذا عرض تجريبي لمتجر منزل وديكور • </span>
        <button onClick={() => navigate("/register?type=home_decor")} className="underline font-bold hover:opacity-80">
          سجّل الآن
        </button>
      </div>

      {/* Hero - Warm & Elegant */}
      <section className="relative h-[80vh] overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80" alt="" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsla(30,30%,15%,0.7) 0%, hsla(30,20%,20%,0.4) 100%)" }} />
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6">
          <div className="text-white max-w-lg">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-xs uppercase tracking-[0.5em] mb-4" style={{ color: "hsl(30,60%,70%)" }}>
              جمال بيتك يبدأ من هنا
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
              صمّم بيتك<br />بذوقك
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="text-white/60 text-lg mb-10">
              أثاث، ديكور، إضاءة ومفروشات بأعلى جودة
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
              <Button className="rounded-full px-10 py-6 text-sm font-semibold text-white"
                style={{ backgroundColor: "hsl(30, 50%, 45%)" }}>
                تسوق الآن <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Icons */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-lg p-6 grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.slice(1).map((cat, i) => (
            <motion.button key={cat} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => scrollToSection(cat)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:shadow-md"
              style={{ backgroundColor: "hsl(30,25%,97%)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "hsl(30,40%,90%)" }}>
                {i === 0 && <Sofa className="w-5 h-5" style={{ color: "hsl(30,50%,45%)" }} />}
                {i === 1 && <ChefHat className="w-5 h-5" style={{ color: "hsl(30,50%,45%)" }} />}
                {i === 2 && <Star className="w-5 h-5" style={{ color: "hsl(30,50%,45%)" }} />}
                {i === 3 && <Lamp className="w-5 h-5" style={{ color: "hsl(30,50%,45%)" }} />}
                {i >= 4 && <Heart className="w-5 h-5" style={{ color: "hsl(30,50%,45%)" }} />}
              </div>
              <span className="text-xs font-medium" style={{ color: "hsl(30,30%,35%)" }}>{cat}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Products by Category - Pinterest-style */}
      {categories.slice(1).map((cat, catIdx) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        return (
          <section key={cat} id={`home-cat-${cat}`} className="max-w-7xl mx-auto px-6 py-14 scroll-mt-36">
            <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-2xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(30,30%,25%)" }}>
              {cat}
            </motion.h3>
            <div className={`grid gap-5 ${catIdx % 2 === 0 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2"}`}>
              {items.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500"
                  style={{ border: "1px solid hsl(30,20%,90%)" }}>
                  <div className={`overflow-hidden relative ${product.featured ? "aspect-[3/4]" : "aspect-square"}`}>
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <button className="absolute top-3 left-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Heart className="w-4 h-4" style={{ color: "hsl(30,50%,45%)" }} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-sm mb-2" style={{ color: "hsl(30,30%,20%)" }}>{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="font-bold" style={{ color: "hsl(30,50%,40%)" }}>{product.price.toLocaleString()} ج.م</p>
                      <Button size="sm" className="rounded-full text-[10px] h-8 text-white"
                        style={{ backgroundColor: "hsl(30,50%,45%)" }}>
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
      <section className="py-20 text-center px-6" style={{ backgroundColor: "hsl(30,25%,94%)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(30,30%,25%)" }}>
            عايز تفتح متجر أثاث وديكور؟
          </h3>
          <p className="mb-8 max-w-md mx-auto text-sm" style={{ color: "hsl(30,15%,50%)" }}>سجّل الآن واحصل على متجرك بتصميم أنيق</p>
          <Button onClick={() => navigate("/register?type=home_decor")} size="lg" className="rounded-full px-10 text-white"
            style={{ backgroundColor: "hsl(30,50%,45%)" }}>
            ابدأ متجرك الآن <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: "hsl(30,20%,88%)", color: "hsl(30,15%,60%)" }}>
        <p>© 2026 StoreHub - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default DemoHomeDecorStore;
