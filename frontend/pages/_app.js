import "@/styles/globals.css";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import SplashScreen from "@/components/SplashScreen";
import { getSocket } from "@/services/socket";

function initializeSocket() {
  if (typeof window !== "undefined") {
    getSocket();
  }
}

export default function App({ Component, pageProps, router }) {
  const getLayout = Component.getLayout || ((page) => page);

  initializeSocket();

  return (
    <AuthProvider>
      <SplashScreen />
      <AnimatePresence mode="wait">
        {getLayout(<Component {...pageProps} key={router.asPath} />)}
      </AnimatePresence>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(14, 15, 17, 0.92)",
            color: "#f8fafc",
            border: "1px solid rgba(250, 255, 93, 0.16)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
            borderRadius: "24px",
            fontSize: "12px",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            textTransform: "uppercase"
          }
        }}
      />
    </AuthProvider>
  );
}
