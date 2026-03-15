import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";
import { useParams } from "react-router-dom";

const AccessoriesStore = () => {
  const { orgId } = useParams();
  const { organization, products, groupedProducts, uncategorizedProducts, isLoading } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;
  }

  const heroTitle = settings?.hero_title || "فخامة لا تُضاهى";
  const heroSubtitle = settings?.hero_subtitle || "تشكيلة حصرية";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1600&q=80";

  const renderProductCard = (product: any, i: number) => (
    <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="group cursor-pointer">
      <div className="aspect-[4/5] overflow-hidden rounded-sm mb-3 border border-white/10 relative">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5"><ShoppingBag className="w-12 h-12 opacity-20" /></div>
        )}
        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }} className="absolute top-2 left-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
          <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-white/80"}`} />
        </button>
      </div>
      <h4 className="font-medium mb-1 text-sm">{product.name}</h4>
      <p className="text-sm" style={{ color: "hsl(43, 74%, 49%)" }}>{product.price} ج.م</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen text-white" dir="rtl" style={{ backgroundColor: "hsl(30, 15%, 6%)", fontFamily: "'Inter', sans-serif" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "hsl(43, 74%, 49%)" }}>{organization?.name || "LUXE"}</h1>
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10"><ShoppingBag className="w-5 h-5" /></Button>
        </div>
      </nav>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 h-full flex items-end max-w-7xl mx-auto px-6 pb-16">
          <div>
            <motion.div initial={{ width: 0 }} animate={{ width: 60 }} transition={{ delay: 0.3, duration: 0.8 }} className="h-[2px] mb-6" style={{ backgroundColor: "hsl(43, 74%, 49%)" }} />
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-sm uppercase tracking-[0.4em] mb-4" style={{ color: "hsl(43, 74%, 49%)" }}>{heroSubtitle}</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-5xl md:text-7xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{heroTitle}</motion.h2>
          </div>
        </div>
      </motion.section>

      {groupedProducts.length > 0 ? (
        groupedProducts.map((group, gi) => (
          <section key={group.category.id} className="max-w-7xl mx-auto px-6 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.1 }} className="flex items-center gap-3 mb-8">
              <h3 className="text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "hsl(43, 74%, 49%)" }}>{group.category.name}</h3>
              <span className="text-sm text-white/50">({group.products.length})</span>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {group.products.map((p, i) => renderProductCard(p, i))}
            </div>
          </section>
        ))
      ) : products.length === 0 ? (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center py-12 text-white/50">لا توجد منتجات حالياً</div>
        </section>
      ) : null}

      {uncategorizedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", color: "hsl(43, 74%, 49%)" }}>أخرى</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {uncategorizedProducts.map((p, i) => renderProductCard(p, i))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AccessoriesStore;
