import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { staggerItem, staggerWrap, hoverLift } from "@/components/Motion";

export default function AuthForm({ mode = "login" }) {
  const router = useRouter();
  const { login, signup } = useAuth();
  const isSignup = mode === "signup";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer"
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (isSignup) {
        await signup(form);
      } else {
        await login(form);
      }

      const nextPath = typeof router.query.next === "string" ? router.query.next : null;
      router.push(nextPath || (form.role === "mechanic" ? "/mechanic-dashboard" : "/customer-dashboard"));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Authentication failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="premium-panel w-full overflow-hidden rounded-[32px] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl"
      variants={staggerWrap}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-8">
        <motion.p variants={staggerItem} className="kicker">
          {isSignup ? "New Account" : "Welcome Back"}
        </motion.p>
        <motion.h1 variants={staggerItem} className="font-display mt-3 text-3xl font-bold tracking-tight text-white">
          {isSignup ? "Join the Rescue" : "Sign in to Dashboard"}
        </motion.h1>
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        {/* Role Toggle */}
        <motion.div variants={staggerItem} className="flex rounded-xl bg-white/5 p-1">
          {["customer", "mechanic"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setForm({ ...form, role })}
              className={`relative flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                form.role === role ? "text-white" : "text-white/30 hover:text-white/50"
              }`}
            >
              {form.role === role && (
                <motion.div
                  layoutId="authRole"
                  className="absolute inset-0 rounded-lg bg-white/10 shadow-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{role}</span>
            </button>
          ))}
        </motion.div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isSignup && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                variants={staggerItem}
                className="space-y-1.5"
              >
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Full Name</label>
                <input
                  className="input-field w-full transition-all focus:bg-white/[0.05]"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={staggerItem} className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Email Address</label>
            <input
              className="input-field w-full transition-all focus:bg-white/[0.05]"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </motion.div>

          <AnimatePresence mode="popLayout">
            {isSignup && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                variants={staggerItem}
                className="space-y-1.5"
              >
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Phone Number</label>
                <input
                  className="input-field w-full transition-all focus:bg-white/[0.05]"
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={staggerItem} className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Password</label>
            <input
              className="input-field w-full transition-all focus:bg-white/[0.05]"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </motion.div>
        </div>

        <motion.button
          type="submit"
          className="btn-primary mt-4 w-full py-4 text-xs font-black uppercase tracking-[0.2em]"
          disabled={submitting}
          variants={staggerItem}
          whileHover={hoverLift}
          whileTap={{ scale: 0.98 }}
        >
          {submitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <span>Authenticating...</span>
            </div>
          ) : isSignup ? (
            "Create Account"
          ) : (
            "Sign In"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
