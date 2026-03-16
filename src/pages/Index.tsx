import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shirt, Watch, UtensilsCrossed, Pill, Cpu, Dumbbell, Gift, LogIn, Store, Sofa, ShoppingCart, Baby, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const storeTypes = [
  {
    id: "clothing",
    title: "متجر ملابس",
    subtitle: "Fashion & Streetwear",
    description: "أزياء عصرية، كوتشات، وأحدث صيحات الموضة",
    icon: Shirt,
    path: "/demo/clothing",
    gradient: "from-[hsl(0,0%,9%)] to-[hsl(0,0%,25%)]",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  },
  {
    id: "accessories",
    title: "متجر إكسسوارات",
    subtitle: "Luxury & Elegance",
    description: "عطور فاخرة، ساعات راقية، وإكسسوارات مميزة",
    icon: Watch,
    path: "/demo/accessories",
    gradient: "from-[hsl(43,74%,30%)] to-[hsl(43,90%,50%)]",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
  },
  {
    id: "restaurant",
    title: "مطعم",
    subtitle: "Food & Dining",
    description: "أطباق شهية، وجبات مميزة، وتجربة طعام فريدة",
    icon: UtensilsCrossed,
    path: "/demo/restaurant",
    gradient: "from-[hsl(15,80%,35%)] to-[hsl(30,70%,50%)]",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  },
  {
    id: "pharmacy",
    title: "صيدلية",
    subtitle: "Health & Wellness",
    description: "أدوية، فيتامينات، مستحضرات تجميل وأجهزة طبية",
    icon: Pill,
    path: "/demo/pharmacy",
    gradient: "from-[hsl(150,60%,20%)] to-[hsl(160,50%,40%)]",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80",
  },
  {
    id: "electronics",
    title: "إلكترونيات وتقنية",
    subtitle: "Electronics & Tech",
    description: "جوالات، لابتوبات، سماعات، ساعات ذكية وأجهزة منزلية",
    icon: Cpu,
    path: "/demo/electronics",
    gradient: "from-[hsl(220,70%,25%)] to-[hsl(210,60%,45%)]",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  },
  {
    id: "sports",
    title: "رياضة ولياقة",
    subtitle: "Sports & Fitness",
    description: "ملابس رياضية، أدوات، مكملات غذائية وأجهزة رياضية",
    icon: Dumbbell,
    path: "/demo/sports",
    gradient: "from-[hsl(150,60%,20%)] to-[hsl(160,70%,40%)]",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  },
  {
    id: "gifts",
    title: "هدايا ومناسبات",
    subtitle: "Gifts & Occasions",
    description: "هدايا، ورد، شوكولاتة وتغليف هدايا لكل المناسبات",
    icon: Gift,
    path: "/demo/gifts",
    gradient: "from-[hsl(340,60%,30%)] to-[hsl(350,70%,50%)]",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&q=80",
  },
  {
    id: "home_decor",
    title: "المنزل والديكور",
    subtitle: "Home & Decor",
    description: "أثاث، أدوات مطبخ، ديكور، إضاءة ومفروشات",
    icon: Sofa,
    path: "/demo/home-decor",
    gradient: "from-[hsl(30,40%,25%)] to-[hsl(30,50%,45%)]",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
  },
  {
    id: "supermarket",
    title: "سوبرماركت",
    subtitle: "Supermarket & Grocery",
    description: "مواد غذائية، مشروبات، خضار وفواكه ومنتجات عضوية",
    icon: ShoppingCart,
    path: "/demo/supermarket",
    gradient: "from-[hsl(130,50%,20%)] to-[hsl(90,50%,40%)]",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
  },
  {
    id: "kids_toys",
    title: "أطفال وألعاب",
    subtitle: "Kids & Toys",
    description: "ملابس أطفال، ألعاب، عربات أطفال ومستلزمات الرضع",
    icon: Baby,
    path: "/demo/kids-toys",
    gradient: "from-[hsl(280,50%,30%)] to-[hsl(200,60%,50%)]",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80",
  },
  {
    id: "real_estate",
    title: "عقارات",
    subtitle: "Real Estate",
    description: "شقق، فلل، أراضي، محلات تجارية وعقارات استثمارية",
    icon: Building,
    path: "/demo/real-estate",
    gradient: "from-[hsl(220,60%,25%)] to-[hsl(220,50%,45%)]",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-10 pb-6 px-6 md:px-12 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          StoreHub
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-6">
          اختر نوع متجرك وابدأ رحلتك التجارية
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button variant="outline" onClick={() => navigate("/login")} className="min-w-[140px]">
            <LogIn className="w-4 h-4 ml-2" />
            تسجيل الدخول
          </Button>
          <Button variant="secondary" onClick={() => navigate("/customer-register")} className="min-w-[140px]">
            <UserPlus className="w-4 h-4 ml-2" />
            إنشاء حساب
          </Button>
          <Button onClick={() => navigate("/register")} className="bg-primary text-primary-foreground min-w-[140px]">
            <Store className="w-4 h-4 ml-2" />
            إنشاء موقع
          </Button>
        </div>
      </motion.header>

      {/* Store Type Cards */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-[1400px] w-full">
          {storeTypes.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(store.path)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl aspect-[2/3]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${store.image})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${store.gradient} opacity-70 group-hover:opacity-80 transition-opacity duration-500`} />
              <div className="relative z-10 h-full flex flex-col justify-end p-5 text-white">
                <store.icon className="w-8 h-8 mb-3 opacity-80" />
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {store.subtitle}
                </p>
                <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {store.title}
                </h2>
                <p className="text-xs opacity-70 leading-relaxed line-clamp-2">
                  {store.description}
                </p>
                <motion.div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs tracking-wide">ابدأ الآن</span>
                  <span className="text-sm">←</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
