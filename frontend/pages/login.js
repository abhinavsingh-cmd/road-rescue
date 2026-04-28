import Link from "next/link";
import MainLayout from "@/layouts/MainLayout";
import AuthForm from "@/auth/AuthForm";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <MainLayout title="Login | Road Rescue">
      <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden py-12 px-4">
        {/* Animated Background Glows */}
        <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md"
        >
          <AuthForm mode="login" />

          <p className="mt-8 text-center text-sm text-white/40">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-white hover:text-primary">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </MainLayout>
  );
}
