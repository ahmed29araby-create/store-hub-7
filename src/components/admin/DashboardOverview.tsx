import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const DATE_RANGES = [
  { label: "آخر يوم", value: "1" },
  { label: "آخر يومين", value: "2" },
  { label: "آخر 3 أيام", value: "3" },
  { label: "آخر 4 أيام", value: "4" },
  { label: "آخر 5 أيام", value: "5" },
  { label: "آخر أسبوع", value: "7" },
  { label: "آخر 15 يوم", value: "15" },
  { label: "آخر 20 يوم", value: "20" },
  { label: "آخر شهر", value: "30" },
  { label: "آخر 3 شهور", value: "90" },
  { label: "آخر 6 شهور", value: "180" },
  { label: "آخر سنة", value: "365" },
];

const CHART_COLORS = [
  "hsl(210, 90%, 55%)",   // Blue
  "hsl(190, 80%, 50%)",   // Cyan
  "hsl(160, 70%, 45%)",   // Teal
  "hsl(250, 70%, 60%)",   // Purple
  "hsl(30, 85%, 55%)",    // Orange
];

interface DashboardOverviewProps {
  organizationId?: string; // if provided, filter by this org; otherwise show all (super admin)
}

const BEST_SELLERS_LIMITS = [
  { label: "أكثر 5 منتجات", value: 5 },
  { label: "أكثر 10 منتجات", value: 10 },
  { label: "أكثر 20 منتج", value: 20 },
];

const DashboardOverview = ({ organizationId }: DashboardOverviewProps) => {
  const [daysRange, setDaysRange] = useState("30");
  const [bestSellersLimit, setBestSellersLimit] = useState(5);
  const { role } = useAuth();
  const isSuperAdmin = role === "super_admin";

  const fromDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - parseInt(daysRange));
    return d.toISOString();
  }, [daysRange]);

  // Fetch orders
  const { data: orders = [] } = useQuery({
    queryKey: ["dashboard-orders", organizationId, fromDate],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select("*")
        .gte("created_at", fromDate);
      if (organizationId) {
        query = query.eq("organization_id", organizationId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch products (for count)
  const { data: products = [] } = useQuery({
    queryKey: ["dashboard-products", organizationId],
    queryFn: async () => {
      let query = supabase.from("products").select("id, name, organization_id");
      if (organizationId) {
        query = query.eq("organization_id", organizationId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate stats
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const totalProducts = products.length;

  const stats = [
    { title: "إجمالي الإيرادات", value: `${totalRevenue.toLocaleString("ar-EG")} ج.م`, icon: DollarSign },
    { title: "إجمالي الطلبات", value: totalOrders.toString(), icon: ShoppingCart },
    { title: "المنتجات", value: totalProducts.toString(), icon: Package },
    { title: "طلبات معلقة", value: pendingOrders.toString(), icon: TrendingUp },
  ];

  // Build daily revenue chart data
  const revenueByDay = useMemo(() => {
    const days = parseInt(daysRange);
    const map = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
      map.set(key, 0);
    }
    orders.forEach(order => {
      const d = new Date(order.created_at);
      const key = d.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
      if (map.has(key)) {
        map.set(key, (map.get(key) || 0) + Number(order.total || 0));
      }
    });
    // If too many days, sample every Nth
    const entries = Array.from(map.entries());
    if (entries.length > 15) {
      const step = Math.ceil(entries.length / 15);
      return entries.filter((_, i) => i % step === 0 || i === entries.length - 1).map(([day, revenue]) => ({ day, revenue }));
    }
    return entries.map(([day, revenue]) => ({ day, revenue }));
  }, [orders, daysRange]);

  // Best sellers from order items
  const bestSellers = useMemo(() => {
    const salesMap = new Map<string, { name: string; count: number; productId?: string }>();
    orders.forEach(order => {
      const items = order.items as any[];
      if (Array.isArray(items)) {
        items.forEach(item => {
          const name = item.name || item.product_name || "منتج";
          const qty = item.quantity || item.qty || 1;
          const productId = item.product_id || item.id;
          const existing = salesMap.get(name);
          if (existing) {
            existing.count += qty;
          } else {
            salesMap.set(name, { name, count: qty, productId });
          }
        });
      }
    });
    return Array.from(salesMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, bestSellersLimit);
  }, [orders, bestSellersLimit]);

  // Orders by status for pie chart
  const statusData = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach(o => {
      const status = o.status || "pending";
      map.set(status, (map.get(status) || 0) + 1);
    });
    const statusLabels: Record<string, string> = {
      pending: "قيد الانتظار",
      processing: "قيد التنفيذ",
      completed: "مكتمل",
      cancelled: "ملغي",
      delivered: "تم التوصيل",
    };
    return Array.from(map.entries()).map(([status, value]) => ({
      name: statusLabels[status] || status,
      value,
    }));
  }, [orders]);

  const selectedLabel = DATE_RANGES.find(r => r.value === daysRange)?.label || "";

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">نظرة عامة</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">الفترة:</span>
          <Select value={daysRange} onValueChange={setDaysRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="اختر الفترة" />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGES.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <span className="text-xs text-muted-foreground">{selectedLabel}</span>
                </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "hsl(210, 90%, 55%, 0.12)" }}>
                  <stat.icon className="w-6 h-6" style={{ color: "hsl(210, 90%, 55%)" }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">الإيرادات ({selectedLabel})</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number) => [`${value.toLocaleString("ar-EG")} ج.م`, "الإيرادات"]}
                  />
                  <Bar dataKey="revenue" fill="hsl(210, 90%, 55%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                لا توجد بيانات في هذه الفترة
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">حالة الطلبات</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                لا توجد طلبات في هذه الفترة
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Best Sellers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">الأكثر مبيعًا</CardTitle>
          <Select value={bestSellersLimit.toString()} onValueChange={(v) => setBestSellersLimit(Number(v))}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BEST_SELLERS_LIMITS.map(opt => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {bestSellers.length > 0 ? (
            <div className="space-y-4">
              {bestSellers.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between group cursor-pointer hover:bg-accent/50 rounded-lg p-2 -m-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.count / bestSellers[0].count) * 100}%`,
                          backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-left">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              لا توجد مبيعات في هذه الفترة
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
