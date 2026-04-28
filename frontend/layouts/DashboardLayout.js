import MainLayout from "@/layouts/MainLayout";
import { motion } from "framer-motion";
import { staggerItem, staggerWrap } from "@/components/Motion";

export default function DashboardLayout({ children, title, summary }) {
  return (
    <MainLayout title={title}>
      <section className="shell py-8 sm:py-10">
        <motion.div variants={staggerWrap} initial="hidden" animate="visible" className="premium-grid">
          <motion.div variants={staggerItem} className="premium-panel rounded-[32px] px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="kicker">Operations Center</p>
                <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58 sm:text-base">{summary}</p>
              </div>
              <div className="surface-muted grid gap-3 rounded-[28px] p-4 text-sm text-white/55 sm:min-w-[260px]">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#faff5d]/70">Live workspace</span>
                <span>Dark mode command center</span>
                <span>Realtime dispatch and analytics</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="premium-panel rounded-[32px] p-4 sm:p-6">
            {children}
          </motion.div>
        </motion.div>
      </section>
    </MainLayout>
  );
}
