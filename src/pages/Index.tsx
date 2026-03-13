import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shirt, Watch, UtensilsCrossed, Pill, Cpu, Dumbbell, Gift, LogIn, Store, Sofa, ShoppingCart, Baby, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const storeTypes = [
  { id: "clothing", title: "متجر ملابس", subtitle: "Fashion & Streetwear", icon: Shirt, path: "/demo/clothing", gradient: "from-[hsl(0,0%,9%)] to-[hsl(0,0%,25%)]", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" },
  { id: "accessories", title: "متجر إكسسوارات", subtitle: "Luxury & Elegance", icon: Watch, path: "/demo/accessories", gradient: "from-[hsl(43,74%,30%)] to-[hsl(43,90%,50%)]", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80" },
  { id: "restaurant", title: "مطعم", subtitle: "Food & Dining", icon: UtensilsCrossed, path: "/demo/restaurant", gradient: "from-[hsl(15,80%,35%)] to-[hsl(30,70%,50%)]", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" },
  { id: "pharmacy", title: "صيدلية", subtitle: "Health & Wellness", icon: Pill, path: "/demo/pharmacy", gradient: "from-[hsl(150,60%,20%)] to-[hsl(160,50%,40%)]", image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80" },
  { id: "electronics", title: "إلكترونيات وتقنية", subtitle: "Electronics & Tech", icon: Cpu, path: "/demo/electronics", gradient: "from-[hsl(220,70%,25%)] to-[hsl(210,60%,45%)]", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" },
  { id: "sports", title: "رياضة ولياقة", subtitle: "Sports & Fitness", icon: Dumbbell, path: "/demo/sports", gradient: "from-[hsl(150,60%,20%)] to-[hsl(160,70%,40%)]", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
  { id: "gifts", title: "هدايا ومناسبات", subtitle: "Gifts & Occasions", icon: Gift, path: "/demo/gifts", gradient: "from-[hsl(340,60%,30%)] to-[hsl(350,70%,50%)]", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&q=80" },
  { id: "home_decor", title: "المنزل والديكور", subtitle: "Home & Decor", icon: Sofa, path: "/demo/home-decor", gradient: "from-[hsl(30,40%,25%)] to-[hsl(30,50%,45%)]", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80" },
  { id: "supermarket", title: "سوبرماركت", subtitle: "Supermarket & Grocery", icon: ShoppingCart, path: "/demo/supermarket", gradient: "from-[hsl(130,50%,20%)] to-[hsl(90,50%,40%)]", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80" },
  { id: "kids_toys", title: "أطفال وألعاب", subtitle: "Kids & Toys", icon: Baby, path: "/demo/kids-toys", gradient: "from-[hsl(280,50%,30%)] to-[hsl(200,60%,50%)]", image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-6 pb-4 px-4 md:px-12 text-center"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          StoreHub
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-4">
          اختر نوع متجرك وابدأ رحلتك الآن
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => navigate("/login")} className="min-w-[110px]">
            <LogIn className="w-3.5 h-3.5 ml-1" />
            تسجيل الدخول
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate("/customer-register")} className="min-w-[110px]">
            <UserPlus className="w-3.5 h-3.5 ml-1" />
            إنشاء حساب
          </Button>
          <Button size="sm" onClick={() => navigate("/register")} className="bg-primary text-primary-foreground min-w-[110px]">
            <Store className="w-3.5 h-3.5 ml-1" />
            إنشاء موقع
          </Button>
        </div>
      </motion.header>

      <div className="flex-1 px-3 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-[1200px] w-full mx-auto">
          {storeTypes.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(store.path)}
              className="group cursor-pointer relative overflow-hidden rounded-xl aspect-[3/4]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${store.image})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${store.gradient} opacity-70 group-hover:opacity-80 transition-opacity duration-500`} />
              <div className="relative z-10 h-full flex flex-col justify-end p-3 text-white">
                <store.icon className="w-5 h-5 mb-2 opacity-80" />
                <p className="text-[8px] uppercase tracking-[0.15em] opacity-60 mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {store.subtitle}
                </p>
                <h2 className="text-sm font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {store.title}
                </h2>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
