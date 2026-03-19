import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import CompanyAdminSidebar from "@/components/admin/CompanyAdminSidebar";
import CompanyProductsManager from "@/components/admin/CompanyProductsManager";
import CompanyOrdersManager from "@/components/admin/CompanyOrdersManager";
import CompanySettings from "@/components/admin/CompanySettings";
import DashboardOverview from "@/components/admin/DashboardOverview";
import StoreAppearanceEditor from "@/components/admin/StoreAppearanceEditor";
import CompanySubscription from "@/components/admin/CompanySubscription";
import CompanyNotifications from "@/components/admin/CompanyNotifications";
import SupportChat from "@/components/admin/SupportChat";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CreditCard } from "lucide-react";

const CompanyAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { profile, organization, signOut } = useAuth();

  const isSubscriptionActive = organization?.subscription_status === "active" &&
    organization?.subscription_end_date && new Date(organization.subscription_end_date) > new Date();

  // Pages that require active subscription
  const blockedTabs = ["overview", "products", "orders", "appearance", "settings"];
  const isBlocked = !isSubscriptionActive && blockedTabs.includes(activeTab);

  const tabTitles: Record<string, string> = {
    overview: "لوحة التحكم", products: "إدارة المنتجات", orders: "إدارة الطلبات",
    appearance: "تخصيص واجهة المتجر", subscription: "الاشتراكات", notifications: "الإشعارات",
    support: "الدعم الفني", settings: "الإعدادات",
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CompanyAdminSidebar
          activeTab={activeTab} setActiveTab={setActiveTab} onSignOut={signOut}
          displayName={profile?.display_name || "Admin"} orgName={organization?.name || ""}
          storeType={organization?.store_type} orgId={organization?.id}
        />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 bg-card">
            <SidebarTrigger className="ml-2" />
            <h1 className="text-lg font-semibold text-foreground mr-4">{tabTitles[activeTab] || ""}</h1>
          </header>
          <main className="flex-1 p-6 overflow-auto" dir="rtl">
            {isBlocked ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full">
                  <CardContent className="p-8 text-center space-y-4">
                    <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground" />
                    <h2 className="text-xl font-bold text-foreground">يجب تفعيل الاشتراك</h2>
                    <p className="text-muted-foreground">الصفحة مغلقة مؤقتاً. يرجى تجديد الاشتراك للمتابعة.</p>
                    <Button onClick={() => setActiveTab("subscription")} className="w-full">
                      <CreditCard className="w-4 h-4 ml-1" />الاشتراكات
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                {activeTab === "overview" && <DashboardOverview organizationId={organization?.id} />}
                {activeTab === "products" && <CompanyProductsManager />}
                {activeTab === "orders" && <CompanyOrdersManager />}
                {activeTab === "appearance" && <StoreAppearanceEditor />}
                {activeTab === "subscription" && <CompanySubscription />}
                {activeTab === "notifications" && <CompanyNotifications />}
                {activeTab === "support" && <SupportChat />}
                {activeTab === "settings" && <CompanySettings />}
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CompanyAdminDashboard;
