import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PageMotion, hoverLift, tapReaction } from "@/components/Motion";
import MobileNav from "@/components/MobileNav";

const navLinks = [
  { href: "/", label: "Network" },
  { href: "/booking", label: "Dispatch" },
  { href: "/support", label: "Concierge" }
];

export default function MainLayout({ children, title = "Road Rescue" }) {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{title} | Elite Mobility Support</title>
        <meta name="description" content="World-class roadside rescue network for luxury vehicles." />
      </Head>

      <PageMotion className="relative min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-black">
        {/* Global Ambient System */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="ambient-orb top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5" />
          <div className="ambient-orb bottom-[-10%] left-[-20%] w-[50%] h-[50%] bg-blue-500/5" />
        </div>

        <header className="fixed top-0 left-0 right-0 z-50 p-6 sm:p-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="glass-card flex items-center justify-between rounded-[32px] px-8 py-4 backdrop-blur-[50px] border-white/[0.08]"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href="/" className="group flex items-center gap-4">
                <motion.div 
                  whileHover={{ rotateY: 180 }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-black shadow-[0_0_30px_rgba(250,255,93,0.3)] transition-transform duration-700"
                >
                  <span className="text-2xl font-black italic tracking-tighter">R</span>
                </motion.div>
                <div className="hidden sm:block">
                  <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-white">Road Rescue</p>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em]">Elite Tier</p>
                </div>
              </Link>

              <nav className="hidden items-center gap-2 lg:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      "rounded-full px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500",
                      router.pathname === link.href ? "bg-white/10 text-white shadow-xl" : "text-white/30 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-6">
                {isAuthenticated ? (
                  <div className="flex items-center gap-6">
                    <Link href="/profile" className="hidden items-center gap-4 rounded-full bg-white/5 py-1.5 pl-1.5 pr-6 border border-white/[0.08] sm:flex group hover:bg-white/[0.08] transition-all duration-500">
                      <div className="h-9 w-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black shadow-lg">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white/80 tracking-wide leading-none">Hi, {user.name?.split(" ")[0]}</span>
                        <span className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">Active</span>
                      </div>
                    </Link>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={tapReaction}
                      onClick={logout} 
                      className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500/40 hover:text-red-500 transition-colors"
                    >
                      Exit
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 sm:gap-6">
                    <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">
                      Log In
                    </Link>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={tapReaction}>
                      <Link href="/signup" className="btn-primary !px-8 !py-4 !rounded-2xl">
                        Join
                      </Link>
                    </motion.div>
                  </div>
                )}

                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white lg:hidden border border-white/[0.05]"
                >
                  <div className="flex flex-col gap-1.5">
                    <motion.span animate={menuOpen ? { rotate: 45, y: 7 } : {}} className="h-[2px] w-5 bg-white rounded-full" />
                    <motion.span animate={menuOpen ? { opacity: 0 } : {}} className="h-[2px] w-5 bg-white rounded-full" />
                    <motion.span animate={menuOpen ? { rotate: -45, y: -7 } : {}} className="h-[2px] w-5 bg-white rounded-full" />
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  className="mt-6 overflow-hidden rounded-[40px] border border-white/[0.08] bg-black/90 p-6 backdrop-blur-[60px] lg:hidden shadow-2xl"
                >
                  <div className="grid gap-3">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex h-16 items-center justify-center rounded-3xl bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.4em] text-white border border-white/[0.05]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main className="relative z-10 pt-32 lg:pt-40 pb-32">{children}</main>

        <MobileNav />

        <footer className="relative z-10 border-t border-white/[0.05] bg-[#050505] py-24 overflow-hidden">
          {/* Footer Ambient Glow */}
          <div className="ambient-orb -bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-primary/5" />
          
          <div className="shell grid gap-16 lg:grid-cols-[2fr_1fr_1fr]">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary text-black flex items-center justify-center text-xl font-black italic">R</div>
                <span className="font-display text-2xl font-bold tracking-[0.2em]">ROADRESCUE</span>
              </div>
              <p className="max-w-md text-sm leading-8 text-white/30 font-light tracking-wide">
                The global benchmark for emotional mobility support. We redefine the standard of luxury roadside assistance with instant response and human-centric design.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-12 lg:col-span-2">
              <div className="space-y-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Network</p>
                <div className="grid gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  <Link href="/about" className="hover:text-white transition-colors duration-500">Our Network</Link>
                  <Link href="/support" className="hover:text-white transition-colors duration-500">Verified Experts</Link>
                  <Link href="/privacy" className="hover:text-white transition-colors duration-500">Privacy Policy</Link>
                </div>
              </div>
              <div className="space-y-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Support</p>
                <div className="grid gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  <Link href="/help" className="hover:text-white transition-colors duration-500">Help Center</Link>
                  <Link href="/contact" className="hover:text-white transition-colors duration-500">Contact Us</Link>
                  <Link href="/terms" className="hover:text-white transition-colors duration-500">Terms of Service</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="shell mt-24 flex flex-col items-center justify-between border-t border-white/[0.05] pt-12 sm:flex-row gap-8">
            <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.3em]">© 2026 Road Rescue Elite Platform</p>
            <div className="flex gap-10">
              {['Instagram', 'LinkedIn', 'Twitter'].map(social => (
                <span key={social} className="text-[9px] font-black text-white/10 hover:text-white cursor-pointer uppercase tracking-[0.3em] transition-colors duration-500">{social}</span>
              ))}
            </div>
          </div>
        </footer>
      </PageMotion>
    </>
  );
}
