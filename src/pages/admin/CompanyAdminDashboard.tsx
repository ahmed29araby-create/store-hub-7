import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import CompanyAdminSidebar from "@/components/admin/CompanyAdminSidebar";
import CompanyProductsManager from "@/components/admin/CompanyProductsManager";
import CompanyOrdersManager from "@/components/admin/CompanyOrdersManager";
import CompanySettings from "@/components/admin/CompanySettings";
import DashboardOverview from "@/components/admin/DashboardOverview";
import StoreAppearanceEditor from "@/components/admin/StoreAppearanceEditor";

const CompanyAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { profile, organization, signOut } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CompanyAdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSignOut={signOut}
          displayName={profile?.display_name || "Admin"}
          orgName={organization?.name || ""}
          storeType={organization?.store_type}
          orgId={organization?.id}
        />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 bg-card">
            <SidebarTrigger className="ml-2" />
            <h1 className="text-lg font-semibold text-foreground mr-4">
              {activeTab === "overview" && "لوحة التحكم"}
              {activeTab === "products" && "إدارة المنتجات"}
              {activeTab === "orders" && "إدارة الطلبات"}
              {activeTab === "appearance" && "تخصيص واجهة المتجر"}
              {activeTab === "settings" && "الإعدادات"}
            </h1>
          </header>
          <main className="flex-1 p-6 overflow-auto" dir="rtl">
            {activeTab === "overview" && <DashboardOverview organizationId={organization?.id} />}
            {activeTab === "products" && <CompanyProductsManager />}
            {activeTab === "orders" && <CompanyOrdersManager />}
            {activeTab === "appearance" && <StoreAppearanceEditor />}
            {activeTab === "settings" && <CompanySettings />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CompanyAdminDashboard;
