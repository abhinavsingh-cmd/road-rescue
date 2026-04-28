import MainLayout from "@/layouts/MainLayout";
import { motion } from "framer-motion";
import { hoverLift, staggerItem, staggerWrap } from "@/components/Motion";

export default function SupportPage() {
  const channels = [
    ["24/7 hotline", "+91 90000 11111"],
    ["Email support", "help@roadrescue.app"],
    ["Dispatch escalation", "safety@roadrescue.app"]
  ];

  return (
    <MainLayout title="Support | Road Rescue">
      <section className="shell py-10">
        <motion.div variants={staggerWrap} initial="hidden" animate="visible" className="grid gap-6">
          <motion.div variants={staggerItem} className="premium-panel rounded-[32px] p-6 sm:p-8">
            <p className="kicker">Support</p>
            <h1 className="font-display mt-3 text-3xl font-semibold text-white sm:text-4xl">Human help at every step of the rescue flow</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
              From first contact to payment reconciliation, Road Rescue keeps high-priority support channels within immediate reach.
            </p>
          </motion.div>

          <motion.div variants={staggerItem} className="grid gap-6 lg:grid-cols-3">
            {channels.map(([title, value]) => (
              <motion.div key={title} whileHover={hoverLift} className="premium-panel rounded-[28px] p-6">
                <p className="kicker">{title}</p>
                <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </MainLayout>
  );
}
