import { motion } from "framer-motion";

export default function EmptyState({ title, message, action = null }) {
  return (
    <motion.div className="premium-panel rounded-[32px] p-8 text-center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#faff5d]/15 bg-[#faff5d]/10 text-[#faff5d] shadow-[0_0_50px_rgba(250,255,93,0.12)]">
        RR
      </div>
      <h3 className="font-display mt-6 text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/52">{message}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </motion.div>
  );
}
