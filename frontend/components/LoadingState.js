import { motion } from "framer-motion";

export default function LoadingState({ title = "Loading", message = "Please wait..." }) {
  return (
    <div className="premium-panel flex min-h-[260px] flex-col items-center justify-center rounded-[32px] p-8 text-center">
      <motion.div
        className="relative h-14 w-14 rounded-full border border-[#faff5d]/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute inset-2 rounded-full border border-[#faff5d]/70 border-t-transparent" />
      </motion.div>
      <div className="mt-8 grid w-full max-w-md gap-3">
        <div className="skeleton h-5 w-1/2 justify-self-center" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-4/5 justify-self-center" />
      </div>
      <h2 className="font-display mt-8 text-2xl font-semibold text-white">Syncing Service Link</h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-white/70">Connecting to our verified mobility network...</p>
    </div>
  );
}
