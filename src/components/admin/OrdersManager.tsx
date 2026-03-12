import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type OrderStatus = "pending" | "approved" | "shipped" | "delivered";

interface Order {
  id: number;
  customer: string;
  phone: string;
  address: string;
  items: string;
  total: number;
  status: OrderStatus;
  date: string;
}

const statusMap: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "قيد الانتظار", variant: "secondary" },
  approved: { label: "مؤكد", variant: "default" },
  shipped: { label: "تم الشحن", variant: "outline" },
  delivered: { label: "تم التوصيل", variant: "default" },
};

const statusOptions: OrderStatus[] = ["pending", "approved", "shipped", "delivered"];

const initialOrders: Order[] = [
  { id: 1001, customer: "أحمد محمد", phone: "01012345678", address: "المعادي، القاهرة", items: "جاكيت جلد x1", total: 1200, status: "pending", date: "2026-03-08" },
  { id: 1002, customer: "سارة علي", phone: "01198765432", address: "مدينة نصر، القاهرة", items: "فستان سهرة x1, حقيبة يد x1", total: 4300, status: "approved", date: "2026-03-07" },
  { id: 1003, customer: "محمد حسن", phone: "01234567890", address: "الإسكندرية", items: "عطر oud فاخر x2", total: 7000, status: "shipped", date: "2026-03-06" },
  { id: 1004, customer: "نورا كريم", phone: "01556789012", address: "الزمالك، القاهرة", items: "برجر واجيو x3", total: 540, status: "delivered", date: "2026-03-05" },
  { id: 1005, customer: "خالد أمين", phone: "01087654321", address: "المنصورة", items: "ساعة كلاسيكية x1", total: 4200, status: "pending", date: "2026-03-08" },
];

const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const { toast } = useToast();

  const updateStatus = (orderId: number, newStatus: OrderStatus) => {
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
    toast({ title: "تم التحديث", description: `تم تغيير حالة الطلب #${orderId}` });
  };

  const totalRevenue = orders.filter(o => o.status === "delivered").reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter(o => o.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
            <p className="text-2xl font-bold text-foreground">{orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">في الانتظار</p>
            <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">إيرادات مكتملة</p>
            <p className="text-2xl font-bold text-foreground">{totalRevenue.toLocaleString()} ج.م</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">#</TableHead>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right hidden md:table-cell">الهاتف</TableHead>
                <TableHead className="text-right hidden lg:table-cell">العنوان</TableHead>
                <TableHead className="text-right">المنتجات</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">تغيير الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-muted-foreground">{order.id}</TableCell>
                  <TableCell className="font-medium text-foreground">{order.customer}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{order.phone}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">{order.address}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">{order.items}</TableCell>
                  <TableCell className="font-medium">{order.total.toLocaleString()} ج.م</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[order.status].variant}>
                      {statusMap[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v as OrderStatus)}>
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(s => (
                          <SelectItem key={s} value={s}>{statusMap[s].label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersManager;
