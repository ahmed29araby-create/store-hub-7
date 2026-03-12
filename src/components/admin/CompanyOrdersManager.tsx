import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const statusLabels: Record<string, string> = {
  pending: "معلق",
  approved: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  approved: "default",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
};

const CompanyOrdersManager = () => {
  const { organization } = useAuth();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["company-orders", organization?.id],
    queryFn: async () => {
      if (!organization) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("organization_id", organization.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!organization,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم تحديث حالة الطلب");
      queryClient.invalidateQueries({ queryKey: ["company-orders"] });
    },
  });

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>;

  if (orders.length === 0) return <div className="text-center py-12 text-muted-foreground">لا توجد طلبات بعد</div>;

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">العميل</TableHead>
            <TableHead className="text-right">الهاتف</TableHead>
            <TableHead className="text-right">المجموع</TableHead>
            <TableHead className="text-right">التاريخ</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.customer_name}</TableCell>
              <TableCell>{order.customer_phone || "-"}</TableCell>
              <TableCell>{order.total} ج.م</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleDateString("ar-EG")}</TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  onValueChange={(value) => updateStatus.mutate({ id: order.id, status: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue>
                      <Badge variant={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyOrdersManager;
