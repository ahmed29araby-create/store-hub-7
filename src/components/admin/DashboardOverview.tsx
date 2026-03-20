import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Building2, ChevronDown, ChevronUp, Store } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const DATE_RANGES = [
  { label: "آخر يوم", value: "1" }, { label: "آخر يومين", value: "2" }, { label: "آخر 3 أيام", value: "3" },
  { label: "آخر 5 أيام", value: "5" }, { label: "آخر أسبوع", value: "7" }, { label: "آخر 15 يوم", value: "15" },
  { label: "آخر 20 يوم", value: "20" }, { label: "آخر شهر", value: "30" }, { label: "آخر 3 شهور", value: "90" },
  { label: "آخر 6 شهور", value: "180" }, { label: "آخر سنة", value: "365" },
];

const STORE_TYPE_LABELS: Record<string, string> = {
  clothing: "متجر ملابس", accessories: "إكسسوارات", restaurant: "مطاعم", pharmacy: "صيدليات",
  electronics: "إلكترونيات وتقنية", sports: "رياضة ولياقة", gifts: "هدايا ومناسبات",
  home_decor: "المنزل والديكور", supermarket: "سوبرماركت", kids_toys: "أطفال وألعاب", real_estate: "عقارات",
};

const PIE_COLORS = ["hsl(210, 90%, 55%)", "hsl(160, 70%, 45%)", "hsl(45, 90%, 55%)"];

interface DashboardOverviewProps { organizationId?: string; }

