import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star, ArrowLeft, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mockProducts = [
  { id: "1", name: "ساعة كلاسيك ذهبية", price: 2800, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80", category: "ساعات" },
  { id: "2", name: "عطر عود فاخر", price: 1500, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80", category: "عطور" },
  { id: "3", name: "نظارة شمس بولارايزد", price: 950, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80", category: "نظارات" },
  { id: "4", name: "سوار جلد طبيعي", price: 450, image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80", category: "مجوهرات" },
  { id: "5", name: "محفظة جلد إيطالي", price: 780, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80", category: "محافظ" },
  { id: "6", name: "خاتم فضة استرليني", price: 650, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80", category: "مجوهرات" },
  { id: "7", name: "حزام جلد فاخر", price: 520, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", category: "محافظ" },
  { id: "8", name: "عطر مسك أبيض", price: 1200, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80", category: "عطور" },
];

const categories = ["الكل", "ساعات", "عطور", "نظارات", "مجوهرات", "محافظ"];

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`acc-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const DemoAccessoriesStore = () => {
  const navigate = useNavigate();

  const grouped = categories.slice(1).reduce((acc, cat) => {
    acc[cat] = mockProducts.filter(p => p.category === cat);
    return acc;
  }, {} as Record<string, typeof mockProducts>);

  return (
    <div className="min-h-screen text-white" dir="rtl" style={{ backgroundColor: "hsl(30, 15%, 4%)", fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-black/50 border-b border-[hsl(43,74%,49%)]/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Diamond className="w-5 h-5" style={{ color: "hsl(43, 74%, 49%)" }} />
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "hsl(43, 74%, 49%)" }}>
              LUXE
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/5">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/5 relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: "hsl(43, 74%, 49%)", color: "black" }}>3</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Demo Banner */}
      <div className="text-center py-2.5 text-sm font-medium" style={{ backgroundColor: "hsl(43, 74%, 49%)", color: "hsl(30,15%,4%)" }}>
        <span>هذا عرض تجريبي للمتجر • </span>
        <button onClick={() => navigate("/register?type=accessories")} className="underline font-bold hover:opacity-80">
          سجّل الآن وابدأ متجرك
        </button>
      </div>

      {/* Hero - Split Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        <div className="flex items-center px-8 lg:px-16 py-20">
          <div>
            <motion.div initial={{ width: 0 }} animate={{ width: 60 }} transition={{ delay: 0.3, duration: 0.8 }}
              className="h-[1px] mb-8" style={{ backgroundColor: "hsl(43, 74%, 49%)" }} />
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-[10px] uppercase tracking-[0.5em] mb-6" style={{ color: "hsl(43, 74%, 49%)" }}>
              تشكيلة حصرية ٢٠٢٦
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="text-5xl lg:text-7xl font-bold mb-6 leading-[1.1]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              فخامة<br />لا تُضاهى
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="text-white/40 max-w-md text-base mb-10 leading-relaxed">
              اكتشف مجموعتنا الفاخرة من الساعات والعطور والإكسسوارات المصممة بعناية لتعكس ذوقك الراقي
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
              <Button className="rounded-none px-10 py-6 text-xs uppercase tracking-[0.3em] border" style={{ backgroundColor: "hsl(43, 74%, 49%)", color: "black", borderColor: "hsl(43, 74%, 49%)" }}>
                تسوق الآن
              </Button>
            </motion.div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}
          className="relative overflow-hidden hidden lg:block">
          <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1200&q=80" alt=""
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(30,15%,4%)] via-transparent to-transparent" />
        </motion.div>
      </section>

      {/* Category Nav */}
      <div className="sticky top-[69px] z-30 border-y border-white/5" style={{ backgroundColor: "hsl(30,15%,6%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-8 overflow-x-auto">
          {categories.map((cat) => (
            <button key={cat} onClick={() => cat === "الكل" ? window.scrollTo({ top: 800, behavior: "smooth" }) : scrollToSection(cat)}
              className="text-xs uppercase tracking-[0.15em] whitespace-nowrap transition-colors hover:text-[hsl(43,74%,49%)]"
              style={{ color: "hsla(0,0%,100%,0.35)" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products by Category - Alternating Layouts */}
      {categories.slice(1).map((cat, catIdx) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        return (
          <section key={cat} id={`acc-cat-${cat}`} className="max-w-7xl mx-auto px-6 py-16 scroll-mt-36">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="flex items-center gap-4 mb-10">
              <div className="w-8 h-[1px]" style={{ backgroundColor: "hsl(43,74%,49%)" }} />
              <h3 className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "hsl(43,74%,49%)" }}>
                {cat}
              </h3>
            </motion.div>
            <div className={`grid gap-6 ${catIdx % 2 === 0 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 lg:grid-cols-3"}`}>
              {items.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="group cursor-pointer">
                  <div className={`overflow-hidden mb-4 border border-white/5 relative ${catIdx % 2 === 0 ? "aspect-[4/5]" : "aspect-square"}`}>
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <button className="absolute top-4 left-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Heart className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-2.5 h-2.5" style={{ fill: "hsl(43, 74%, 49%)", color: "hsl(43, 74%, 49%)" }} />
                    ))}
                  </div>
                  <h4 className="font-medium text-sm text-white/80">{product.name}</h4>
                  <p className="text-sm mt-1" style={{ color: "hsl(43, 74%, 49%)" }}>{product.price.toLocaleString()} ج.م</p>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Luxury Features */}
      <section className="border-t border-white/5 py-20" style={{ background: "linear-gradient(180deg, hsl(30,15%,4%) 0%, hsl(30,15%,8%) 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { title: "أصالة مضمونة", desc: "جميع المنتجات أصلية 100%" },
            { title: "تغليف فاخر", desc: "علبة هدايا مميزة مع كل طلب" },
            { title: "توصيل سريع", desc: "توصيل خلال 24 ساعة" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <h4 className="font-bold text-sm mb-2" style={{ color: "hsl(43, 74%, 49%)" }}>{f.title}</h4>
              <p className="text-xs text-white/30">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "hsl(43, 74%, 49%)" }}>
            عجبك شكل المتجر؟
          </h3>
          <p className="text-white/30 mb-8 max-w-md mx-auto text-sm">
            سجّل الآن واحصل على متجرك الفاخر بنفس التصميم الراقي
          </p>
          <Button onClick={() => navigate("/register?type=accessories")} className="rounded-none px-12 py-6 text-xs uppercase tracking-[0.3em]"
            style={{ backgroundColor: "hsl(43, 74%, 49%)", color: "black" }}>
            ابدأ متجرك الآن
          </Button>
        </motion.div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-white/15">
        <p>© 2026 StoreHub - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default DemoAccessoriesStore;
