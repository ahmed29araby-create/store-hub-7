import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Building2, ChevronDown, ChevronUp, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DATE_RANGES = [
  { label: "آخر يوم", value: "1" },
  { label: "آخر يومين", value: "2" },
  { label: "آخر 3 أيام", value: "3" },
  { label: "آخر 5 أيام", value: "5" },
  { label: "آخر أسبوع", value: "7" },
  { label: "آخر 15 يوم", value: "15" },
  { label: "آخر 20 يوم", value: "20" },
  { label: "آخر شهر", value: "30" },
  { label: "آخر 3 شهور", value: "90" },
  { label: "آخر 6 شهور", value: "180" },
  { label: "آخر سنة", value: "365" },
];

const STORE_TYPE_LABELS: Record<string, string> = {
  clothing: "متجر ملابس",
  accessories: "إكسسوارات",
  restaurant: "مطاعم",
  pharmacy: "صيدليات",
  electronics: "إلكترونيات وتقنية",
  sports: "رياضة ولياقة",
  gifts: "هدايا ومناسبات",
  home_decor: "المنزل والديكور",
  supermarket: "سوبرماركت",
  kids_toys: "أطفال وألعاب",
  real_estate: "عقارات",
};

interface DashboardOverviewProps {
  organizationId?: string;
}

