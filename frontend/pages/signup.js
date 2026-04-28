import Link from "next/link";
import MainLayout from "@/layouts/MainLayout";
import AuthForm from "@/auth/AuthForm";
import { motion } from "framer-motion";

export default function SignupPage() {
  return (
    <MainLayout title="Join | Road Rescue">
      <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden py-12 px-4">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 -right-20 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 -left-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md"
        >
          <AuthForm mode="signup" />
          
          <p className="mt-8 text-center text-sm text-white/40">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-white hover:text-primary">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </MainLayout>
  );
}
