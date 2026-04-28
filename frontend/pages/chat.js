import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ChatWindow from "@/components/ChatWindow";
import BookingStatusBadge from "@/components/BookingStatusBadge";
import { hoverLift, staggerItem, staggerWrap } from "@/components/Motion";
import { useAuth } from "@/hooks/useAuth";
import { listBookings } from "@/services/bookings";

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      const response = await listBookings();
      setBookings(response);
      setLoading(false);
    }

    loadBookings();
  }, []);

  const selectedBookingId =
    (typeof router.query.bookingId === "string" && router.query.bookingId) ||
    bookings.find((booking) => !["completed", "cancelled"].includes(booking.status))?._id ||
    bookings[0]?._id;

  const selectedBooking = useMemo(
    () => bookings.find((booking) => booking._id === selectedBookingId),
    [bookings, selectedBookingId]
  );

  return (
    <ProtectedRoute>
      <MainLayout title="Chat | Road Rescue">
        <section className="shell py-10">
          {loading ? (
            <LoadingState title="Loading conversations" message="Fetching your booking chat history..." />
          ) : bookings.length ? (
            <motion.div
              className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"
              variants={staggerWrap}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={staggerItem} className="premium-panel rounded-[30px] p-6">
                <p className="kicker">Live messaging</p>
                <h2 className="font-display mt-3 text-2xl font-semibold text-white">Booking conversations</h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/58">
                  Coordinate directly with dispatch, the assigned mechanic, and your active rescue workflow.
                </p>
                <div className="mt-6 space-y-3">
                  {bookings.map((booking) => (
                    <motion.div key={booking._id} whileHover={hoverLift}>
                      <Link
                      key={booking._id}
                      href={`/chat?bookingId=${booking._id}`}
                      className={`block rounded-[24px] border p-4 transition ${
                        selectedBookingId === booking._id
                          ? "border-[#faff5d]/25 bg-[#faff5d]/9 shadow-[0_18px_45px_rgba(250,255,93,0.08)]"
                          : "border-white/8 bg-white/[0.03] hover:border-white/16 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{booking.issueType}</p>
                          <p className="mt-2 text-sm text-white/50">{booking.customerLocation?.address}</p>
                        </div>
                        <BookingStatusBadge status={booking.status} />
                      </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {selectedBooking ? (
                <ChatWindow bookingId={selectedBooking._id} currentUser={user} />
              ) : (
                <EmptyState title="No chat selected" message="Choose a booking to open the conversation." />
              )}
            </motion.div>
          ) : (
            <EmptyState title="No conversations yet" message="Chat threads appear automatically after a booking is created." />
          )}
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}