const DashboardOverview = ({ organizationId }: DashboardOverviewProps) => {
  const [daysRange, setDaysRange] = useState("30");
  const [expandedStoreType, setExpandedStoreType] = useState<string | null>(null);
  const { role } = useAuth();
  const isSuperAdmin = role === "super_admin" && !organizationId;

  const fromDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - parseInt(daysRange));
    return d.toISOString();
  }, [daysRange]);

  // Fetch all organizations (for super admin)
  const { data: organizations = [] } = useQuery({
    queryKey: ["dashboard-organizations", fromDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("approval_status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: isSuperAdmin,
  });

  // All organizations for store type analytics (not filtered by date)
  const { data: allOrganizations = [] } = useQuery({
    queryKey: ["all-organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("approval_status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: isSuperAdmin,
  });

  // Fetch profiles for company details
  const { data: profiles = [] } = useQuery({
    queryKey: ["dashboard-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, email, organization_id");
      if (error) throw error;
      return data || [];
    },
    enabled: isSuperAdmin,
  });

  // --- Company admin: orders-based dashboard ---
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

  const { data: products = [] } = useQuery({
    queryKey: ["dashboard-products", organizationId],
    queryFn: async () => {
      let query = supabase.from("products").select("id, name, organization_id");
      if (organizationId) query = query.eq("organization_id", organizationId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!organizationId,
  });

  // --- Super Admin Calculations ---
  const orgsInPeriod = useMemo(() => {
    return organizations.filter(o => new Date(o.created_at) >= new Date(fromDate));
  }, [organizations, fromDate]);

  const totalRevenue = useMemo(() => {
    return orgsInPeriod.reduce((sum, o) => sum + Number((o as any).subscription_price || 0), 0);
  }, [orgsInPeriod]);

  const totalNewCompanies = orgsInPeriod.length;

  // Revenue chart by day (super admin)
  const revenueByDay = useMemo(() => {
    const days = parseInt(daysRange);
    const map = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
      map.set(key, 0);
    }
    
    if (isSuperAdmin) {
      orgsInPeriod.forEach(org => {
        const d = new Date(org.created_at);
        const key = d.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
        if (map.has(key)) {
          map.set(key, (map.get(key) || 0) + Number((org as any).subscription_price || 0));
        }
      });
    } else {
      orders.forEach(order => {
        const d = new Date(order.created_at);
        const key = d.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
        if (map.has(key)) {
          map.set(key, (map.get(key) || 0) + Number(order.total || 0));
        }
      });
    }

    const entries = Array.from(map.entries());
    if (entries.length > 15) {
      const step = Math.ceil(entries.length / 15);
      return entries.filter((_, i) => i % step === 0 || i === entries.length - 1).map(([day, revenue]) => ({ day, revenue }));
    }
    return entries.map(([day, revenue]) => ({ day, revenue }));
  }, [isSuperAdmin, orgsInPeriod, orders, daysRange]);

  // Companies chart by day (super admin)
  const companiesByDay = useMemo(() => {
    if (!isSuperAdmin) return [];
    const days = parseInt(daysRange);
    const map = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
      map.set(key, 0);
    }
    orgsInPeriod.forEach(org => {
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
  }, [isSuperAdmin, orgsInPeriod, daysRange]);

  // Store type analytics
  const storeTypeStats = useMemo(() => {
    const map = new Map<string, typeof allOrganizations>();
    allOrganizations.forEach(org => {
      const type = org.store_type;
      if (!map.has(type)) map.set(type, []);
      map.get(type)!.push(org);
    });
    return Array.from(map.entries())
      .map(([type, orgs]) => ({ type, label: STORE_TYPE_LABELS[type] || type, count: orgs.length, orgs }))
      .sort((a, b) => b.count - a.count);
  }, [allOrganizations]);

  const totalStores = allOrganizations.length;

  const selectedLabel = DATE_RANGES.find(r => r.value === daysRange)?.label || "";

  // Company admin stats
  const companyRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  const getOrgProfile = (orgId: string) => {
    return profiles.find(p => p.organization_id === orgId);
  };

  // --- RENDER ---
  if (!isSuperAdmin) {
    // Company admin dashboard (simplified)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">نظرة عامة</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">الفترة:</span>
            <Select value={daysRange} onValueChange={setDaysRange}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="اختر الفترة" /></SelectTrigger>
              <SelectContent>{DATE_RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">إجمالي الإيرادات</p><p className="text-2xl font-bold text-foreground mt-1">{companyRevenue.toLocaleString("ar-EG")} ج.م</p><span className="text-xs text-muted-foreground">{selectedLabel}</span></div><div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10"><DollarSign className="w-6 h-6 text-primary" /></div></div></CardContent></Card>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-lg">الإيرادات ({selectedLabel})</CardTitle></CardHeader>
          <CardContent>
            {revenueByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} formatter={(value: number) => [`${value.toLocaleString("ar-EG")} ج.م`, "الإيرادات"]} />
                  <Bar dataKey="revenue" fill="hsl(210, 90%, 55%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-[280px] flex items-center justify-center text-muted-foreground">لا توجد بيانات في هذه الفترة</div>}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Super Admin Dashboard
  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">نظرة عامة</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">الفترة:</span>
          <Select value={daysRange} onValueChange={setDaysRange}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="اختر الفترة" /></SelectTrigger>
            <SelectContent>{DATE_RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalRevenue.toLocaleString("ar-EG")} ج.م</p>
                <span className="text-xs text-muted-foreground">{selectedLabel}</span>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الشركات الجديدة</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalNewCompanies}</p>
                <span className="text-xs text-muted-foreground">{selectedLabel}</span>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "hsl(160, 70%, 45%, 0.12)" }}>
                <Building2 className="w-6 h-6" style={{ color: "hsl(160, 70%, 45%)" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader><CardTitle className="text-lg">الإيرادات ({selectedLabel})</CardTitle></CardHeader>
          <CardContent>
            {revenueByDay.some(d => d.revenue > 0) ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} formatter={(value: number) => [`${value.toLocaleString("ar-EG")} ج.م`, "الإيرادات"]} />
                  <Bar dataKey="revenue" fill="hsl(210, 90%, 55%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-[280px] flex items-center justify-center text-muted-foreground">لا توجد إيرادات في هذه الفترة</div>}
          </CardContent>
        </Card>

        {/* New Companies Chart */}
        <Card>
          <CardHeader><CardTitle className="text-lg">حالة طلبات إنشاء الشركات ({selectedLabel})</CardTitle></CardHeader>
          <CardContent>
            {companiesByDay.some(d => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={companiesByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} formatter={(value: number) => [`${value}`, "شركات جديدة"]} />
                  <Bar dataKey="count" fill="hsl(160, 70%, 45%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-[280px] flex items-center justify-center text-muted-foreground">لا توجد شركات جديدة في هذه الفترة</div>}
          </CardContent>
        </Card>
      </div>

      {/* Most Used Store Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Store className="w-5 h-5" />
            المواقع الأكثر استخداماً
          </CardTitle>
        </CardHeader>
        <CardContent>
          {storeTypeStats.length > 0 ? (
            <div className="space-y-3">
              {storeTypeStats.map((item, i) => (
                <div key={item.type}>
                  <div
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => setExpandedStoreType(expandedStoreType === item.type ? null : item.type)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-primary">
                        {i + 1}
                      </span>
                      <span className="font-medium text-foreground">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${(item.count / (storeTypeStats[0]?.count || 1)) * 100}%` }} />
                      </div>
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
                                {org.trial_end_date && (
                                  <p className="text-xs text-muted-foreground">
                                    ينتهي: {new Date(org.trial_end_date).toLocaleDateString("ar-EG")}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  اشترك: {new Date(org.created_at).toLocaleDateString("ar-EG")}
                                </p>
                                {(org as any).subscription_price > 0 && (
                                  <p className="text-xs font-medium text-primary">{Number((org as any).subscription_price).toLocaleString("ar-EG")} ج.م</p>
                                )}
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
          ) : (
            <div className="py-8 text-center text-muted-foreground">لا توجد شركات مسجلة بعد</div>
          )}
        </CardContent>
      </Card>

      {/* All Store Types Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">جميع أقسام المواقع</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Object.entries(STORE_TYPE_LABELS).map(([type, label]) => {
              const count = storeTypeStats.find(s => s.type === type)?.count || 0;
              return (
                <div
                  key={type}
                  className="p-4 rounded-xl border border-border bg-card hover:bg-accent/30 cursor-pointer transition-colors text-center"
                  onClick={() => setExpandedStoreType(expandedStoreType === type ? null : type)}
                >
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
