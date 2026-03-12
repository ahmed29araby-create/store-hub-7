import { motion } from "framer-motion";
import { ShoppingBag, Baby, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreProducts } from "@/hooks/useStoreProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFavorites } from "@/hooks/useFavorites";
import { useParams } from "react-router-dom";

const KidsToysStore = () => {
  const { orgId } = useParams();
  const { organization, products, isLoading } = useStoreProducts();
  const { settings } = useStoreSettings(orgId);
  const { toggleFavorite, isFavorite } = useFavorites(orgId);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;

  const heroTitle = settings?.hero_title || "عالم المرح والسعادة";
  const heroSubtitle = settings?.hero_subtitle || "ملابس أطفال، ألعاب تعليمية، عربات ومستلزمات الرضع";
  const heroButton = settings?.hero_button_text || "تسوق الآن";
  const cats = settings?.categories || [];

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: "hsl(45,50%,97%)" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b" style={{ borderColor: "hsl(45,40%,88%)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background:"linear-gradient(135deg, hsl(280,60%,60%), hsl(200,70%,55%))" }}><Baby className="w-5 h-5 text-white" /></div>
            <h1 className="text-xl font-black" style={{ color:"hsl(280,60%,45%)" }}>{organization?.name || "كيدز لاند"}</h1>
          </div>
          <Button variant="ghost" size="icon" className="relative" style={{ color:"hsl(280,60%,55%)" }}><ShoppingBag className="w-5 h-5" /></Button>
        </div>
      </nav>

      <section className="relative overflow-hidden py-16" style={{ background:"linear-gradient(135deg, hsl(280,50%,92%), hsl(200,60%,92%), hsl(45,70%,92%))" }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2 initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.4 }} className="text-5xl font-black mb-6">
            <span style={{ color:"hsl(280,60%,45%)" }}>{heroTitle}</span>
          </motion.h2>
          {heroSubtitle && <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }} className="text-lg mb-8" style={{ color:"hsl(280,20%,45%)" }}>{heroSubtitle}</motion.p>}
          <Button className="rounded-full px-10 py-6 text-white font-bold" style={{ background:"linear-gradient(135deg, hsl(280,60%,55%), hsl(200,70%,55%))" }}>{heroButton}</Button>
        </div>
      </section>

      {cats.length > 0 && <section className="max-w-7xl mx-auto px-6 py-10"><div className="flex flex-wrap gap-3 justify-center">{cats.map((c,i) => <motion.button key={c} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }} className="px-6 py-3 rounded-full border bg-white text-sm font-bold" style={{ borderColor:"hsl(280,50%,85%)", color:"hsl(280,60%,40%)" }}>{c}</motion.button>)}</div></section>}

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-black mb-10" style={{ color:"hsl(280,60%,40%)" }}>منتجاتنا</h3>
        {products.length === 0 ? <div className="text-center py-12 text-muted-foreground">لا توجد منتجات حالياً</div> :
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">{products.map((p,i) => <motion.div key={p.id} initial={{ opacity:0,y:25 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.08 }} className="group bg-white rounded-[1.5rem] overflow-hidden shadow-sm cursor-pointer" style={{ border:"2px solid hsl(45,40%,90%)" }}>
          <div className="aspect-[4/5] overflow-hidden relative" style={{ backgroundColor:"hsl(45,50%,95%)" }}>{p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-10 h-10 opacity-20" /></div>}
            <button onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id, p.organization_id); }} className="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
              <Heart className={`w-4 h-4 ${isFavorite(p.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </button>
          </div>
          <div className="p-3"><h4 className="font-bold text-sm mb-1" style={{ color:"hsl(280,40%,25%)" }}>{p.name}</h4><p className="font-black text-sm" style={{ color:"hsl(280,60%,55%)" }}>{p.price} ج.م</p></div>
        </motion.div>)}</div>}
      </section>
    </div>
  );
};
export default KidsToysStore;
