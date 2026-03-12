import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Star, Heart, Pill, Search, Shield, Truck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mockProducts = [
  { id: "1", name: "فيتامين سي 1000mg", price: 120, image: "https://images.unsplash.com/photo-1584308666544-ad270e5e0e04?w=600&q=80", category: "فيتامينات", tag: "الأكثر مبيعاً" },
  { id: "2", name: "أوميجا 3 كبسولات", price: 250, image: "https://images.unsplash.com/photo-1559757175-7cb057fba93c?w=600&q=80", category: "مكملات غذائية" },
  { id: "3", name: "كريم مرطب للبشرة", price: 180, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80", category: "عناية بالبشرة" },
  { id: "4", name: "شامبو طبي", price: 95, image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80", category: "عناية بالشعر" },
  { id: "5", name: "جهاز قياس الضغط", price: 450, image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80", category: "أجهزة طبية", tag: "جديد" },
  { id: "6", name: "واقي شمس SPF50", price: 220, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", category: "عناية بالبشرة" },
  { id: "7", name: "فيتامين د3", price: 90, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&q=80", category: "فيتامينات" },
  { id: "8", name: "بروتين بار", price: 35, image: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=600&q=80", category: "مكملات غذائية" },
];

const categories = ["الكل", "فيتامينات", "مكملات غذائية", "عناية بالبشرة", "عناية بالشعر", "أجهزة طبية"];

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`pharm-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const DemoPharmacyStore = () => {
  const navigate = useNavigate();

  const grouped = categories.slice(1).reduce((acc, cat) => {
    acc[cat] = mockProducts.filter(p => p.category === cat);
    return acc;
  }, {} as Record<string, typeof mockProducts>);

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(160, 30%, 97%)", fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b" style={{ borderColor: "hsl(160,40%,90%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "hsl(160, 50%, 40%)" }}>
              <Pill className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold" style={{ color: "hsl(160, 50%, 25%)" }}>صيدليتي</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-white border rounded-full px-4 py-2 gap-2" style={{ borderColor: "hsl(160,40%,85%)" }}>
              <Search className="w-4 h-4 text-gray-400" />
              <input placeholder="ابحث عن منتج..." className="text-sm bg-transparent outline-none w-40" />
            </div>
            <Button variant="ghost" size="icon" className="relative" style={{ color: "hsl(160,50%,30%)" }}>
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "hsl(160,50%,40%)" }}>3</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Demo Banner */}
      <div className="text-center py-2.5 text-sm font-medium text-white" style={{ backgroundColor: "hsl(160, 50%, 40%)" }}>
        <span>هذا عرض تجريبي للصيدلية • </span>
        <button onClick={() => navigate("/register?type=pharmacy")} className="underline font-bold hover:opacity-80">
          سجّل الآن وابدأ صيدليتك
        </button>
      </div>

      {/* Hero - Clean Medical */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(160,50%,40%) 0%, hsl(170,45%,30%) 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 rounded-full -top-20 -left-20" style={{ backgroundColor: "white" }} />
          <div className="absolute w-64 h-64 rounded-full bottom-10 right-10" style={{ backgroundColor: "white" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6" style={{ backgroundColor: "hsla(0,0%,100%,0.15)" }}>
              <Shield className="w-3.5 h-3.5" />
              منتجات معتمدة ومرخصة
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              صحتك<br />أولويتنا
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-white/70 text-lg mb-8 max-w-md">
              أدوية، فيتامينات، مستحضرات تجميل وأجهزة طبية بأفضل الأسعار
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Button className="bg-white hover:bg-white/90 rounded-full px-8 py-6 text-sm font-semibold" style={{ color: "hsl(160,50%,30%)" }}>
                تسوق الآن <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            className="hidden lg:block">
            <img src="https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80" alt=""
              className="w-full h-80 object-cover rounded-3xl shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Category Pills - Scrollable */}
      <div className="sticky top-[69px] z-30 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto">
          {categories.map((cat) => (
            <button key={cat} onClick={() => cat === "الكل" ? window.scrollTo({ top: 600, behavior: "smooth" }) : scrollToSection(cat)}
              className="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border"
              style={{ borderColor: "hsl(160,40%,85%)", color: "hsl(160,50%,30%)" }}>
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
          <section key={cat} id={`pharm-cat-${cat}`} className="max-w-7xl mx-auto px-6 py-12 scroll-mt-36">
            <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: "hsl(160,50%,25%)" }}>
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: "hsl(160,50%,40%)" }} />
              {cat}
            </motion.h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  style={{ borderColor: "hsl(160,40%,92%)" }}>
                  <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: "hsl(160,30%,95%)" }}>
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.tag && (
                      <span className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded-full font-bold text-white" style={{ backgroundColor: "hsl(160,50%,40%)" }}>
                        {product.tag}
                      </span>
                    )}
                    <button className="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Heart className="w-3.5 h-3.5" style={{ color: "hsl(160,50%,40%)" }} />
                    </button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm mb-2" style={{ color: "hsl(160,50%,15%)" }}>{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm" style={{ color: "hsl(160,50%,40%)" }}>{product.price} ج.م</p>
                      <Button size="sm" className="rounded-full text-[10px] h-7 px-3 text-white" style={{ backgroundColor: "hsl(160,50%,40%)" }}>
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

      {/* Trust Section */}
      <section className="py-16" style={{ backgroundColor: "hsl(160,30%,95%)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Truck, title: "توصيل سريع", desc: "توصيل خلال ساعتين لمنطقتك" },
            { icon: Shield, title: "منتجات أصلية", desc: "جميع المنتجات معتمدة ومرخصة" },
            { icon: MessageCircle, title: "استشارة مجانية", desc: "صيدلي متاح للرد على استفساراتك" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="flex items-start gap-4 p-6 bg-white rounded-2xl" style={{ border: "1px solid hsl(160,40%,90%)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "hsl(160,50%,92%)" }}>
                <f.icon className="w-6 h-6" style={{ color: "hsl(160,50%,40%)" }} />
              </div>
              <div>
                <h4 className="font-bold mb-1" style={{ color: "hsl(160,50%,20%)" }}>{f.title}</h4>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-3xl font-bold mb-4" style={{ color: "hsl(160,50%,25%)" }}>عايز تفتح صيدليتك أونلاين؟</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">سجّل الآن واحصل على صيدليتك الإلكترونية بتصميم احترافي</p>
          <Button onClick={() => navigate("/register?type=pharmacy")} size="lg" className="rounded-full px-10 text-white"
            style={{ backgroundColor: "hsl(160,50%,40%)" }}>
            ابدأ صيدليتك الآن <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-gray-400" style={{ borderColor: "hsl(160,40%,90%)" }}>
        <p>© 2026 StoreHub - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default DemoPharmacyStore;
