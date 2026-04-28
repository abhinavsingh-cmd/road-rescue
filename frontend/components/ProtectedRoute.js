import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import LoadingState from "@/components/LoadingState";

export default function ProtectedRoute({ children, roles = [] }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(router.asPath)}`);
      return;
    }

    if (roles.length > 0) {
      const userRole = user.role === "mechanic" ? "mechanic" : "customer";
      const isAllowed = roles.includes(userRole);
      
      if (!isAllowed) {
        router.replace(userRole === "mechanic" ? "/mechanic-dashboard" : "/customer-dashboard");
      }
    }
  }, [loading, roles, router, user]);

  if (loading || !user) {
    return <LoadingState title="Checking your session" message="Securing your Road Rescue workspace..." />;
  }

  if (roles.length > 0) {
    const userRole = user.role === "mechanic" ? "mechanic" : "customer";
    const isAllowed = roles.includes(userRole);
    
    if (!isAllowed) {
      return <LoadingState title="Redirecting" message="Sending you to the right dashboard..." />;
    }
  }

  return children;
}
