import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SetupPage from "./pages/Setup";
import CustomerRegister from "./pages/CustomerRegister";
import MyAccount from "./pages/MyAccount";
import ClothingStore from "./pages/store/ClothingStore";
import AccessoriesStore from "./pages/store/AccessoriesStore";
import RestaurantStore from "./pages/store/RestaurantStore";
import PharmacyStore from "./pages/store/PharmacyStore";
import ElectronicsStore from "./pages/store/ElectronicsStore";
import SportsStore from "./pages/store/SportsStore";
import GiftsStore from "./pages/store/GiftsStore";
import HomeDecorStore from "./pages/store/HomeDecorStore";
import SupermarketStore from "./pages/store/SupermarketStore";
import KidsToysStore from "./pages/store/KidsToysStore";
import DemoClothingStore from "./pages/demo/DemoClothingStore";
import DemoAccessoriesStore from "./pages/demo/DemoAccessoriesStore";
import DemoRestaurantStore from "./pages/demo/DemoRestaurantStore";
import DemoPharmacyStore from "./pages/demo/DemoPharmacyStore";
import DemoElectronicsStore from "./pages/demo/DemoElectronicsStore";
import DemoSportsStore from "./pages/demo/DemoSportsStore";
import DemoGiftsStore from "./pages/demo/DemoGiftsStore";
import DemoHomeDecorStore from "./pages/demo/DemoHomeDecorStore";
import DemoSupermarketStore from "./pages/demo/DemoSupermarketStore";
import DemoKidsToysStore from "./pages/demo/DemoKidsToysStore";
import RealEstateStore from "./pages/store/RealEstateStore";
import DemoRealEstateStore from "./pages/demo/DemoRealEstateStore";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/customer-register" element={<CustomerRegister />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/store/clothing/:orgId" element={<ClothingStore />} />
            <Route path="/store/accessories/:orgId" element={<AccessoriesStore />} />
            <Route path="/store/restaurant/:orgId" element={<RestaurantStore />} />
            <Route path="/store/pharmacy/:orgId" element={<PharmacyStore />} />
            <Route path="/store/electronics/:orgId" element={<ElectronicsStore />} />
            <Route path="/store/sports/:orgId" element={<SportsStore />} />
            <Route path="/store/gifts/:orgId" element={<GiftsStore />} />
            <Route path="/store/home_decor/:orgId" element={<HomeDecorStore />} />
            <Route path="/store/supermarket/:orgId" element={<SupermarketStore />} />
            <Route path="/store/kids_toys/:orgId" element={<KidsToysStore />} />
            <Route path="/store/real_estate/:orgId" element={<RealEstateStore />} />
            <Route path="/demo/clothing" element={<DemoClothingStore />} />
            <Route path="/demo/accessories" element={<DemoAccessoriesStore />} />
            <Route path="/demo/restaurant" element={<DemoRestaurantStore />} />
            <Route path="/demo/pharmacy" element={<DemoPharmacyStore />} />
            <Route path="/demo/electronics" element={<DemoElectronicsStore />} />
            <Route path="/demo/sports" element={<DemoSportsStore />} />
            <Route path="/demo/gifts" element={<DemoGiftsStore />} />
            <Route path="/demo/home-decor" element={<DemoHomeDecorStore />} />
            <Route path="/demo/supermarket" element={<DemoSupermarketStore />} />
            <Route path="/demo/kids-toys" element={<DemoKidsToysStore />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
