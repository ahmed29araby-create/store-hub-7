import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useParams } from "react-router-dom";

const HomeDecorStore = () => {
  const { orgId } = useParams();
  const { organization, products, isLoading } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;
  const heroTitle = settings?.hero_title || "صمّم بيتك بذوقك";
  const heroSubtitle = settings?.hero_subtitle || "أثاث، ديكور، إضاءة ومفروشات بأعلى جودة";
  const heroButton = settings?.hero_button_text || "تسوق الآن";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80";
  const cats = settings?.categories || [];

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
      {cats.length > 0 && <section className="max-w-7xl mx-auto px-6 py-10"><div className="flex flex-wrap gap-3 justify-center">{cats.map((c,i) => <motion.button key={c} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }} className="px-6 py-3 rounded-full border bg-white text-sm font-medium" style={{ borderColor:"hsl(30,20%,85%)", color:"hsl(30,30%,30%)" }}>{c}</motion.button>)}</div></section>}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold mb-10" style={{ fontFamily: "'Playfair Display', serif", color: "hsl(30,30%,25%)" }}>منتجاتنا</h3>
        {products.length === 0 ? <div className="text-center py-12 text-muted-foreground">لا توجد منتجات حالياً</div> :
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">{products.map((p,i) => <motion.div key={p.id} initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.08 }} className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border:"1px solid hsl(30,20%,90%)" }}>
          <div className="aspect-[4/5] overflow-hidden">{p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ShoppingBag className="w-12 h-12 opacity-30" /></div>}</div>
          <div className="p-4"><h4 className="font-medium mb-1" style={{ color:"hsl(30,30%,20%)" }}>{p.name}</h4><p className="font-bold" style={{ color:"hsl(30,50%,40%)" }}>{p.price} ج.م</p></div>
        </motion.div>)}</div>}
      </section>
    </div>
  );
};
export default HomeDecorStore;
