import { motion } from "framer-motion";
import { hoverLift } from "@/components/Motion";

export default function ChatSupportPanel() {
  return (
    <motion.div whileHover={hoverLift} className="premium-panel rounded-[28px] p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Live support chat</h3>
          <p className="mt-1 text-sm text-white/50">Use the booking chat to coordinate in real time with customers and mechanics.</p>
        </div>
        <span className="rounded-full border border-[#faff5d]/20 bg-[#faff5d]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#faff5d]">Live</span>
      </div>

      <div className="surface-muted mt-6 p-4 text-sm leading-6 text-white/70">
        Your conversation history is securely encrypted and synced across all devices for a seamless support experience.
      </div>
    </motion.div>
  );
}
