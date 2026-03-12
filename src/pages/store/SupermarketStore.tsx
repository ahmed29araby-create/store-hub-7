import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useParams } from "react-router-dom";

const SupermarketStore = () => {
  const { orgId } = useParams();
  const { organization, products, isLoading } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;
  const heroTitle = settings?.hero_title || "كل ما تحتاجه";
  const heroSubtitle = settings?.hero_subtitle || "مواد غذائية، خضار وفواكه طازجة بأسعار تنافسية";
  const heroButton = settings?.hero_button_text || "تسوق الآن";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80";
  const cats = settings?.categories || [];

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(80,20%,97%)" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b" style={{ borderColor: "hsl(80,30%,88%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ color: "hsl(130,55%,25%)" }}>{organization?.name || "فريش ماركت"}</h1>
          <Button variant="ghost" size="icon" className="relative" style={{ color: "hsl(130,55%,35%)" }}><ShoppingCart className="w-5 h-5" /></Button>
        </div>
      </nav>
      <motion.section initial={{ opacity:0 }} animate={{ opacity:1 }} className="relative overflow-hidden" style={{ background:"linear-gradient(135deg, hsl(130,55%,45%), hsl(90,50%,40%))" }}>
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <motion.h2 initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.4 }} className="text-5xl lg:text-6xl font-bold mb-6">{heroTitle}</motion.h2>
            {heroSubtitle && <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }} className="text-white/70 text-lg mb-8">{heroSubtitle}</motion.p>}
            <Button className="bg-white hover:bg-white/90 rounded-full px-8 py-6 text-sm font-bold" style={{ color:"hsl(130,55%,30%)" }}>{heroButton}</Button>
          </div>
        </div>
      </motion.section>
      {cats.length > 0 && <section className="max-w-7xl mx-auto px-6 py-10"><div className="flex flex-wrap gap-3 justify-center">{cats.map((c,i) => <motion.button key={c} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }} className="px-6 py-3 rounded-full border bg-white text-sm font-medium" style={{ borderColor:"hsl(80,20%,85%)", color:"hsl(130,55%,25%)" }}>{c}</motion.button>)}</div></section>}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold mb-10" style={{ color: "hsl(130,55%,20%)" }}>منتجاتنا</h3>
        {products.length === 0 ? <div className="text-center py-12 text-muted-foreground">لا توجد منتجات حالياً</div> :
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">{products.map((p,i) => <motion.div key={p.id} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.08 }} className="group bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer" style={{ border:"1px solid hsl(80,20%,90%)" }}>
          <div className="aspect-square overflow-hidden" style={{ backgroundColor:"hsl(80,20%,95%)" }}>{p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingCart className="w-10 h-10 opacity-20" /></div>}</div>
          <div className="p-3"><h4 className="font-medium text-xs mb-1" style={{ color:"hsl(130,55%,15%)" }}>{p.name}</h4><p className="font-bold text-sm" style={{ color:"hsl(130,55%,40%)" }}>{p.price} ج.م</p></div>
        </motion.div>)}</div>}
      </section>
    </div>
  );
};
export default SupermarketStore;
