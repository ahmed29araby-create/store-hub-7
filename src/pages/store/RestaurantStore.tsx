import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";
import { useParams } from "react-router-dom";

const RestaurantStore = () => {
  const { orgId } = useParams();
  const { organization, products, isLoading } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;
  }

  const heroTitle = settings?.hero_title || "نكهات لا تُنسى";
  const heroSubtitle = settings?.hero_subtitle || "أطباق مُعدّة بشغف من أجود المكونات الطازجة";
  const heroButton = settings?.hero_button_text || "اطلب الآن";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80";
  const categories = settings?.categories || [];

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(30, 30%, 97%)", fontFamily: "'Inter', sans-serif" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Satisfy', cursive", color: "hsl(15, 80%, 50%)" }}>{organization?.name || "ذوق"}</h1>
          <Button variant="ghost" size="icon"><ShoppingBag className="w-5 h-5" /></Button>
        </div>
      </nav>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-black/30" />
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="text-white">
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-6xl md:text-8xl font-bold mb-4" style={{ fontFamily: "'Satisfy', cursive" }}>{heroTitle}</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-white/70 text-lg max-w-md mx-auto mb-8">{heroSubtitle}</motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <Button className="rounded-full px-8 py-6 text-sm tracking-wider" style={{ backgroundColor: "hsl(15, 80%, 50%)", color: "white" }}>{heroButton}</Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat, i) => (
              <motion.button key={cat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="px-6 py-3 rounded-full border border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">{cat}</motion.button>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Satisfy', cursive", color: "hsl(15, 80%, 50%)" }}>قائمة الطعام</h3>
          <p className="text-muted-foreground">اختر من أشهى الأطباق</p>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">لا توجد أطباق حالياً</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-[4/5] overflow-hidden relative">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary"><ShoppingBag className="w-12 h-12 opacity-20" /></div>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }} className="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                    <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                  </button>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-foreground text-sm mb-1">{product.name}</h4>
                  {product.description && <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{product.description}</p>}
                  <p className="font-bold" style={{ color: "hsl(15, 80%, 50%)" }}>{product.price} ج.م</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default RestaurantStore;
