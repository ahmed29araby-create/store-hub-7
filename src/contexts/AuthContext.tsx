import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  role: "super_admin" | "admin" | "moderator" | "customer" | null;
  profile: { display_name: string; email: string; organization_id: string | null } | null;
  organization: { id: string; name: string; store_type: string; is_active: boolean; approval_status?: string; trial_end_date?: string | null } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AuthContextType["role"]>(null);
  const [profile, setProfile] = useState<AuthContextType["profile"]>(null);
  const [organization, setOrganization] = useState<AuthContextType["organization"]>(null);
  const [loading, setLoading] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);

  const fetchUserData = async (userId: string) => {
    // Fetch role - use maybeSingle to avoid 406 error
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    // Fetch profile - use maybeSingle to avoid 406 error
    const { data: profileData } = await supabase
      .from("profiles")
      .select("display_name, email, organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (roleData) {
      setRole(roleData.role as AuthContextType["role"]);
    } else {
      // No role means customer
      setRole("customer");
    }

    if (profileData) {
      setProfile(profileData);
      if (profileData.organization_id) {
        const { data: orgData } = await supabase
          .from("organizations")
          .select("id, name, store_type, is_active, approval_status, trial_end_date")
          .eq("id", profileData.organization_id)
          .maybeSingle();
        if (orgData) setOrganization(orgData as any);
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        fetchUserData(session.user.id).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setUser(null);
        setRole(null);
        setProfile(null);
        setOrganization(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        fetchUserData(session.user.id).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (lockUntil && Date.now() < lockUntil) {
      const seconds = Math.ceil((lockUntil - Date.now()) / 1000);
      return { error: `الحساب مقفل. حاول بعد ${seconds} ثانية` };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockUntil(Date.now() + 60000);
        setFailedAttempts(0);
        return { error: "تم قفل الحساب لمدة 60 ثانية بسبب محاولات فاشلة متعددة" };
      }
      return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
    }
    setFailedAttempts(0);
    setLockUntil(null);
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.id);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setUser(session.user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, profile, organization, loading, signIn, signOut, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
