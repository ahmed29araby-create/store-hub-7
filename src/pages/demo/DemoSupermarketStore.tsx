import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Heart, Apple, Leaf, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mockProducts = [
  { id: "1", name: "أرز بسمتي 5 كجم", price: 180, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80", category: "مواد غذائية", offer: "-15%" },
  { id: "2", name: "عصير برتقال طبيعي 1 لتر", price: 45, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80", category: "مشروبات" },
  { id: "3", name: "طماطم طازجة 1 كجم", price: 25, image: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=600&q=80", category: "خضار وفواكه" },
  { id: "4", name: "زيت زيتون عضوي 500 مل", price: 220, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80", category: "منتجات عضوية", offer: "جديد" },
  { id: "5", name: "تونة معلبة 3 قطع", price: 75, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80", category: "معلبات" },
  { id: "6", name: "حليب طازج 1 لتر", price: 30, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80", category: "مواد غذائية" },
  { id: "7", name: "موز طازج 1 كجم", price: 35, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80", category: "خضار وفواكه" },
  { id: "8", name: "عسل طبيعي عضوي", price: 150, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80", category: "منتجات عضوية" },
  { id: "9", name: "فول مدمس معلب", price: 18, image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&q=80", category: "معلبات" },
  { id: "10", name: "مياه معدنية 6 عبوات", price: 40, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80", category: "مشروبات" },
];

const categories = ["الكل", "مواد غذائية", "مشروبات", "خضار وفواكه", "منتجات عضوية", "معلبات"];

const catIcons: Record<string, string> = {
  "مواد غذائية": "🛒",
  "مشروبات": "🥤",
  "خضار وفواكه": "🍎",
  "منتجات عضوية": "🌿",
  "معلبات": "🥫",
};

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`super-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const DemoSupermarketStore = () => {
  const navigate = useNavigate();

  const grouped = categories.slice(1).reduce((acc, cat) => {
    acc[cat] = mockProducts.filter(p => p.category === cat);
    return acc;
  }, {} as Record<string, typeof mockProducts>);

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(80, 20%, 97%)", fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b" style={{ borderColor: "hsl(80,30%,88%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "hsl(130, 55%, 45%)" }}>
              <Apple className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold" style={{ color: "hsl(130, 55%, 25%)" }}>فريش ماركت</h1>
          </div>
          <Button variant="ghost" size="icon" className="relative" style={{ color: "hsl(130,55%,35%)" }}>
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "hsl(130,55%,45%)" }}>4</span>
          </Button>
        </div>
      </nav>

      {/* Demo Banner */}
      <div className="text-center py-2.5 text-sm font-medium text-white" style={{ backgroundColor: "hsl(130, 55%, 45%)" }}>
        <span>هذا عرض تجريبي لسوبرماركت • </span>
        <button onClick={() => navigate("/register?type=supermarket")} className="underline font-bold hover:opacity-80">
          سجّل الآن
        </button>
      </div>

      {/* Hero - Fresh & Bright */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(130,55%,45%) 0%, hsl(90,50%,40%) 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[500px] h-[500px] rounded-full -bottom-40 -left-40 bg-white" />
          <div className="absolute w-[300px] h-[300px] rounded-full top-10 right-20 bg-white" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6 bg-white/15">
              <Leaf className="w-3.5 h-3.5" /> طازج يومياً
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              كل ما<br />تحتاجه
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-white/70 text-lg mb-8 max-w-md">
              مواد غذائية، خضار وفواكه طازجة، ومنتجات عضوية بأسعار تنافسية
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="flex gap-3">
              <Button className="bg-white hover:bg-white/90 rounded-full px-8 py-6 text-sm font-bold" style={{ color: "hsl(130,55%,30%)" }}>
                تسوق الآن
              </Button>
              <Button variant="outline" className="rounded-full px-8 py-6 text-sm text-white border-white/30 hover:bg-white/10">
                العروض اليومية <Tag className="w-4 h-4 mr-1" />
              </Button>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }} className="hidden lg:block">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80" alt=""
              className="w-full h-72 object-cover rounded-3xl shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-5 gap-3">
          {categories.slice(1).map((cat, i) => (
            <motion.button key={cat} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => scrollToSection(cat)}
              className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all hover:scale-105"
              style={{ border: "1px solid hsl(80,20%,90%)" }}>
              <span className="text-3xl mb-2 block">{catIcons[cat]}</span>
              <span className="text-xs font-medium" style={{ color: "hsl(130,55%,25%)" }}>{cat}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Products by Category */}
      {categories.slice(1).map((cat, catIdx) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        return (
          <section key={cat} id={`super-cat-${cat}`} className="max-w-7xl mx-auto px-6 py-12 scroll-mt-28">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: "hsl(130,55%,20%)" }}>
                <span className="text-2xl">{catIcons[cat]}</span> {cat}
              </h3>
            </motion.div>
            <div className={`grid gap-4 ${catIdx % 2 === 0 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-4"}`}>
              {items.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                  style={{ border: "1px solid hsl(80,20%,90%)" }}>
                  <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: "hsl(80,20%,95%)" }}>
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.offer && (
                      <span className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded-full font-bold text-white"
                        style={{ backgroundColor: "hsl(0,70%,50%)" }}>
                        {product.offer}
                      </span>
                    )}
                    <button className="absolute bottom-2 left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      style={{ color: "hsl(130,55%,45%)" }}>
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-xs mb-1 line-clamp-2" style={{ color: "hsl(130,55%,15%)" }}>{product.name}</h4>
                    <p className="font-bold text-sm" style={{ color: "hsl(130,55%,40%)" }}>{product.price} ج.م</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="py-20 text-center px-6" style={{ backgroundColor: "hsl(80,20%,94%)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-3xl font-bold mb-4" style={{ color: "hsl(130,55%,20%)" }}>عايز تفتح سوبرماركت أونلاين؟</h3>
          <p className="mb-8 max-w-md mx-auto text-sm" style={{ color: "hsl(130,20%,45%)" }}>سجّل الآن واحصل على متجرك بتصميم احترافي</p>
          <Button onClick={() => navigate("/register?type=supermarket")} size="lg" className="rounded-full px-10 text-white"
            style={{ backgroundColor: "hsl(130,55%,45%)" }}>
            ابدأ متجرك الآن <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: "hsl(80,20%,88%)", color: "hsl(80,10%,55%)" }}>
        <p>© 2026 StoreHub - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default DemoSupermarketStore;
