export default function BookingSummary({ booking }) {
  return (
    <div className="premium-panel rounded-[28px] p-8">
      <h3 className="font-display text-xl font-semibold text-white">Service Overview</h3>
      <div className="mt-6 grid gap-5 text-sm text-white/70">
        <div className="flex items-center justify-between gap-4">
          <span>Issue type</span>
          <span className="font-semibold text-white">{booking.issueType}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Vehicle</span>
          <span className="font-semibold text-white">{booking.vehicleType}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Estimated cost</span>
          <span className="font-semibold text-[#faff5d]">₹{booking.priceEstimate}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Mechanic ETA</span>
          <span className="font-semibold text-white">{booking.etaMinutes ? `${booking.etaMinutes} mins` : "Pending"}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Pickup address</span>
          <span className="max-w-[60%] text-right font-semibold text-white">{booking.customerLocation?.address}</span>
        </div>
      </div>
    </div>
  );
}
