import MainLayout from "@/layouts/MainLayout";
import { motion } from "framer-motion";
import { staggerItem, staggerWrap } from "@/components/Motion";

export default function PrivacyPolicyPage() {
  return (
    <MainLayout title="Privacy Policy | Road Rescue">
      <section className="shell py-10">
        <motion.div
          className="premium-panel mx-auto max-w-4xl rounded-[32px] p-6 sm:p-8"
          variants={staggerWrap}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <p className="kicker">Privacy</p>
            <h1 className="font-display mt-3 text-3xl font-semibold text-white sm:text-4xl">Privacy Policy</h1>
          </motion.div>
          <motion.p variants={staggerItem} className="mt-4 text-sm leading-7 text-white/58">
            Road Rescue stores account, booking, and operational dispatch information to deliver rescue services,
            improve matching, and maintain safety records. Sensitive payment information should only be processed through
            approved payment providers.
          </motion.p>
        </motion.div>
      </section>
    </MainLayout>
  );
}
