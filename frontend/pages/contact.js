import MainLayout from "@/layouts/MainLayout";
import { motion } from "framer-motion";
import { hoverLift, staggerItem, staggerWrap } from "@/components/Motion";

export default function ContactPage() {
  const items = [
    ["Call support", "+91 90000 11111", "tel:+919000011111"],
    ["WhatsApp", "Chat instantly with dispatch", "https://wa.me/919000011111"],
    ["Partnerships", "partners@roadrescue.app"],
    ["Head office", "Bengaluru, India"]
  ];

  return (
    <MainLayout title="Contact | Road Rescue">
      <section className="shell py-10">
        <motion.div
          className="premium-panel mx-auto max-w-4xl rounded-[32px] p-6 sm:p-8"
          variants={staggerWrap}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
          <p className="kicker">Contact</p>
          <h1 className="font-display mt-3 text-3xl font-semibold text-white sm:text-4xl">Reach the Road Rescue team</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
            Safety, dispatch, partnerships, and escalation channels are always available from one premium support layer.
          </p>
          </motion.div>
          <motion.div variants={staggerItem} className="mt-8 grid gap-4 sm:grid-cols-2">
            {items.map(([title, value, href]) => {
              const content = (
                <motion.div whileHover={hoverLift} className="surface-muted h-full p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/34">{title}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{value}</p>
                </motion.div>
              );

              return href ? (
                <a key={title} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
                  {content}
                </a>
              ) : (
                <div key={title}>{content}</div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>
    </MainLayout>
  );
}
