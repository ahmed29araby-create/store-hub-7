import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardOverview from "@/components/admin/DashboardOverview";
import ProductsManager from "@/components/admin/ProductsManager";
import OrdersManager from "@/components/admin/OrdersManager";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 bg-card">
            <SidebarTrigger className="ml-2" />
            <h1 className="text-lg font-semibold text-foreground mr-4">
              {activeTab === "overview" && "لوحة التحكم"}
              {activeTab === "products" && "إدارة المنتجات"}
              {activeTab === "orders" && "إدارة الطلبات"}
            </h1>
          </header>
          <main className="flex-1 p-6 overflow-auto" dir="rtl">
            {activeTab === "overview" && <DashboardOverview />}
            {activeTab === "products" && <ProductsManager />}
            {activeTab === "orders" && <OrdersManager />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
