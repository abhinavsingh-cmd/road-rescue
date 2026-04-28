import MainLayout from "@/layouts/MainLayout";
import BookingForm from "@/components/BookingForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";

export default function BookingPage() {
  return (
    <ProtectedRoute roles={["customer"]}>
      <MainLayout title="Emergency Dispatch | Road Rescue">
        <section className="shell py-12 sm:py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="h-2 w-2 rounded-full bg-[#faff5d] animate-pulse shadow-[0_0_10px_#faff5d]" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#faff5d]">Elite Rescue Network</p>
            </div>
            <h1 className="font-display text-5xl font-black tracking-tight text-white sm:text-7xl">
              Initiate Dispatch.
            </h1>
          </motion.div>
          
          <BookingForm />
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}
