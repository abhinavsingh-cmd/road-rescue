import { motion } from "framer-motion";
import { staggerItem, staggerWrap } from "@/components/Motion";

const stats = [
  { label: "Available Network", value: "24/7/365 Service" },
  { label: "Elite Mechanics", value: "Verified Experts" },
  { label: "Response Time", value: "Under 25 Minutes" },
  { label: "Active Support", value: "Live Concierge" }
];

export default function StatStrip() {
  return (
    <section className="shell py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-white/5" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">The Premium Standard in Rescue</p>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <motion.div className="premium-panel grid gap-4 rounded-[32px] p-6 sm:grid-cols-2 xl:grid-cols-4" variants={staggerWrap} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={staggerItem} className="surface-muted p-5">
            <p className="font-display text-2xl font-semibold text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-white/48">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
