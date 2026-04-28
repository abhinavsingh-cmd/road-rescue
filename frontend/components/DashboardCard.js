import { motion } from "framer-motion";
import { hoverLift } from "@/components/Motion";

export default function DashboardCard({ title, value, helper, accent = "border-[#faff5d]/20 bg-[#faff5d]/10 text-[#faff5d]" }) {
  return (
    <motion.div whileHover={hoverLift} className="premium-panel rounded-[28px] p-5">
      <div className={`inline-flex rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] ${accent}`}>{title}</div>
      <p className="font-display mt-5 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-white/52">{helper}</p>
    </motion.div>
  );
}