const DashboardOverview = ({ organizationId }: DashboardOverviewProps) => {
  const [daysRange, setDaysRange] = useState("30");
  const [expandedStoreType, setExpandedStoreType] = useState<string | null>(null);
  const { role } = useAuth();
  const isSuperAdmin = role === "super_admin" && !organizationId;

  const fromDate = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - parseInt(daysRange)); return d.toISOString();
  }, [daysRange]);

  // Fetch approved subscription requests for revenue (super admin)
  const { data: approvedRequests = [] } = useQuery({
    queryKey: ["dashboard-approved-requests", fromDate],
    queryFn: async () => {
      const { data, error } = await supabase.from("subscription_requests").select("*").eq("status", "approved").gte("reviewed_at", fromDate).order("reviewed_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: isSuperAdmin,
  });

  const { data: allOrganizations = [] } = useQuery({
    queryKey: ["all-organizations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("organizations").select("*").eq("approval_status", "approved").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: isSuperAdmin,
  });

  const { data: organizations = [] } = useQuery({
    queryKey: ["dashboard-organizations", fromDate],
    queryFn: async () => {
      const { data, error } = await supabase.from("organizations").select("*").eq("approval_status", "approved").gte("created_at", fromDate).order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: isSuperAdmin,
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["dashboard-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("display_name, email, organization_id");
      return data || [];
    },
    enabled: isSuperAdmin,
  });

  // Company admin queries
  const { data: orders = [] } = useQuery({
    queryKey: ["dashboard-orders", organizationId, fromDate],
    queryFn: async () => {
      let query = supabase.from("orders").select("*").gte("created_at", fromDate);
      if (organizationId) query = query.eq("organization_id", organizationId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!organizationId,
  });

  // Super Admin Calculations using approved requests
  const totalRevenue = useMemo(() => {
    return approvedRequests.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  }, [approvedRequests]);

  const totalNewCompanies = organizations.length;

  // Revenue chart by day from approved requests
  const revenueByDay = useMemo(() => {
    const days = parseInt(daysRange);
    const map = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      map.set(d.toLocaleDateString("ar-EG", { month: "short", day: "numeric" }), 0);
    }

    if (isSuperAdmin) {
      approvedRequests.forEach(req => {
        const d = new Date(req.reviewed_at || req.created_at);
        const key = d.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
        if (map.has(key)) map.set(key, (map.get(key) || 0) + Number(req.amount || 0));
      });
    } else {
      orders.forEach(order => {
        const d = new Date(order.created_at);
        const key = d.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
        if (map.has(key)) map.set(key, (map.get(key) || 0) + Number(order.total || 0));
      });
    }

    const entries = Array.from(map.entries());
    if (entries.length > 15) {
      const step = Math.ceil(entries.length / 15);
      return entries.filter((_, i) => i % step === 0 || i === entries.length - 1).map(([day, revenue]) => ({ day, revenue }));
    }
    return entries.map(([day, revenue]) => ({ day, revenue }));
  }, [isSuperAdmin, approvedRequests, orders, daysRange]);

  // Companies chart
  const companiesByDay = useMemo(() => {
    if (!isSuperAdmin) return [];
    const days = parseInt(daysRange);
    const map = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      map.set(d.toLocaleDateString("ar-EG", { month: "short", day: "numeric" }), 0);
    }
    organizations.forEach(org => {
      const d = new Date(org.created_at);
      const key = d.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
      if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
    });
    const entries = Array.from(map.entries());
    if (entries.length > 15) {
      const step = Math.ceil(entries.length / 15);
      return entries.filter((_, i) => i % step === 0 || i === entries.length - 1).map(([day, count]) => ({ day, count }));
    }
    return entries.map(([day, count]) => ({ day, count }));
  }, [isSuperAdmin, organizations, daysRange]);

  // Payment method pie chart
  const paymentMethodData = useMemo(() => {
    if (!isSuperAdmin) return [];
    const vodafone = approvedRequests.filter(r => r.payment_method === "vodafone_cash").length;
    const instapay = approvedRequests.filter(r => r.payment_method === "instapay").length;
    const free = allOrganizations.filter(o => (o as any).trial_end_date && !(o as any).subscription_package_id).length;
    return [
      { name: "Vodafone Cash", value: vodafone },
      { name: "InstaPay", value: instapay },
      { name: "مجاني", value: free },
    ].filter(d => d.value > 0);
  }, [isSuperAdmin, approvedRequests, allOrganizations]);

  // Store type analytics
  const storeTypeStats = useMemo(() => {
    const map = new Map<string, typeof allOrganizations>();
    allOrganizations.forEach(org => {
      const type = org.store_type;
      if (!map.has(type)) map.set(type, []);
      map.get(type)!.push(org);
    });
    return Array.from(map.entries()).map(([type, orgs]) => ({ type, label: STORE_TYPE_LABELS[type] || type, count: orgs.length, orgs })).sort((a, b) => b.count - a.count);
  }, [allOrganizations]);

  const totalStores = allOrganizations.length;
  const selectedLabel = DATE_RANGES.find(r => r.value === daysRange)?.label || "";
  const companyRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const getOrgProfile = (orgId: string) => profiles.find(p => p.organization_id === orgId);

  if (!isSuperAdmin) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">نظرة عامة</h2>
          <Select value={daysRange} onValueChange={setDaysRange}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>{DATE_RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">إجمالي الإيرادات</p><p className="text-2xl font-bold mt-1">{companyRevenue.toLocaleString("ar-EG")} ج.م</p><span className="text-xs text-muted-foreground">{selectedLabel}</span></div><div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10"><DollarSign className="w-6 h-6 text-primary" /></div></div></CardContent></Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">الإيرادات ({selectedLabel})</CardTitle></CardHeader>
          <CardContent>
            {revenueByDay.some(d => d.revenue > 0) ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} formatter={(v: number) => [`${v.toLocaleString("ar-EG")} ج.م`, "الإيرادات"]} />
                  <Bar dataKey="revenue" fill="hsl(210, 90%, 55%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-[280px] flex items-center justify-center text-muted-foreground">لا توجد بيانات</div>}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Super Admin
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">نظرة عامة</h2>
        <Select value={daysRange} onValueChange={setDaysRange}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>{DATE_RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">إجمالي الإيرادات</p><p className="text-2xl font-bold mt-1">{totalRevenue.toLocaleString("ar-EG")} ج.م</p><span className="text-xs text-muted-foreground">{selectedLabel}</span></div><div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10"><DollarSign className="w-6 h-6 text-primary" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">إجمالي الشركات الجديدة</p><p className="text-2xl font-bold mt-1">{totalNewCompanies}</p><span className="text-xs text-muted-foreground">{selectedLabel}</span></div><div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "hsl(160, 70%, 45%, 0.12)" }}><Building2 className="w-6 h-6" style={{ color: "hsl(160, 70%, 45%)" }} /></div></div></CardContent></Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">الإيرادات ({selectedLabel})</CardTitle></CardHeader>
          <CardContent>
            {revenueByDay.some(d => d.revenue > 0) ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} formatter={(v: number) => [`${v.toLocaleString("ar-EG")} ج.م`, "الإيرادات"]} />
                  <Bar dataKey="revenue" fill="hsl(210, 90%, 55%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-[280px] flex items-center justify-center text-muted-foreground">لا توجد إيرادات في هذه الفترة</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">حالة طلبات إنشاء الشركات ({selectedLabel})</CardTitle></CardHeader>
          <CardContent>
            {companiesByDay.some(d => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={companiesByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} formatter={(v: number) => [`${v}`, "شركات جديدة"]} />
                  <Bar dataKey="count" fill="hsl(160, 70%, 45%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-[280px] flex items-center justify-center text-muted-foreground">لا توجد شركات جديدة</div>}
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Pie Chart */}
      {paymentMethodData.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">طريقة الدفع ({selectedLabel})</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={paymentMethodData} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {paymentMethodData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Most Used Store Types */}
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Store className="w-5 h-5" />المواقع الأكثر استخداماً</CardTitle></CardHeader>
        <CardContent>
          {storeTypeStats.length > 0 ? (
            <div className="space-y-3">
              {storeTypeStats.map((item, i) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors" onClick={() => setExpandedStoreType(expandedStoreType === item.type ? null : item.type)}>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-primary">{i + 1}</span>
                      <span className="font-medium text-foreground">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${(item.count / (storeTypeStats[0]?.count || 1)) * 100}%` }} /></div>
                      <span className="text-sm text-muted-foreground w-16 text-left">{item.count} شركة</span>
                      {expandedStoreType === item.type ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>
                  {expandedStoreType === item.type && (
                    <div className="mr-11 mt-2 mb-3 space-y-2">
                      {item.orgs.map(org => {
                        const orgProfile = getOrgProfile(org.id);
                        return (
                          <div key={org.id} className="p-3 rounded-lg border border-border bg-card/50 text-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-foreground">{org.name}</p>
                                <p className="text-muted-foreground text-xs">{org.email}</p>
                                {orgProfile && <p className="text-muted-foreground text-xs">المسؤول: {orgProfile.display_name}</p>}
                              </div>
                              <div className="text-left">
                                {(org as any).subscription_end_date && <p className="text-xs text-muted-foreground">ينتهي: {new Date((org as any).subscription_end_date).toLocaleDateString("ar-EG")}</p>}
                                <p className="text-xs text-muted-foreground">اشترك: {new Date(org.created_at).toLocaleDateString("ar-EG")}</p>
                                {(org as any).subscription_price > 0 && <p className="text-xs font-medium text-primary">{Number((org as any).subscription_price).toLocaleString("ar-EG")} ج.م</p>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : <div className="py-8 text-center text-muted-foreground">لا توجد شركات مسجلة بعد</div>}
        </CardContent>
      </Card>

      {/* All Store Types */}
      <Card>
        <CardHeader><CardTitle className="text-lg">جميع أقسام المواقع</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Object.entries(STORE_TYPE_LABELS).map(([type, label]) => {
              const count = storeTypeStats.find(s => s.type === type)?.count || 0;
              return (
                <div key={type} className="p-4 rounded-xl border border-border bg-card hover:bg-accent/30 cursor-pointer transition-colors text-center" onClick={() => setExpandedStoreType(expandedStoreType === type ? null : type)}>
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-2xl font-bold text-primary mt-1">{count}</p>
                  <p className="text-xs text-muted-foreground">شركة</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-muted/50 flex justify-between items-center">
            <span className="font-semibold text-foreground">إجمالي المواقع المستخدمة</span>
            <span className="text-2xl font-bold text-primary">{totalStores}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
