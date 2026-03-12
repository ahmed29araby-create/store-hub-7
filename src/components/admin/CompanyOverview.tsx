import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

const CompanyOverview = () => {
  const { organization } = useAuth();

  const { data: products = [] } = useQuery({
    queryKey: ["company-products", organization?.id],
    queryFn: async () => {
      if (!organization) return [];
      const { data } = await supabase.from("products").select("*").eq("organization_id", organization.id);
      return data || [];
    },
    enabled: !!organization,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["company-orders", organization?.id],
    queryFn: async () => {
      if (!organization) return [];
      const { data } = await supabase.from("orders").select("*").eq("organization_id", organization.id);
      return data || [];
    },
    enabled: !!organization,
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;

  const stats = [
    { title: "إجمالي المنتجات", value: products.length.toString(), icon: Package },
    { title: "إجمالي الطلبات", value: orders.length.toString(), icon: ShoppingCart },
    { title: "طلبات معلقة", value: pendingOrders.toString(), icon: TrendingUp },
    { title: "إجمالي الإيرادات", value: `${totalRevenue.toLocaleString()} ج.م`, icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompanyOverview;
