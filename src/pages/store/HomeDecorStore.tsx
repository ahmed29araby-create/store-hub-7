import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";
import { useParams } from "react-router-dom";

const HomeDecorStore = () => {
  const { orgId } = useParams();
  const { organization, products, groupedProducts, uncategorizedProducts, isLoading } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;

  const heroTitle = settings?.hero_title || "صمّم بيتك بذوقك";
  const heroSubtitle = settings?.hero_subtitle || "أثاث، ديكور، إضاءة ومفروشات بأعلى جودة";
  const heroButton = settings?.hero_button_text || "تسوق الآن";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80";

  const renderProductCard = (product: any, i: number) => (
    <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: "1px solid hsl(30,20%,90%)" }}>
      <div className="aspect-[4/5] overflow-hidden relative">
        {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ShoppingBag className="w-12 h-12 opacity-30" /></div>}
        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }} className="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
          <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </button>
      </div>
      <div className="p-3">
        <h4 className="font-medium mb-1 text-sm" style={{ color: "hsl(30,30%,20%)" }}>{product.name}</h4>
        <p className="font-bold text-sm" style={{ color: "hsl(30,50%,40%)" }}>{product.price} ج.م</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(30, 25%, 96%)" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b" style={{ borderColor: "hsl(30,20%,88%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(30,30%,25%)" }}>{organization?.name || "بيتي"}</h1>
          <Button variant="ghost" size="icon"><ShoppingBag className="w-5 h-5" /></Button>
        </div>
      </nav>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsla(30,30%,15%,0.7), hsla(30,20%,20%,0.3))" }} />
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6">
          <div className="text-white max-w-lg">
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-5xl md:text-7xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{heroTitle}</motion.h2>
            {heroSubtitle && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-white/80 text-lg mb-6">{heroSubtitle}</motion.p>}
            <Button className="rounded-full px-8 py-6 text-white" style={{ backgroundColor: "hsl(30,50%,45%)" }}>{heroButton}</Button>
          </div>
        </div>
      </motion.section>

      {groupedProducts.length > 0 ? (
        groupedProducts.map((group, gi) => (
          <section key={group.category.id} className="max-w-7xl mx-auto px-6 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.1 }} className="flex items-center gap-3 mb-8">
              <h3 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(30,30%,25%)" }}>{group.category.name}</h3>
              <span className="text-sm text-muted-foreground">({group.products.length})</span>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {group.products.map((p, i) => renderProductCard(p, i))}
            </div>
          </section>
        ))
      ) : products.length === 0 ? (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center py-12 text-muted-foreground">لا توجد منتجات حالياً</div>
        </section>
      ) : null}

      {uncategorizedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(30,30%,25%)" }}>أخرى</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {uncategorizedProducts.map((p, i) => renderProductCard(p, i))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomeDecorStore;
