import MainLayout from "@/layouts/MainLayout";
import { motion } from "framer-motion";
import { staggerItem, staggerWrap } from "@/components/Motion";

export default function TermsPage() {
  return (
    <MainLayout title="Terms | Road Rescue">
      <section className="shell py-10">
        <motion.div
          className="premium-panel mx-auto max-w-4xl rounded-[32px] p-6 sm:p-8"
          variants={staggerWrap}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <p className="kicker">Legal</p>
            <h1 className="font-display mt-3 text-3xl font-semibold text-white sm:text-4xl">Terms of Service</h1>
          </motion.div>
          <motion.p variants={staggerItem} className="mt-4 text-sm leading-7 text-white/58">
            Road Rescue connects customers and mechanics for emergency assistance, doorstep repair, and related vehicle
            services. Final pricing, serviceability, and response time may vary by distance, issue complexity, and
            mechanic availability.
          </motion.p>
        </motion.div>
      </section>
    </MainLayout>
  );
}
