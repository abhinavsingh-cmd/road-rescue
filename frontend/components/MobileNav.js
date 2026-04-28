import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function MobileNav() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const links = [
    { label: "Home", href: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { label: "Dispatch", href: "/booking", icon: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Hub", href: user.role === 'mechanic' ? '/mechanic-dashboard' : '/customer-dashboard', icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
    { label: "Profile", href: "/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 lg:hidden">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-auto flex h-16 max-w-md items-center justify-around rounded-[24px] border border-white/5 bg-black/80 px-2 backdrop-blur-2xl shadow-2xl shadow-primary/10"
      >
        {links.map((link) => {
          const isActive = router.pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className="relative flex flex-col items-center justify-center py-1 flex-1">
              <svg 
                className={`h-6 w-6 transition-all duration-300 ${isActive ? "text-primary" : "text-white/30"}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 1.5} d={link.icon} />
              </svg>
              <span className={`mt-1 text-[8px] font-black uppercase tracking-widest transition-all ${isActive ? "text-primary opacity-100" : "text-white/20 opacity-0"}`}>
                {link.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -top-1 h-1 w-8 rounded-full bg-primary shadow-[0_0_10px_rgba(250,255,93,0.5)]"
                />
              )}
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
