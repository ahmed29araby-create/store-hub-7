import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import SuperAdminSidebar from "@/components/admin/SuperAdminSidebar";
import DashboardOverview from "@/components/admin/DashboardOverview";
import OrganizationsManager from "@/components/admin/OrganizationsManager";
import AccountSettings from "@/components/admin/AccountSettings";
import PendingRegistrations from "@/components/admin/PendingRegistrations";
import SubscriptionsManager from "@/components/admin/SubscriptionsManager";
import NotificationsManager from "@/components/admin/NotificationsManager";

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { profile, signOut } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SuperAdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onSignOut={signOut} displayName={profile?.display_name || "Super Admin"} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 bg-card">
            <SidebarTrigger className="ml-2" />
            <h1 className="text-lg font-semibold text-foreground mr-4">
              {activeTab === "overview" && "لوحة التحكم"}
              {activeTab === "pending" && "طلبات التسجيل"}
              {activeTab === "organizations" && "إدارة الشركات"}
              {activeTab === "subscriptions" && "الاشتراكات"}
              {activeTab === "account" && "إعدادات الحساب"}
              {activeTab === "notifications" && "الإشعارات"}
            </h1>
          </header>
          <main className="flex-1 p-6 overflow-auto" dir="rtl">
            {activeTab === "overview" && <DashboardOverview />}
            {activeTab === "pending" && <PendingRegistrations />}
            {activeTab === "organizations" && <OrganizationsManager />}
            {activeTab === "subscriptions" && <SubscriptionsManager />}
            {activeTab === "account" && <AccountSettings />}
            {activeTab === "notifications" && <NotificationsManager />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SuperAdminDashboard;
