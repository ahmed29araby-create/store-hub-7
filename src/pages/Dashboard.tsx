import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import SuperAdminDashboard from "@/pages/admin/SuperAdminDashboard";
import CompanyAdminDashboard from "@/pages/admin/CompanyAdminDashboard";

const Dashboard = () => {
  const { user, role, loading, organization } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Check if organization is pending approval
  if (role === "admin" && organization && organization.approval_status === "pending") {
    return <OrgPendingScreen />;
  }

  // Check if organization is disabled
  if (role === "admin" && organization && !organization.is_active) {
    return <OrgDisabledScreen />;
  }

  if (role === "super_admin") return <SuperAdminDashboard />;
  if (role === "admin") return <CompanyAdminDashboard />;

  return <Navigate to="/login" replace />;
};

const OrgDisabledScreen = () => {
  const { signOut } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
      <div className="text-center space-y-4 max-w-md p-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-3xl">🚫</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">الحساب معطّل</h1>
        <p className="text-muted-foreground">تم تعطيل حساب شركتك. تواصل مع إدارة المنصة لمزيد من المعلومات.</p>
        <button
          onClick={signOut}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

const OrgPendingScreen = () => {
  const { signOut } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
      <div className="text-center space-y-4 max-w-md p-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
          <span className="text-3xl">⏳</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">حسابك قيد المراجعة</h1>
        <p className="text-muted-foreground">تم استلام طلبك بنجاح وهو قيد المراجعة من قبل إدارة المنصة. سيتم تفعيل متجرك بعد الموافقة.</p>
        <button
          onClick={signOut}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
