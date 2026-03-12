import { motion } from "framer-motion";
import { ShoppingBag, Star, Clock, MapPin, Phone, ArrowLeft, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const mockCategories = [
  { name: "المشاوي", icon: "🔥", count: 8 },
  { name: "المقبلات", icon: "🥗", count: 6 },
  { name: "السلطات", icon: "🥬", count: 5 },
  { name: "المشروبات", icon: "🥤", count: 10 },
  { name: "الحلويات", icon: "🍰", count: 4 },
];

const mockProducts = [
  { id: "1", name: "مشاوي مشكلة فاخرة", price: 320, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80", desc: "تشكيلة من أجود أنواع اللحوم المشوية على الفحم", category: "المشاوي", badge: "الأكثر طلباً" },
  { id: "2", name: "فتة شاورما", price: 180, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80", desc: "شاورما لحم مع الخبز المحمص والطحينة", category: "المقبلات" },
  { id: "3", name: "سلطة سيزر بالدجاج", price: 120, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80", desc: "خس طازج مع قطع الدجاج المشوي", category: "السلطات" },
  { id: "4", name: "ستيك ريب آي", price: 450, image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80", desc: "قطعة ستيك ريب آي 300 جرام مع البطاطس", category: "المشاوي", badge: "شيف يوصي" },
  { id: "5", name: "كنافة نابلسية", price: 85, image: "https://images.unsplash.com/photo-1579888944880-d98341245702?w=600&q=80", desc: "كنافة طازجة محشوة بالجبنة مع القطر", category: "الحلويات" },
  { id: "6", name: "عصير مانجو طازج", price: 45, image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80", desc: "مانجو طازجة 100% بدون سكر مضاف", category: "المشروبات" },
  { id: "7", name: "كباب مشكل", price: 280, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80", desc: "كباب لحم وكفتة وشيش طاووق", category: "المشاوي" },
  { id: "8", name: "حمص بالطحينة", price: 60, image: "https://images.unsplash.com/photo-1547516508-a5e3b2c37ee4?w=600&q=80", desc: "حمص كريمي مع زيت الزيتون", category: "المقبلات" },
];

const scrollToSection = (cat: string) => {
  const el = document.getElementById(`rest-cat-${cat}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const DemoRestaurantStore = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("الكل");

  const grouped = mockCategories.reduce((acc, cat) => {
    acc[cat.name] = mockProducts.filter(p => p.category === cat.name);
    return acc;
  }, {} as Record<string, typeof mockProducts>);

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(20, 30%, 5%)", fontFamily: "'Inter', sans-serif", color: "hsl(30, 20%, 90%)" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl border-b" style={{ backgroundColor: "hsla(20,30%,5%,0.85)", borderColor: "hsla(15,80%,50%,0.15)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6" style={{ color: "hsl(15, 80%, 55%)" }} />
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(15, 80%, 55%)" }}>
              ذوق
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: "hsla(15,80%,50%,0.15)", color: "hsl(15,80%,60%)" }}>
              <Clock className="w-3.5 h-3.5" />
              <span>مفتوح الآن</span>
            </div>
            <Button variant="ghost" size="icon" className="relative hover:bg-white/5" style={{ color: "hsl(30,20%,80%)" }}>
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "hsl(15, 80%, 50%)" }}>1</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Demo Banner */}
      <div className="text-center py-2.5 text-sm font-medium" style={{ backgroundColor: "hsl(15, 80%, 50%)", color: "white" }}>
        <span>هذا عرض تجريبي للمطعم • </span>
        <button onClick={() => navigate("/register?type=restaurant")} className="underline font-bold hover:opacity-80">
          سجّل الآن وابدأ مطعمك
        </button>
      </div>

      {/* Hero - Immersive */}
      <div className="relative h-[85vh] overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }}
          className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80" alt=""
            className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsla(20,30%,5%,0.3) 0%, hsla(20,30%,5%,0.7) 50%, hsl(20,30%,5%) 100%)" }} />
        <div className="relative z-10 h-full flex items-end pb-20">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <motion.h2 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
              className="text-6xl md:text-8xl font-bold mb-4 leading-[1]" style={{ fontFamily: "'Playfair Display', serif" }}>
              نكهات<br />لا تُنسى
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="text-base max-w-md mb-8" style={{ color: "hsla(30,20%,90%,0.5)" }}>
              أطباق مُعدّة بشغف من أجود المكونات الطازجة
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
              className="flex gap-4">
              <Button className="rounded-full px-8 py-6 text-sm font-semibold" style={{ backgroundColor: "hsl(15, 80%, 50%)", color: "white" }}>
                اطلب الآن
              </Button>
              <Button variant="outline" className="rounded-full px-8 py-6 text-sm" style={{ borderColor: "hsla(30,20%,90%,0.2)", color: "hsl(30,20%,90%)" }}>
                القائمة الكاملة
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Category Quick Nav - Floating Cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {mockCategories.map((cat, i) => (
            <motion.button key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              onClick={() => { setActiveCategory(cat.name); scrollToSection(cat.name); }}
              className={`flex-shrink-0 flex flex-col items-center gap-2 px-8 py-5 rounded-2xl border transition-all duration-300 ${
                activeCategory === cat.name ? "scale-105" : "hover:scale-105"
              }`}
              style={{
                backgroundColor: activeCategory === cat.name ? "hsl(15,80%,50%)" : "hsla(20,30%,12%,0.9)",
                borderColor: activeCategory === cat.name ? "hsl(15,80%,50%)" : "hsla(30,20%,90%,0.05)",
                backdropFilter: "blur(20px)",
                color: activeCategory === cat.name ? "white" : "hsl(30,20%,80%)"
              }}>
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-sm font-medium">{cat.name}</span>
              <span className="text-[10px] opacity-60">{cat.count} أصناف</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Menu by Category */}
      {mockCategories.map((cat) => {
        const items = grouped[cat.name];
        if (!items || items.length === 0) return null;
        return (
          <section key={cat.name} id={`rest-cat-${cat.name}`} className="max-w-7xl mx-auto px-6 py-14 scroll-mt-28">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="flex items-center gap-3 mb-8">
              <span className="text-3xl">{cat.icon}</span>
              <h3 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(15,80%,55%)" }}>
                {cat.name}
              </h3>
              <div className="flex-1 h-[1px]" style={{ backgroundColor: "hsla(15,80%,50%,0.15)" }} />
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {items.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group flex gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                  style={{ backgroundColor: "hsla(20,30%,10%,0.6)", borderColor: "hsla(30,20%,90%,0.05)" }}>
                  <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{product.name}</h4>
                        {product.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "hsla(15,80%,50%,0.2)", color: "hsl(15,80%,60%)" }}>
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "hsla(30,20%,90%,0.4)" }}>{product.desc}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-bold" style={{ color: "hsl(15, 80%, 55%)" }}>{product.price} ج.م</p>
                      <Button size="sm" className="rounded-full text-xs h-8" style={{ backgroundColor: "hsl(15,80%,50%)", color: "white" }}>
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

      {/* Info Section */}
      <section className="py-20 border-t" style={{ borderColor: "hsla(30,20%,90%,0.05)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: Clock, title: "ساعات العمل", desc: "يومياً من 11 ص حتى 12 م" },
            { icon: MapPin, title: "العنوان", desc: "القاهرة، مصر الجديدة" },
            { icon: Phone, title: "احجز طاولتك", desc: "0100-123-4567" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="text-center p-8 rounded-2xl border" style={{ backgroundColor: "hsla(20,30%,10%,0.4)", borderColor: "hsla(30,20%,90%,0.05)" }}>
              <f.icon className="w-8 h-8 mx-auto mb-4" style={{ color: "hsl(15,80%,55%)" }} />
              <h4 className="font-bold mb-2">{f.title}</h4>
              <p className="text-sm" style={{ color: "hsla(30,20%,90%,0.4)" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(15, 80%, 55%)" }}>
            عجبك شكل المطعم؟
          </h3>
          <p className="mb-8 max-w-md mx-auto text-sm" style={{ color: "hsla(30,20%,90%,0.4)" }}>
            سجّل الآن واحصل على موقع مطعمك الخاص
          </p>
          <Button onClick={() => navigate("/register?type=restaurant")} size="lg" className="rounded-full px-12"
            style={{ backgroundColor: "hsl(15, 80%, 50%)", color: "white" }}>
            ابدأ مطعمك الآن <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs" style={{ borderColor: "hsla(30,20%,90%,0.05)", color: "hsla(30,20%,90%,0.2)" }}>
        <p>© 2026 StoreHub - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default DemoRestaurantStore;
