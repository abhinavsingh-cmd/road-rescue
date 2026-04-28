import { motion } from "framer-motion";

const labels = {
  requested: "Initiated",
  assigned: "Expert Assigned",
  en_route: "On Route",
  arrived: "On Site",
  in_service: "Repair Progress",
  payment_pending: "Payment",
  completed: "Complete",
  cancelled: "Cancelled"
};

export default function StatusTimeline({ steps = [] }) {
  return (
    <div className="premium-panel rounded-[32px] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-md">
      <h3 className="font-display text-xl font-bold text-white tracking-tight">Service Lifecycle</h3>
      <div className="mt-10 relative">
        {/* Vertical Line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/5" />

        <div className="space-y-10">
          {steps.length ? steps.map((step, index) => (
            <motion.div 
              key={step.label} 
              className="relative flex items-start gap-8" 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: index * 0.1 }}
            >
              {/* Node */}
              <div className="relative z-10">
                <motion.div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                    step.state === "complete"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : step.state === "current"
                        ? "border-primary/50 bg-primary shadow-[0_0_20px_rgba(250,255,93,0.4)] text-black"
                        : "border-white/10 bg-black text-white/20"
                  }`}
                >
                  {step.state === "complete" ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-[10px] font-black">{index + 1}</span>
                  )}
                </motion.div>
                
                {step.state === "current" && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/20"
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              <div>
                <p className={`text-sm font-black uppercase tracking-widest ${step.state === 'current' ? 'text-white' : 'text-white/40'}`}>
                   {labels[step.label.toLowerCase().replace(/ /g, '_')] || step.label}
                </p>
                <p className="mt-1 text-xs font-medium leading-relaxed text-white/30">{step.description}</p>
              </div>
            </motion.div>
          )) : (
            <p className="text-xs text-white/20 uppercase tracking-widest font-bold">Establishing Protocol...</p>
          )}
        </div>
      </div>
    </div>
  );
}
