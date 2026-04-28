import { motion } from "framer-motion";
import { hoverLift, staggerItem, staggerWrap } from "@/components/Motion";

const features = [
  {
    title: "Priority Dispatch",
    description: "Launch an emergency request with precision coordinates and vehicle diagnostics."
  },
  {
    title: "Expert Network",
    description: "Connect with certified responders nearby and monitor their arrival in real-time."
  },
  {
    title: "Mission Tracking",
    description: "Follow every milestone from acceptance and arrival to final service completion."
  },
  {
    title: "Secure Checkout",
    description: "Seamlessly authorize payments and review service history with complete transparency."
  }
];

export default function FeatureGrid() {
  return (
    <section className="shell py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="kicker">Designed for urgency</p>
          <h2 className="section-title mt-3">Everything needed to rescue the ride fast</h2>
        </div>
      </div>

      <motion.div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4" variants={staggerWrap} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        {features.map((feature) => (
          <motion.div key={feature.title} variants={staggerItem} whileHover={hoverLift} className="premium-panel rounded-[28px] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#faff5d]/25 bg-[#faff5d]/10 font-display text-lg font-semibold text-[#faff5d]">
              {feature.title.slice(0, 1)}
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/52">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
