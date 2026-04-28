import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { floatAnimation, hoverLift, staggerWrap, staggerItem, tapReaction } from "@/components/Motion";
import { useRef } from "react";

export default function HeroSection() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  return (
    <section ref={targetRef} className="relative overflow-hidden pt-20 pb-32 sm:pt-32 sm:pb-48">
      {/* Background Cinematic Visuals */}
      <div className="absolute inset-0 z-0">
        <div className="ambient-orb top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20" />
        <div className="ambient-orb bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10" />
        
        {/* Animated Particles/Dust Grid */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />
      </div>

      <motion.div style={{ opacity, scale, y }} className="shell relative z-10">
        <motion.div
          className="flex flex-col items-center text-center"
          variants={staggerWrap}
          initial="hidden"
          animate="visible"
        >
          {/* Elite Status Badge */}
          <motion.div
            variants={staggerItem}
            className="mb-10 flex items-center gap-3 rounded-full border border-white/5 bg-white/5 px-6 py-2 backdrop-blur-xl"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#faff5d]" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60">Global Network Active</span>
          </motion.div>

          <motion.h1
            variants={staggerItem}
            className="max-w-5xl font-display text-6xl font-black tracking-tighter text-white sm:text-8xl lg:text-[10rem] leading-[0.9]"
          >
            ROADSIDE <br />
            <span className="text-gradient-gold italic">EVOLVED.</span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="mt-12 max-w-2xl text-lg leading-relaxed text-white/40 sm:text-xl font-light tracking-wide"
          >
            The world's first emotional mobility rescue network. High-fidelity tracking, 
            certified elite mechanics, and a service experience that feels like a concierge.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="mt-16 flex flex-col gap-6 sm:flex-row"
          >
            <motion.div whileHover={hoverLift} whileTap={tapReaction}>
              <Link href="/booking" className="btn-primary min-w-[240px]">
                Get Help Now
              </Link>
            </motion.div>
            <motion.div whileHover={hoverLift} whileTap={tapReaction}>
              <Link href="/signup" className="btn-secondary min-w-[240px]">
                Join Exclusive Network
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Cinematic Abstract Asset */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-32 relative mx-auto max-w-6xl px-4"
        >
          <motion.div 
            animate={floatAnimation}
            className="group relative aspect-[21/9] rounded-[56px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-1 shadow-2xl backdrop-blur-md overflow-hidden"
          >
            {/* Background Texture for Asset */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-30 grayscale transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            
            {/* Floating Glass Data Cards */}
            <div className="relative h-full w-full rounded-[54px] flex items-end p-12 overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 w-full">
                {[
                  { label: "Dispatch", val: "Instant" },
                  { label: "Elite Tier", val: "Top 1%" },
                  { label: "Accuracy", val: "99.9%" },
                  { label: "Uptime", val: "24/7/365" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="space-y-2 border-l border-white/10 pl-6"
                  >
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">{stat.label}</p>
                    <p className="text-2xl font-bold text-white tracking-tighter">{stat.val}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Luxury Lighting Sweep */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
            />
          </motion.div>
          
          {/* Strong Neon Glow Beneath Asset */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-primary/20 blur-[120px] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
