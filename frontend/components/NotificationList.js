import { markNotificationRead } from "@/services/notifications";
import { motion } from "framer-motion";
import { hoverLift } from "@/components/Motion";

export default function NotificationList({ notifications = [], onRefresh }) {
  const handleRead = async (id) => {
    await markNotificationRead(id);
    onRefresh?.();
  };

  return (
    <div className="premium-panel rounded-[28px] p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Notifications</h3>
          <p className="mt-1 text-sm text-white/48">Dispatch, booking, and payment updates appear here.</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {notifications.length ? (
          notifications.map((notification) => (
            <motion.div key={notification._id} whileHover={hoverLift} className="surface-muted p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-white">{notification.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/50">{notification.body}</p>
                </div>
                {!notification.read ? (
                  <button type="button" className="btn-secondary" onClick={() => handleRead(notification._id)}>
                    Mark read
                  </button>
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">Read</span>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-white/50">You are all caught up.</p>
        )}
      </div>
    </div>
  );
}
