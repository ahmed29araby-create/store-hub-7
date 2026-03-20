import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart3, Building2, LayoutDashboard, Settings, LogOut, Bell, CreditCard, BellRing, Gift, MessageCircle } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const menuItems = [
  { id: "overview", title: "نظرة عامة", icon: LayoutDashboard },
  { id: "pending", title: "طلبات التسجيل", icon: Bell },
  { id: "organizations", title: "إدارة الشركات", icon: Building2 },
  { id: "subscriptions", title: "الاشتراكات", icon: CreditCard },
  { id: "offers", title: "العروض", icon: Gift },
  { id: "account", title: "إعدادات الحساب", icon: Settings },
  { id: "notifications", title: "الإشعارات", icon: BellRing },
  { id: "messages", title: "الرسائل", icon: MessageCircle },
];

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSignOut: () => void;
  displayName: string;
}

const SuperAdminSidebar = ({ activeTab, setActiveTab, onSignOut, displayName }: Props) => {
  const { state } = useSidebar();
  const { user } = useAuth();
  const collapsed = state === "collapsed";
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const { data: unreadNotifications = 0 } = useQuery({
    queryKey: ["unread-notifications-count", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count } = await supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("is_read", false);
      return count || 0;
    },
    enabled: !!user?.id,
    refetchInterval: 10000,
  });

  const { data: unreadMessages = 0 } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: async () => {
      const { count } = await supabase.from("chat_messages").select("*", { count: "exact", head: true }).eq("sender_type", "company").eq("is_read", false);
      return count || 0;
    },
    enabled: !!user?.id,
    refetchInterval: 10000,
  });

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveTab(item.id)}
                      className={activeTab === item.id ? "bg-accent text-accent-foreground font-medium" : ""}
                    >
                      <div className="relative">
                        <item.icon className="w-4 h-4" />
                        {item.id === "notifications" && unreadNotifications > 0 && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500" />
                        )}
                        {item.id === "messages" && unreadMessages > 0 && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500" />
                        )}
                      </div>
                      {!collapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-3 border-t border-border">
          {!collapsed && (
            <div className="mb-2 px-2">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground">مسؤول المنصة</p>
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
            <AlertDialogAction onClick={onSignOut} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">نعم، تسجيل الخروج</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SuperAdminSidebar;
