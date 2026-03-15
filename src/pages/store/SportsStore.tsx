import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Heart, Dumbbell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";

const SportsStore = () => {
  const { organization, products, groupedProducts, uncategorizedProducts, isLoading: productsLoading, orgId } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);

  const renderProductCard = (product: any, i: number) => (
    <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="group cursor-pointer bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[4/5] overflow-hidden bg-secondary relative">
        {product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.organization_id); }} className="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
          <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </button>
      </div>
      <div className="p-3">
        <h4 className="font-medium text-foreground mb-1 text-sm">{product.name}</h4>
        <p className="text-primary font-bold text-sm">{product.price.toLocaleString()} ج.م</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl" style={{ fontFamily: "'Inter', sans-serif" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">{organization?.name || "فِت ستور"}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Search className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="relative"><ShoppingBag className="w-5 h-5" /></Button>
          </div>
        </div>
      </nav>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${settings?.hero_image_url || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80"})` }} />
        <div className="absolute inset-0 bg-gradient-to-l from-emerald-900/80 to-emerald-800/40" />
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6">
          <div className="text-white max-w-lg">
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-5xl md:text-6xl font-bold mb-6">{settings?.hero_title || "ابدأ رحلتك الرياضية"}</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-white/70 mb-8 text-lg">{settings?.hero_subtitle || "ملابس رياضية، أجهزة، مكملات غذائية وأدوات تدريب"}</motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <Button className="bg-white text-emerald-900 hover:bg-white/90 rounded-full px-8 py-6 text-sm tracking-wider font-semibold">{settings?.hero_button_text || "تسوق الآن"}<ArrowLeft className="w-4 h-4 mr-2" /></Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {groupedProducts.length > 0 ? (
        groupedProducts.map((group, gi) => (
          <section key={group.category.id} className="max-w-7xl mx-auto px-6 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.1 }} className="flex items-center gap-3 mb-8">
              <h3 className="text-3xl font-bold">{group.category.name}</h3>
              <span className="text-sm text-muted-foreground">({group.products.length})</span>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {group.products.map((p, i) => renderProductCard(p, i))}
            </div>
          </section>
        ))
      ) : productsLoading ? (
        <p className="text-center text-muted-foreground py-20">جاري التحميل...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">لا توجد منتجات حالياً</p>
      ) : null}

      {uncategorizedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-3xl font-bold mb-8">أخرى</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {uncategorizedProducts.map((p, i) => renderProductCard(p, i))}
          </div>
        </section>
      )}

      <footer className="border-t py-8 text-center text-sm text-muted-foreground"><p>© 2026 StoreHub - جميع الحقوق محفوظة</p></footer>
    </div>
  );
};

export default SportsStore;
