import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import BookingStatusBadge from "@/components/BookingStatusBadge";
import ChatWindow from "@/components/ChatWindow";
import StatusTimeline from "@/components/StatusTimeline";
import BookingSummary from "@/booking/BookingSummary";
import MapPanel from "@/maps/MapPanel";
import { hoverLift, staggerItem, staggerWrap } from "@/components/Motion";
import { useAuth } from "@/hooks/useAuth";
import { getBooking, updateBookingStatus } from "@/services/bookings";
import { createPaymentIntent } from "@/services/payments";
import { getSocket } from "@/services/socket";
import { createReview } from "@/services/reviews";

function buildTimeline(booking) {
  return [...(booking?.timeline || [])]
    .sort((a, b) => new Date(a.at) - new Date(b.at))
    .map((entry, index, array) => ({
      label: entry.status.replace(/_/g, " "),
      description: entry.note || new Date(entry.at).toLocaleString(),
      state: index === array.length - 1 && !["completed", "cancelled"].includes(entry.status) ? "current" : "complete"
    }));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export default function BookingDetailsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBooking = async () => {
    if (!router.query.id) return;
    try {
      const response = await getBooking(router.query.id);
      setBookingData(response);
    } catch (error) {
      toast.error("Unable to sync booking data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.query.id || !user?._id) return;
    loadBooking();
    const socket = getSocket();
    socket?.emit("join:user", user._id);
    socket?.emit("join:booking", router.query.id);
    const refresh = () => loadBooking();
    socket?.on("booking:status", refresh);
    socket?.on("booking:assigned", refresh);
    socket?.on("mechanic:location", refresh);
    socket?.on("booking:refresh", refresh);
    return () => {
      socket?.off("booking:status", refresh);
      socket?.off("booking:assigned", refresh);
      socket?.off("mechanic:location", refresh);
      socket?.off("booking:refresh", refresh);
    };
  }, [router.query.id, user?._id]);

  const booking = bookingData?.booking;
  const payment = bookingData?.payment;
  const timeline = useMemo(() => buildTimeline(booking), [booking]);

  const handleMechanicStatus = async (status) => {
    try {
      await updateBookingStatus(booking._id, { status, finalCost: booking.finalCost || booking.priceEstimate });
      toast.success(`Mission: ${status.replace("_", " ").toUpperCase()}`);
      loadBooking();
    } catch (e) { toast.error("Status update failed"); }
  };

  const handlePayment = async () => {
    try {
      await createPaymentIntent(booking._id);
      toast.success("Payment Protocol Initiated");
      loadBooking();
    } catch (e) { toast.error("Payment failed"); }
  };

  if (loading) return <LoadingState title="Syncing Dispatch" message="Connecting to secure rescue stream..." />;
  if (!booking) return <EmptyState title="Mission Unavailable" message="Secure link expired or invalid." />;

  return (
    <ProtectedRoute>
      <MainLayout title={`Mission RR-${booking.bookingCode.toUpperCase()} | Road Rescue`}>
        <section className="relative min-h-[92vh] overflow-hidden">
          {/* Immersive Map Background */}
          <div className="absolute inset-0 z-0">
            <MapPanel 
              heightClass="h-full" 
              customerLocation={booking.customerLocation} 
              mechanicLocation={booking.mechanicLocation}
              title={`SYSTEM STATUS: ${booking.status.replace("_", " ").toUpperCase()}`}
            />
          </div>

          {/* Luxury HUD Overlay */}
          <div className="relative z-10 pointer-events-none min-h-[92vh] flex flex-col justify-end p-4 sm:p-10">
            <motion.div 
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto w-full max-w-7xl mx-auto grid gap-8 lg:grid-cols-[1fr_420px]"
            >
              {/* Primary Mission Card */}
              <div className="space-y-6">
                <div className="premium-panel rounded-[48px] border border-white/5 bg-black/70 backdrop-blur-3xl p-10 sm:p-12 shadow-2xl">
                  <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#faff5d]">Live Mission Feed</p>
                        <div className="h-1.5 w-1.5 rounded-full bg-[#faff5d] animate-pulse" />
                      </div>
                      <h2 className="font-display text-5xl font-black text-white leading-none">
                        {booking.issueType}
                      </h2>
                      <p className="text-sm font-bold text-white/30 uppercase tracking-[0.2em]">Deployment RR-{booking.bookingCode.toUpperCase()}</p>
                    </div>
                    <div className="scale-125 origin-right">
                      <BookingStatusBadge status={booking.status} />
                    </div>
                  </div>

                  <div className="mt-12 grid gap-10 sm:grid-cols-3 border-t border-white/5 pt-12">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Assigned Asset</p>
                      <p className="text-lg font-black text-white tracking-tight">{booking.mechanic?.name || 'Scanning Network...'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Arrival Estimate</p>
                      <p className="text-lg font-black text-[#faff5d] tracking-tight">{booking.etaMinutes ? `${booking.etaMinutes} MINS` : 'CALCULATING'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Service Quote</p>
                      <p className="text-lg font-black text-white tracking-tight">{formatCurrency(booking.finalCost || booking.priceEstimate)}</p>
                    </div>
                  </div>

                  <div className="mt-12 flex flex-wrap gap-4">
                    {user?.role === "mechanic" && booking.status === "assigned" && (
                      <button onClick={() => handleMechanicStatus("en_route")} className="btn-primary px-12 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Engage Route</button>
                    )}
                    {user?.role === "mechanic" && booking.status === "en_route" && (
                      <button onClick={() => handleMechanicStatus("arrived")} className="btn-primary px-12 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Confirm Arrival</button>
                    )}
                    {user?.role === "mechanic" && booking.status === "arrived" && (
                      <button onClick={() => handleMechanicStatus("in_service")} className="btn-primary px-12 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Start Diagnostics</button>
                    )}
                    {user?.role === "mechanic" && ["in_service", "payment_pending"].includes(booking.status) && (
                      <button onClick={() => handleMechanicStatus("completed")} className="btn-primary px-12 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Close Mission</button>
                    )}
                    {user?.role === "customer" && booking.paymentStatus !== "paid" && (
                      <button onClick={handlePayment} className="btn-primary px-12 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Authorize Payment</button>
                    )}
                    <button className="h-16 px-10 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white hover:bg-white/10 transition-all">Support Uplink</button>
                  </div>
                </div>
              </div>

              {/* Mission Intelligence Sidebar */}
              <div className="space-y-8 hidden lg:block">
                <StatusTimeline steps={timeline} />
                <div className="premium-panel rounded-[40px] border border-white/5 bg-black/60 backdrop-blur-3xl p-3 h-[320px] shadow-2xl overflow-hidden">
                  <ChatWindow bookingId={booking._id} currentUser={user} />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}
