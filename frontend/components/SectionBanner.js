import Link from "next/link";
import { motion } from "framer-motion";
import { hoverLift } from "@/components/Motion";

export default function SectionBanner() {
  return (
    <section className="shell py-10">
      <motion.div className="premium-panel overflow-hidden rounded-[32px]" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
        <div className="grid gap-6 p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="kicker">Rescue network</p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-white sm:text-4xl">Bring trusted doorstep auto rescue to your city.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
              Road Rescue helps mechanics earn more through verified emergency demand while customers get transparent
              pricing and fast arrival updates.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <motion.div whileHover={hoverLift} whileTap={{ scale: 0.97 }}>
              <Link href="/signup" className="btn-primary">
                Create Account
              </Link>
            </motion.div>
            <motion.div whileHover={hoverLift} whileTap={{ scale: 0.97 }}>
              <Link href="/contact" className="btn-secondary">
                Talk to Sales
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
