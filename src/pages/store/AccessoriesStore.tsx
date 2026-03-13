import { motion } from "framer-motion";
import { ShoppingBag, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const AccessoriesStore = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const { organization, products, isLoading } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);
  const { addToCart, isInCart, getCartCount } = useCart(orgId);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;
  }

  const heroTitle = settings?.hero_title || "فخامة لا تُضاهى";
  const heroSubtitle = settings?.hero_subtitle || "تشكيلة حصرية";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1600&q=80";
  const categories = settings?.categories || [];
  const cartCount = getCartCount();

  return (
    <div className="min-h-screen text-white" dir="rtl" style={{ backgroundColor: "hsl(30, 15%, 6%)", fontFamily: "'Inter', sans-serif" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "hsl(43, 74%, 49%)" }}>{organization?.name || "LUXE"}</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10 relative" onClick={() => navigate("/dashboard")}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white border-0">{cartCount}</Badge>
              )}
            </Button>
          </div>
        </div>
      </nav>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 h-full flex items-end max-w-7xl mx-auto px-4 pb-10">
          <div>
            <motion.div initial={{ width: 0 }} animate={{ width: 60 }} transition={{ delay: 0.3, duration: 0.8 }} className="h-[2px] mb-4" style={{ backgroundColor: "hsl(43, 74%, 49%)" }} />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: "hsl(43, 74%, 49%)" }}>{heroSubtitle}</motion.p>
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-3xl md:text-5xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{heroTitle}</motion.h2>
          </div>
        </div>
      </motion.section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat, i) => (
              <motion.button key={cat} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="px-4 py-2 rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition-colors text-xs font-medium">{cat}</motion.button>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: "hsl(43, 74%, 49%)" }}>المنتجات المميزة</h3>
        {products.length === 0 ? (
          <div className="text-center py-12 text-white/50">لا توجد منتجات حالياً</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden rounded-sm mb-2 border border-white/10 relative">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5"><ShoppingBag className="w-8 h-8 opacity-20" /></div>
                  )}
                  <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }} className="w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Heart className={`w-3.5 h-3.5 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-white/80"}`} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(product.id, product.organization_id); }} className="w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <ShoppingCart className={`w-3.5 h-3.5 ${isInCart(product.id) ? "text-green-400" : "text-white/80"}`} />
                    </button>
                  </div>
                </div>
                <h4 className="font-medium mb-0.5 text-xs truncate">{product.name}</h4>
                <p className="text-xs" style={{ color: "hsl(43, 74%, 49%)" }}>{product.price} ج.م</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AccessoriesStore;
