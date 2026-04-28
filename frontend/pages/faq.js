import MainLayout from "@/layouts/MainLayout";
import { motion } from "framer-motion";
import { hoverLift, staggerItem, staggerWrap } from "@/components/Motion";

const faqs = [
  {
    question: "How quickly can Road Rescue find a mechanic?",
    answer: "The platform is designed to broadcast jobs instantly and typically shows an ETA within a few minutes."
  },
  {
    question: "Can I track the mechanic live?",
    answer: "Yes. The booking flow and details page include live status tracking, map embeds, and mechanic coordinate updates."
  },
  {
    question: "Does the app support cashless payments?",
    answer: "Yes. The backend creates Stripe payment intents when production credentials are configured."
  }
];

export default function FAQPage() {
  return (
    <MainLayout title="FAQ | Road Rescue">
      <section className="shell py-10">
        <motion.div
          className="mx-auto max-w-4xl space-y-4"
          variants={staggerWrap}
          initial="hidden"
          animate="visible"
        >
          {faqs.map((faq) => (
            <motion.div key={faq.question} variants={staggerItem} whileHover={hoverLift} className="premium-panel rounded-[28px] p-6">
              <h2 className="font-display text-xl font-semibold text-white">{faq.question}</h2>
              <p className="mt-3 text-sm leading-7 text-white/58">{faq.answer}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </MainLayout>
  );
}
