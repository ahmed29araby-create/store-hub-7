import { useState } from "react";
import { Package, ShoppingCart, LayoutDashboard, Settings, LogOut, ExternalLink, Palette, CreditCard } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const menuItems = [
  { id: "overview", title: "نظرة عامة", icon: LayoutDashboard },
  { id: "products", title: "المنتجات", icon: Package },
  { id: "orders", title: "الطلبات", icon: ShoppingCart },
  { id: "appearance", title: "تخصيص الواجهة", icon: Palette },
  { id: "subscription", title: "الاشتراكات", icon: CreditCard },
  { id: "settings", title: "الإعدادات", icon: Settings },
];

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSignOut: () => void;
  displayName: string;
  orgName: string;
  storeType?: string;
  orgId?: string;
}

const CompanyAdminSidebar = ({ activeTab, setActiveTab, onSignOut, displayName, orgName, storeType, orgId }: Props) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleViewStore = () => {
    if (storeType && orgId) {
      window.open(`/store/${storeType}/${orgId}`, "_blank");
    }
  };

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 px-3 py-4">
              <Package className="w-5 h-5 text-primary" />
              {!collapsed && <span className="font-bold text-base truncate">{orgName || "متجري"}</span>}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveTab(item.id)}
                      className={activeTab === item.id ? "bg-accent text-accent-foreground font-medium" : ""}
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleViewStore}
                    className="text-primary hover:bg-primary/10"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {!collapsed && <span>مشاهدة الموقع</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-3 border-t border-border">
          {!collapsed && (
            <div className="mb-2 px-2">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground">مسؤول الشركة</p>
            </div>
          )}
          <SidebarMenuButton onClick={() => setShowLogoutDialog(true)} className="text-destructive hover:bg-destructive/10">
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>تسجيل الخروج</span>}
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد تسجيل الخروج</AlertDialogTitle>
            <AlertDialogDescription>هل تريد تسجيل الخروج من حسابك؟</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={onSignOut} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              نعم، تسجيل الخروج
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CompanyAdminSidebar;
