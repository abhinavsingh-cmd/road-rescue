import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import NotificationList from "@/components/NotificationList";
import BookingStatusBadge from "@/components/BookingStatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { listBookings } from "@/services/bookings";
import { listNotifications } from "@/services/notifications";
import { listPayments } from "@/services/payments";
import { getSocket } from "@/services/socket";
import { staggerItem, staggerWrap, hoverLift, tapReaction } from "@/components/Motion";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

const DashboardStat = ({ label, value, icon, delay }) => (
  <motion.div 
    variants={staggerItem}
    whileHover={hoverLift}
    className="premium-panel !rounded-[40px] p-8 border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] transition-colors duration-700 group"
  >
    <div className="flex justify-between items-start">
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-primary transition-colors">{label}</p>
        <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
      </div>
      <div className="h-12 w-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all duration-700">
        {icon}
      </div>
    </div>
  </motion.div>
);

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const [bookingData, notificationData, paymentData] = await Promise.all([
        listBookings(),
        listNotifications(),
        listPayments()
      ]);
      setBookings(bookingData);
      setNotifications(notificationData);
      setPayments(paymentData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    loadDashboard();
    const socket = getSocket();
    socket?.emit("join:user", user._id);
    const refresh = () => loadDashboard();
    socket?.on("notification:new", refresh);
    socket?.on("booking:refresh", refresh);
    return () => {
      socket?.off("notification:new", refresh);
      socket?.off("booking:refresh", refresh);
    };
  }, [user?._id]);

  const activeBooking = useMemo(
    () => bookings.find((booking) => !["completed", "cancelled"].includes(booking.status)),
    [bookings]
  );
  const bookingHistory = useMemo(
    () => bookings.filter((booking) => ["completed", "cancelled"].includes(booking.status)),
    [bookings]
  );

  const totalSpend = useMemo(() => payments.reduce((sum, p) => sum + Number(p.amount || 0), 0), [payments]);

  return (
    <ProtectedRoute roles={["customer"]}>
      <MainLayout title="Service Hub | Road Rescue">
        <section className="shell py-12 sm:py-20">
          <motion.div variants={staggerWrap} initial="hidden" animate="visible" className="space-y-16">
            <motion.div variants={staggerItem} className="flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                    </span>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Live Operations Active</p>
                  </div>
                </div>
                <h1 className="font-display text-5xl font-black tracking-tighter text-white sm:text-7xl">
                  Hi, <span className="text-gradient-gold italic">{user?.name?.split(" ")[0]}.</span>
                </h1>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={tapReaction}>
                <Link href="/booking" className="btn-primary !px-10 !py-6 !text-xs !tracking-[0.4em]">
                  New Request
                </Link>
              </motion.div>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {[1,2,3,4].map(i => <div key={i} className="h-32 skeleton" />)}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <DashboardStat label="Current Missions" value={activeBooking ? "01" : "00"} icon="🛰️" />
                  <DashboardStat label="Completed" value={String(bookingHistory.length).padStart(2, '0')} icon="🏁" />
                  <DashboardStat label="Total Volume" value={formatCurrency(totalSpend)} icon="💳" />
                  <DashboardStat label="Security Alerts" value={String(notifications.filter(n => !n.read).length).padStart(2, '0')} icon="🔔" />
                </div>

                {activeBooking && (
                  <motion.div variants={staggerItem} className="relative">
                    <Link href={`/booking/${activeBooking._id}`}>
                      <div className="premium-panel !rounded-[56px] border-primary/20 bg-primary/5 p-12 backdrop-blur-[60px] transition-all duration-700 hover:bg-primary/10 group overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
                           <div className="h-64 w-64 rounded-full bg-primary blur-[100px]" />
                        </div>
                        
                        <div className="flex flex-col gap-12 sm:flex-row sm:items-center sm:justify-between relative z-10">
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Priority Deployment In Progress</p>
                            </div>
                            <h2 className="font-display text-5xl font-black text-white leading-none tracking-tighter">
                              {activeBooking.issueType} <br/>
                              <span className="text-2xl text-white/30 font-light tracking-[0.1em]">{activeBooking.vehicleType}</span>
                            </h2>
                            <div className="flex items-center gap-4 text-white/40">
                               <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <p className="text-sm font-light tracking-wide">{activeBooking.customerLocation?.address}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-12">
                            <div className="text-right hidden md:block space-y-2">
                              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Operational Phase</p>
                              <p className="text-sm font-black text-white uppercase tracking-widest">{activeBooking.status.replace("_", " ")}</p>
                            </div>
                            <div className="scale-150 origin-right">
                               <BookingStatusBadge status={activeBooking.status} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                <div className="grid gap-16 lg:grid-cols-[1fr_420px]">
                  <motion.div variants={staggerItem} className="space-y-10">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-3xl font-bold text-white tracking-tighter">Service History</h3>
                    </div>
                    
                    {bookingHistory.length === 0 ? (
                      <div className="premium-panel !rounded-[48px] border-dashed border-white/5 py-24 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">Archive Empty</p>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {bookingHistory.map((booking) => (
                          <Link key={booking._id} href={`/booking/${booking._id}`}>
                            <div className="premium-panel !rounded-[40px] p-8 border-white/[0.05] bg-white/[0.01] transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.1] group">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-8">
                                  <div className="h-16 w-16 rounded-[24px] bg-white/[0.03] flex items-center justify-center text-white/10 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-700">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-xl font-bold text-white tracking-tight">{booking.issueType}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                       <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
                                         {new Date(booking.createdAt).toLocaleDateString()}
                                       </p>
                                       <span className="h-1 w-1 rounded-full bg-white/5" />
                                       <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">RR-{booking.bookingCode.toUpperCase()}</p>
                                    </div>
                                  </div>
                                </div>
                                <BookingStatusBadge status={booking.status} />
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  <motion.div variants={staggerItem} className="space-y-12">
                    <div className="premium-panel !rounded-[48px] p-10 bg-[#080808]">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10">Saved Fleet</h4>
                      <div className="space-y-10">
                        {user?.vehicles?.length > 0 ? (
                          user.vehicles.map((v, i) => (
                            <div key={i} className="flex items-center gap-6 group">
                              <div className="h-14 w-14 rounded-2xl bg-white/[0.03] flex items-center justify-center text-white/20 border border-white/[0.05] group-hover:text-primary group-hover:border-primary/20 transition-all duration-700">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white tracking-wide">{v.make} {v.model}</p>
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">{v.licensePlate}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-10 text-center">
                             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10">No Assets Registered</p>
                          </div>
                        )}
                        <Link href="/profile" className="block text-[9px] font-black uppercase tracking-[0.4em] text-primary pt-6 border-t border-white/5 hover:text-white transition-colors duration-500">
                          Configure Fleet Registry →
                        </Link>
                      </div>
                    </div>

                    <NotificationList notifications={notifications} onRefresh={loadDashboard} />
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}