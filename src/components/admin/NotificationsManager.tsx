import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BellRing, Check, Eye } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_id: string | null;
  created_at: string;
}

const NotificationsManager = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["super-admin-notifications", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user?.id,
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-notifications"] });
    },
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-notifications"] });
      toast.success("تم تحديد الكل كمقروء");
    },
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto" dir="rtl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">الإشعارات</h2>
        <p className="text-muted-foreground mt-1">جميع الإشعارات والتنبيهات</p>
      </div>

      {unreadCount > 0 && (
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()}>
            <Check className="w-4 h-4 ml-1" /> تحديد الكل كمقروء
          </Button>
          <Badge variant="destructive">{unreadCount} غير مقروء</Badge>
        </div>
      )}

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BellRing className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">لا توجد إشعارات</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`transition-colors ${!notif.is_read ? "border-primary/50 bg-primary/5" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-2">
                    {!notif.is_read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => markAsRead.mutate(notif.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 text-right space-y-1">
                    <div className="flex items-center gap-2 justify-end">
                      {!notif.is_read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      <p className="font-semibold">{notif.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{notif.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notif.created_at).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsManager;
