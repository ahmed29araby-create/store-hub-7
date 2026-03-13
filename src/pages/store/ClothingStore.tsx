import { motion } from "framer-motion";
import { ShoppingBag, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { useParams, useNavigate } from "react-router-dom";

const ClothingStore = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const { organization, products, isLoading } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);
  const { addToCart, isInCart, getCartCount } = useCart(orgId);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;
  }

  const heroTitle = settings?.hero_title || "أناقة بلا حدود";
  const heroSubtitle = settings?.hero_subtitle || "اكتشف أحدث صيحات الموضة والأزياء العصرية";
  const heroButton = settings?.hero_button_text || "تسوق الآن";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80";
  const categories = settings?.categories || [];
  const cartCount = getCartCount();

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(30, 20%, 97%)", fontFamily: "'Inter', sans-serif" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>{organization?.name || "NOIR"}</h1>
          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/dashboard")}>
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white border-0">{cartCount}</Badge>}
          </Button>
        </div>
      </nav>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-black/30" />
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-4">
          <div className="text-white max-w-lg">
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{heroTitle}</motion.h2>
            {heroSubtitle && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-white/80 text-sm mb-4">{heroSubtitle}</motion.p>}
            <Button className="bg-white text-black hover:bg-white/90 rounded-none px-6 py-4 text-xs tracking-wider">{heroButton}</Button>
          </div>
        </div>
      </motion.section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat, i) => (
              <motion.button key={cat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="px-4 py-2 rounded-full border border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground transition-colors text-xs font-medium">{cat}</motion.button>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>أحدث المنتجات</h3>
        {products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">لا توجد منتجات حالياً</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden bg-secondary rounded-sm mb-2 relative">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ShoppingBag className="w-8 h-8 opacity-30" /></div>
                  )}
                  <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }} className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                      <Heart className={`w-3.5 h-3.5 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(product.id, product.organization_id); }} className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                      <ShoppingCart className={`w-3.5 h-3.5 ${isInCart(product.id) ? "text-green-600" : "text-gray-600"}`} />
                    </button>
                  </div>
                </div>
                <h4 className="font-medium text-foreground mb-0.5 text-xs truncate">{product.name}</h4>
                <p className="text-muted-foreground text-xs">{product.price} ج.م</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ClothingStore;
