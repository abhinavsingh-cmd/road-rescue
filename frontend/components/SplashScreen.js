import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]"
        >
          <div className="relative">
            {/* Ambient Background Glow */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0.15 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0 -z-10 rounded-full bg-primary blur-[120px]"
            />

            <div className="flex flex-col items-center">
              {/* Logo Animation */}
              <motion.div
                initial={{ rotateY: 90, opacity: 0, scale: 0.5 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex h-24 w-24 items-center justify-center rounded-[32px] bg-primary text-black shadow-[0_0_60px_rgba(250,255,93,0.4)]"
              >
                <span className="font-display text-5xl font-black italic tracking-tighter">R</span>
                
                {/* Reflective Shine Effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
              </motion.div>

              {/* Brand Reveal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-10 text-center"
              >
                <h1 className="font-display text-3xl font-bold tracking-[0.3em] text-white">
                  ROAD<span className="text-primary italic">RESCUE</span>
                </h1>
                
                <div className="mt-4 flex items-center gap-4 overflow-hidden">
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="h-[1px] w-12 bg-white/10 origin-right" 
                  />
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30">
                    Premium Roadside Concierge
                  </p>
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="h-[1px] w-12 bg-white/10 origin-left" 
                  />
                </div>
              </motion.div>
            </div>

            {/* Bottom Loading Bar */}
            <div className="absolute -bottom-24 left-1/2 w-48 -translate-x-1/2 overflow-hidden rounded-full bg-white/5 h-[2px]">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                className="h-full w-full bg-primary shadow-[0_0_10px_rgba(250,255,93,0.5)]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
