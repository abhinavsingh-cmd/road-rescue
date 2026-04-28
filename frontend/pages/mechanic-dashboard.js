import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import BookingStatusBadge from "@/components/BookingStatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { getSocket } from "@/services/socket";
import { getMechanicDashboard, updateMechanicAvailability, updateMechanicLocation } from "@/services/mechanics";
import { respondToBooking, updateBookingStatus } from "@/services/bookings";
import { getCurrentBrowserLocation, reverseGeocodeCoordinates } from "@/services/maps";
import { staggerItem, staggerWrap, hoverLift, tapReaction } from "@/components/Motion";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

const StatCard = ({ label, value, sub, delay }) => (
  <motion.div 
    variants={staggerItem}
    whileHover={hoverLift}
    className="premium-panel !rounded-[40px] p-10 bg-white/[0.01] border-white/[0.05] group"
  >
    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-primary transition-colors">{label}</p>
    <p className="text-4xl font-black text-white mt-6 tracking-tighter">{value}</p>
    {sub && <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.2em] mt-2">{sub}</p>}
  </motion.div>
);

export default function MechanicDashboardPage() {
  const { user, updateProfile } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState("");

  const loadDashboard = async () => {
    try {
      const response = await getMechanicDashboard();
      setDashboard(response);
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
    socket?.on("booking:request", refresh);
    socket?.on("booking:refresh", refresh);
    socket?.on("notification:new", refresh);
    return () => {
      socket?.off("booking:request", refresh);
      socket?.off("booking:refresh", refresh);
      socket?.off("notification:new", refresh);
    };
  }, [user?._id]);

  const handleAvailability = async () => {
    try {
      setBusyAction("availability");
      await updateMechanicAvailability(!dashboard.profile.isAvailable);
      await loadDashboard();
      toast.success(dashboard.profile.isAvailable ? "Unit Offline" : "Unit Active");
    } catch (error) {
      toast.error("Protocol Error");
    } finally {
      setBusyAction("");
    }
  };

  const handleLocationUpdate = async () => {
    try {
      setBusyAction("location");
      const location = await getCurrentBrowserLocation();
      const resolved = await reverseGeocodeCoordinates(location);
      await updateMechanicLocation({
        latitude: resolved.latitude,
        longitude: resolved.longitude,
        address: resolved.address
      });
      await loadDashboard();
      toast.success("Coordinates Synchronized");
    } catch (error) {
      toast.error("GPS Link Failed");
    } finally {
      setBusyAction("");
    }
  };

  const handleBookingResponse = async (bookingId, action) => {
    try {
      setBusyAction(`${action}-${bookingId}`);
      await respondToBooking(bookingId, action);
      await loadDashboard();
      toast.success(action === "accept" ? "Mission Engaged" : "Request Deferred");
    } catch (error) {
      toast.error("Transmission Error");
    } finally {
      setBusyAction("");
    }
  };

  const handleStatusUpdate = async (bookingId, status, finalCost) => {
    try {
      setBusyAction(`${status}-${bookingId}`);
      await updateBookingStatus(bookingId, { status, finalCost });
      await loadDashboard();
      toast.success("Mission Updated");
    } catch (error) {
      toast.error("Update Failed");
    } finally {
      setBusyAction("");
    }
  };

  const activeBooking = dashboard?.activeBooking;
  const availableRequests = dashboard?.availableRequests || [];

  return (
    <ProtectedRoute roles={["mechanic"]}>
      <MainLayout title="Operations Center | Road Rescue">
        <section className="shell py-12 sm:py-20">
          <motion.div variants={staggerWrap} initial="hidden" animate="visible" className="space-y-16">
            {/* Elite Operations Header */}
            <motion.div variants={staggerItem} className="flex flex-col justify-between gap-10 sm:flex-row sm:items-center">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 w-fit">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                    </span>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Command Link Active</p>
                  </div>
                <h1 className="font-display text-5xl font-black tracking-tighter text-white sm:text-7xl">
                   {user?.name?.split(" ")[0]}<span className="text-gradient-gold italic">.Ops</span>
                </h1>
              </div>
              
              <div className="flex items-center gap-6">
                 <div className="text-right hidden md:block space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Current Posture</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${dashboard?.profile?.isAvailable ? 'text-primary' : 'text-white/30'}`}>
                    {dashboard?.profile?.isAvailable ? 'Combat Ready' : 'Standby'}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={tapReaction}
                  onClick={handleAvailability}
                  disabled={busyAction === "availability"}
                  className={`h-20 px-12 rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700 border ${
                    dashboard?.profile?.isAvailable 
                      ? 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 shadow-[0_0_30px_rgba(250,255,93,0.1)]' 
                      : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/[0.05]'
                  }`}
                >
                  {dashboard?.profile?.isAvailable ? 'Go Offline' : 'Go Active'}
                </motion.button>
              </div>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {[1,2,3,4].map(i => <div key={i} className="h-40 skeleton" />)}
              </div>
            ) : (
              <>
                {/* Tactical Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <StatCard label="Revenue Today" value={formatCurrency(dashboard.metrics.earnings.today)} sub="Cleared Funds" />
                  <StatCard label="Weekly Volume" value={formatCurrency(dashboard.metrics.earnings.week)} sub="Operational Total" />
                  <StatCard label="Active Ops" value={activeBooking ? "01" : "00"} sub="Live Mission" />
                  <StatCard label="Service Rating" value={`${dashboard.profile.averageRating} ★`} sub="Elite Grade" />
                </div>

                <div className="grid gap-16 lg:grid-cols-[1fr_450px]">
                  {/* Operations Feed */}
                  <motion.div variants={staggerItem} className="space-y-12">
                    {activeBooking ? (
                      <div className="space-y-10">
                        <div className="flex items-center justify-between border-b border-white/5 pb-8">
                          <h3 className="font-display text-4xl font-black text-white tracking-tighter">Current <span className="text-primary italic">Service.</span></h3>
                          <div className="scale-125 origin-right">
                             <BookingStatusBadge status={activeBooking.status} />
                          </div>
                        </div>
                        
                        <div className="premium-panel !rounded-[56px] border-primary/20 bg-primary/5 p-12 backdrop-blur-[60px] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
                             <div className="h-64 w-64 rounded-full bg-primary blur-[100px] animate-pulse" />
                           </div>
                           
                           <div className="relative z-10 flex flex-col gap-12 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-6">
                              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Priority Asset Recovery</p>
                              <h2 className="font-display text-5xl font-black text-white leading-tight tracking-tighter">{activeBooking.issueType}</h2>
                              <div className="space-y-2">
                                <p className="text-sm font-bold text-white/50 tracking-wide">{activeBooking.customer?.name} • Principal Client</p>
                                <p className="text-xs font-light text-white/30 leading-relaxed max-w-sm">{activeBooking.customerLocation?.address}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-4 sm:min-w-[220px]">
                              {activeBooking.status === "assigned" && (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={tapReaction} onClick={() => handleStatusUpdate(activeBooking._id, "en_route")} className="btn-primary !py-6">Engage Route</motion.button>
                              )}
                              {activeBooking.status === "en_route" && (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={tapReaction} onClick={() => handleStatusUpdate(activeBooking._id, "arrived")} className="btn-primary !py-6">Confirm Arrival</motion.button>
                              )}
                              {activeBooking.status === "arrived" && (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={tapReaction} onClick={() => handleStatusUpdate(activeBooking._id, "in_service")} className="btn-primary !py-6">Begin Service</motion.button>
                              )}
                              {activeBooking.status === "in_service" && (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={tapReaction} onClick={() => handleStatusUpdate(activeBooking._id, "completed", activeBooking.priceEstimate)} className="btn-primary !py-6">Close Mission</motion.button>
                              )}
                              <Link href={`/booking/${activeBooking._id}`} className="btn-secondary !py-6 !border-white/5">Service Details</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-12">
                        <div className="flex items-center justify-between border-b border-white/5 pb-8">
                          <h3 className="font-display text-4xl font-black text-white tracking-tighter">Nearby <span className="text-primary italic">Requests.</span></h3>
                          {availableRequests.length > 0 && (
                             <div className="flex items-center gap-3">
                               <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Signal</span>
                             </div>
                          )}
                        </div>
                        
                        {availableRequests.length === 0 ? (
                          <div className="premium-panel !rounded-[56px] border-dashed border-white/5 py-32 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">Scanning Grid for Signal...</p>
                          </div>
                        ) : (
                          <div className="grid gap-8">
                            {availableRequests.map((req) => (
                              <motion.div 
                                key={req._id}
                                whileHover={{ scale: 1.01 }}
                                className="premium-panel !rounded-[48px] p-10 border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700 group"
                              >
                                <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Priority Alert</span>
                                       <span className="h-1 w-1 rounded-full bg-white/10" />
                                       <span className="text-[9px] font-bold text-white/20 uppercase">RR-{req.bookingCode.toUpperCase()}</span>
                                    </div>
                                    <h4 className="font-display text-3xl font-black text-white tracking-tight">{req.issueType}</h4>
                                    <p className="text-sm font-light text-white/30 line-clamp-1">{req.customerLocation?.address}</p>
                                  </div>
                                  <div className="flex gap-4">
                                    <button onClick={() => handleBookingResponse(req._id, "reject")} className="h-16 px-10 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all">Defer</button>
                                    <button onClick={() => handleBookingResponse(req._id, "accept")} className="h-16 px-12 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary transition-all shadow-xl">Engage • {formatCurrency(req.priceEstimate)}</button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>

                  {/* Operational Intelligence Sidebar */}
                  <motion.div variants={staggerItem} className="space-y-12">
                    <div className="premium-panel !rounded-[48px] p-10 bg-[#080808]">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10">GPS Location Signal</h4>
                      <div className="space-y-8">
                        <p className="text-sm leading-8 text-white/30 font-light tracking-wide italic">Stay available on the map to receive nearby high-priority service requests.</p>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={tapReaction}
                          onClick={handleLocationUpdate} 
                          disabled={busyAction === "location"}
                          className="btn-secondary w-full !py-6 !border-white/5 !bg-white/[0.02]"
                        >
                          Sync Coordinates
                        </motion.button>
                      </div>
                    </div>

                    <div className="premium-panel !rounded-[48px] p-10 bg-[#080808]">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10">Mission Archive</h4>
                      <div className="space-y-10">
                        {dashboard.bookingHistory.slice(0, 4).map(b => (
                          <Link key={b._id} href={`/booking/${b._id}`} className="group flex items-center justify-between border-b border-white/5 pb-8 last:border-0 last:pb-0">
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-white group-hover:text-primary transition-colors duration-500">{b.issueType}</p>
                              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{new Date(b.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className="text-[10px] font-black text-white/10 uppercase tracking-widest group-hover:text-white transition-colors">{formatCurrency(b.finalCost || b.priceEstimate)}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
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
