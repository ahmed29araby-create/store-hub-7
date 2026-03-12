import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useParams } from "react-router-dom";

const ClothingStore = () => {
  const { orgId } = useParams();
  const { organization, products, isLoading } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;
  }

  const heroTitle = settings?.hero_title || "أناقة بلا حدود";
  const heroSubtitle = settings?.hero_subtitle || "اكتشف أحدث صيحات الموضة والأزياء العصرية بأسعار تنافسية";
  const heroButton = settings?.hero_button_text || "تسوق الآن";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80";
  const categories = settings?.categories || [];

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(30, 20%, 97%)", fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            {organization?.name || "NOIR"}
          </h1>
          <Button variant="ghost" size="icon">
            <ShoppingBag className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[70vh] overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-black/30" />
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6">
          <div className="text-white max-w-lg">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm uppercase tracking-[0.3em] mb-4 opacity-70"
            >
              مجموعة 2026
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-5xl md:text-7xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {heroTitle}
            </motion.h2>
            {heroSubtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-white/80 text-lg mb-6"
              >
                {heroSubtitle}
              </motion.p>
            )}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <Button className="bg-white text-black hover:bg-white/90 rounded-none px-8 py-6 text-sm tracking-wider">
                {heroButton}
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat, i) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="px-6 py-3 rounded-full border border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>
          أحدث المنتجات
        </h3>
        {products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">لا توجد منتجات حالياً</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] overflow-hidden bg-secondary rounded-sm mb-3">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ShoppingBag className="w-12 h-12 opacity-30" />
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-foreground mb-1">{product.name}</h4>
                <p className="text-muted-foreground text-sm">{product.price} ج.م</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ClothingStore;
