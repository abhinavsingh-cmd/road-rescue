import clsx from "clsx";

const styles = {
  requested: "border-white/10 bg-white/5 text-white/60",
  assigned: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  en_route: "border-primary/30 bg-primary/10 text-primary shadow-[0_0_15px_rgba(250,255,93,0.1)]",
  arrived: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
  in_service: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  payment_pending: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  cancelled: "border-rose-500/30 bg-rose-500/10 text-rose-400"
};

const labels = {
  requested: "Finding Expert",
  assigned: "Expert Matched",
  en_route: "On the way",
  arrived: "Arrived",
  in_service: "In Progress",
  payment_pending: "Awaiting Payment",
  completed: "Service Complete",
  cancelled: "Cancelled"
};

export default function BookingStatusBadge({ status }) {
  const currentStatus = status || "requested";
  
  return (
    <span className={clsx(
      "rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] transition-all duration-500 whitespace-nowrap",
      styles[currentStatus] || styles.requested
    )}>
      {labels[currentStatus] || currentStatus.replace(/_/g, " ")}
    </span>
  );
}
