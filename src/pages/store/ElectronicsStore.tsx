import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Star, Heart, Cpu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";

const ElectronicsStore = () => {
  const { organization, products, isLoading, orgId } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <p className="text-muted-foreground">المتجر غير موجود أو غير مفعّل</p>
      </div>
    );
  }

  const categories = settings?.categories?.length ? ["الكل", ...settings.categories] : ["الكل"];

  return (
    <div className="min-h-screen bg-background" dir="rtl" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">{organization.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[60vh] overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${settings?.hero_image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-blue-900/80 to-blue-800/40" />
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6">
          <div className="text-white max-w-lg">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              {settings?.hero_title || "عالم الإلكترونيات"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/70 mb-8 text-lg"
            >
              {settings?.hero_subtitle || "أحدث الأجهزة والتقنيات بأفضل الأسعار"}
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <Button className="bg-white text-blue-900 hover:bg-white/90 rounded-full px-8 py-6 text-sm tracking-wider font-semibold">
                {settings?.hero_button_text || "تسوق الآن"}
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Categories */}
      {categories.length > 1 && (
        <section className="max-w-7xl mx-auto px-6 pt-12">
          <div className="flex gap-3 overflow-x-auto pb-4">
            {categories.map((cat, i) => (
              <Button key={cat} variant={i === 0 ? "default" : "outline"} className="rounded-full whitespace-nowrap">
                {cat}
              </Button>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-3xl font-bold mb-10">منتجاتنا</h3>
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">لا توجد منتجات حالياً</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group cursor-pointer bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/5] overflow-hidden bg-secondary relative">
                  {product.image_url && (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  )}
                  <button className="absolute top-3 left-3 w-8 h-8 bg-background/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-4 h-4" />
                  </button>
                  {product.category && (
                    <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <h4 className="font-medium text-foreground mb-2">{product.name}</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-primary font-bold">{product.price.toLocaleString()} ج.م</p>
                    <Button size="sm" variant="outline" className="rounded-full text-xs">
                      أضف للسلة
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 {organization.name} - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default ElectronicsStore;
