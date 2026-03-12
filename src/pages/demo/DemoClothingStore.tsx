import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, ArrowLeft, Star, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const mockProducts = [
  { id: "1", name: "جاكيت جلد كلاسيك", price: 1250, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", category: "جاكيتات" },
  { id: "2", name: "تيشيرت أوفر سايز", price: 350, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", category: "تيشيرتات" },
  { id: "3", name: "بنطلون جينز سليم", price: 650, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80", category: "بنطلونات" },
  { id: "4", name: "هودي فليس بريميوم", price: 550, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80", category: "هوديز" },
  { id: "5", name: "قميص كتان صيفي", price: 420, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80", category: "قمصان" },
  { id: "6", name: "شورت رياضي", price: 280, image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80", category: "شورتات" },
  { id: "7", name: "بليزر رسمي", price: 1100, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", category: "جاكيتات" },
  { id: "8", name: "بنطلون قماش", price: 480, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", category: "بنطلونات" },
];

const categories = ["الكل", "جاكيتات", "تيشيرتات", "بنطلونات", "هوديز", "قمصان"];

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`clothing-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const DemoClothingStore = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const grouped = categories.slice(1).reduce((acc, cat) => {
    acc[cat] = mockProducts.filter(p => p.category === cat);
    return acc;
  }, {} as Record<string, typeof mockProducts>);

  return (
    <div className="min-h-screen bg-[hsl(0,0%,4%)] text-white" dir="rtl" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-2xl bg-black/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>
            NOIR
          </h1>
          <div className="flex items-center gap-5">
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/5">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/5 relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Demo Banner */}
      <div className="fixed top-[69px] inset-x-0 z-40 bg-white text-black text-center py-2 text-sm font-medium">
        <span>هذا عرض تجريبي للمتجر • </span>
        <button onClick={() => navigate("/register?type=clothing")} className="underline font-bold hover:opacity-80">
          سجّل الآن وابدأ متجرك
        </button>
      </div>

      {/* Hero - Editorial Full Screen */}
      <div ref={heroRef} className="relative h-screen overflow-hidden pt-[105px]">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 bg-cover bg-center"
        >
          <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80" alt="" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="relative z-10 h-full flex items-end pb-20 max-w-7xl mx-auto px-6">
          <div>
            <motion.div initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.3, duration: 1 }}
              className="h-[1px] bg-white/40 mb-6" />
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-xs uppercase tracking-[0.5em] text-white/50 mb-4">
              مجموعة خريف / شتاء 2026
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }}
              className="text-6xl md:text-8xl font-bold mb-6 leading-[0.9]" style={{ fontFamily: "'Playfair Display', serif" }}>
              أناقة<br />بلا حدود
            </motion.h2>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="flex gap-4">
              <Button className="bg-white text-black hover:bg-white/90 rounded-none px-10 py-6 text-xs uppercase tracking-[0.3em]">
                تسوق الآن
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-none px-10 py-6 text-xs uppercase tracking-[0.3em]">
                المجموعة الجديدة
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Category Sticky Strip */}
      <div className="sticky top-[105px] z-30 bg-black/90 backdrop-blur-xl border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-6 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => cat === "الكل" ? window.scrollTo({ top: 600, behavior: "smooth" }) : scrollToSection(cat)}
              className="text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors whitespace-nowrap pb-1 border-b border-transparent hover:border-white"
            >
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
          <section key={cat} id={`clothing-cat-${cat}`} className="max-w-7xl mx-auto px-6 py-16 scroll-mt-40">
            <motion.h3 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="text-2xl font-bold mb-8 border-r-2 border-white/30 pr-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {cat}
            </motion.h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden mb-3 relative bg-white/5">
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s] ease-out" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-black" />
                        </button>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <Eye className="w-4 h-4 text-black" />
                        </button>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4 text-black" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-medium text-sm text-white/90">{product.name}</h4>
                  <p className="text-white/40 text-sm mt-1">{product.price} ج.م</p>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Lookbook Banner */}
      <section className="my-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="relative h-[50vh] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80" alt=""
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-white/50 mb-4">Lookbook</p>
              <h3 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                الموسم الجديد
              </h3>
              <Button className="bg-white text-black hover:bg-white/90 rounded-none px-10 py-6 text-xs uppercase tracking-[0.3em]">
                اكتشف المزيد
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: "شحن مجاني", desc: "على الطلبات فوق 500 ج.م" },
            { title: "إرجاع سهل", desc: "خلال 14 يوم من الاستلام" },
            { title: "دفع آمن", desc: "طرق دفع متعددة ومؤمنة" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-2 text-white/80">{f.title}</h4>
              <p className="text-xs text-white/30">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6 border-t border-white/5">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs uppercase tracking-[0.5em] text-white/30 mb-4">StoreHub</p>
          <h3 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            عجبك شكل المتجر؟
          </h3>
          <p className="text-white/40 mb-8 max-w-md mx-auto text-sm">
            سجّل الآن واحصل على متجرك الخاص بنفس التصميم الاحترافي
          </p>
          <Button onClick={() => navigate("/register?type=clothing")} className="bg-white text-black hover:bg-white/90 rounded-none px-12 py-6 text-xs uppercase tracking-[0.3em]">
            ابدأ متجرك الآن
          </Button>
        </motion.div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-white/20">
        <p>© 2026 StoreHub - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default DemoClothingStore;
