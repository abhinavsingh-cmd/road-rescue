import MainLayout from "@/layouts/MainLayout";
import HeroSection from "@/components/HeroSection";
import FeatureGrid from "@/components/FeatureGrid";
import StatStrip from "@/components/StatStrip";
import SectionBanner from "@/components/SectionBanner";
import Link from "next/link";
import { motion } from "framer-motion";
import { hoverLift, staggerItem, staggerWrap } from "@/components/Motion";

export default function HomePage() {
  return (
    <MainLayout title="Road Rescue | Emergency Auto Repair & Doorstep Service">
      <HeroSection />
      <StatStrip />
      <FeatureGrid />

      <section className="shell py-10">
        <motion.div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]" variants={staggerWrap} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div variants={staggerItem} className="premium-panel rounded-[30px] p-8">
            <p className="kicker">Immediate Assistance</p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-white">Seamless roadside help with verified service history</h2>
            <p className="mt-4 text-base leading-7 text-white/70">
              Experience the next generation of roadside support. Connect with expert mechanics instantly, track your 
              service progress, manage secure payments, and communicate through our dedicated concierge feed.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <motion.div whileHover={hoverLift} whileTap={{ scale: 0.97 }}>
                <Link href="/booking" className="btn-primary">
                  Request Help Now
                </Link>
              </motion.div>
              <motion.div whileHover={hoverLift} whileTap={{ scale: 0.97 }}>
                <Link href="/signup" className="btn-secondary">
                  Join the Network
                </Link>
              </motion.div>
            </div>
          </motion.div>
          <motion.div variants={staggerItem} className="premium-panel rounded-[30px] p-8">
            <p className="kicker">The Experience</p>
            <div className="mt-6 space-y-6">
              {[
                { title: "Describe & Locate", desc: "Select your issue and share your exact location for a precise dispatch." },
                { title: "Expert Match", desc: "Our network identifies the most qualified local mechanic for your specific vehicle." },
                { title: "End-to-End Tracking", desc: "Follow every milestone from dispatch to arrival and final service completion." }
              ].map((item) => (
                <motion.div key={item.title} whileHover={hoverLift} className="surface-muted p-5 rounded-2xl">
                  <p className="font-bold text-white text-lg">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <SectionBanner />
    </MainLayout>
  );
}
