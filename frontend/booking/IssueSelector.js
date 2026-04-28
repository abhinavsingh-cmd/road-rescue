import { motion } from "framer-motion";
import { hoverLift } from "@/components/Motion";

const categories = [
  { id: "Puncture", label: "Flat Tyre", icon: "🔧" },
  { id: "Battery", label: "Battery Dead", icon: "⚡" },
  { id: "Engine", label: "Engine Overheat", icon: "🔥" },
  { id: "Fuel", label: "Out of Fuel", icon: "⛽" },
  { id: "Brakes", label: "Brake Failure", icon: "🛑" },
  { id: "Towing", label: "Need Towing", icon: "🛻" }
];

export default function IssueSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(cat.id)}
          className={`flex flex-col items-center gap-4 rounded-[28px] border p-6 transition-all ${
            selected === cat.id 
              ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(250,255,93,0.1)]" 
              : "border-white/5 bg-white/[0.02]"
          }`}
        >
          <span className="text-3xl">{cat.icon}</span>
          <span className={`text-xs font-black uppercase tracking-widest ${selected === cat.id ? "text-white" : "text-white/40"}`}>
            {cat.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
