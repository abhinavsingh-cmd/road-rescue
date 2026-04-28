import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createBooking } from "@/services/bookings";
import { searchNearbyMechanics } from "@/services/mechanics";
import {
  geocodeAddress,
  getCurrentBrowserLocation,
  reverseGeocodeCoordinates
} from "@/services/maps";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import MapPanel from "@/maps/MapPanel";
import { hoverLift, staggerWrap, staggerItem, tapReaction } from "@/components/Motion";

const issueTypes = [
  { id: "Puncture", label: "Puncture Support", icon: "🔧", color: "#faff5d" },
  { id: "Battery", label: "Electrical Uplink", icon: "⚡", color: "#60a5fa" },
  { id: "Engine", label: "Powertrain Failure", icon: "🔥", color: "#f87171" },
  { id: "Fuel", label: "Fuel Logistics", icon: "⛽", color: "#fbbf24" },
  { id: "Towing", label: "Asset Extraction", icon: "🛻", color: "#a78bfa" },
  { id: "Diagnosis", label: "Tactical Diagnosis", icon: "🔍", color: "#94a3b8" }
];

const vehicleTypes = ["Car", "Motorcycle", "SUV", "Logistics"];

const slideTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export default function BookingForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { google } = useGoogleMaps();
  const addressInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    serviceCategory: "Emergency",
    issueType: "Diagnosis",
    vehicleType: "Car",
    address: "",
    latitude: "",
    longitude: "",
    description: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [nearbyMechanics, setNearbyMechanics] = useState([]);

  useEffect(() => {
    if (!google || !addressInputRef.current || autocompleteRef.current) return;
    autocompleteRef.current = new google.maps.places.Autocomplete(addressInputRef.current, {
      fields: ["formatted_address", "geometry", "name"]
    });
    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry?.location) return;
      applyLocation({
        address: place.formatted_address || place.name || "",
        latitude: String(place.geometry.location.lat()),
        longitude: String(place.geometry.location.lng())
      });
    });
  }, [google, step]);

  const applyLocation = async (loc) => {
    setForm(f => ({ ...f, ...loc }));
    const mechanics = await searchNearbyMechanics({ latitude: loc.latitude, longitude: loc.longitude, radiusKm: 15 });
    setNearbyMechanics(mechanics);
  };

  const useCurrentLocation = async () => {
    try {
      setLocating(true);
      const loc = await getCurrentBrowserLocation();
      const resolved = await reverseGeocodeCoordinates(loc);
      await applyLocation(resolved);
      toast.success("Location Verified");
    } catch (e) {
      toast.error("Location Access Denied");
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent("/booking")}`);
      return;
    }
    setSubmitting(true);
    try {
      const res = await createBooking({
        ...form,
        location: { address: form.address, latitude: Number(form.latitude), longitude: Number(form.longitude) },
        problemDescription: form.description
      });
      router.push(`/booking/${res.booking._id}`);
    } catch (e) {
      toast.error("Network Congestion. Please retry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-16 lg:grid-cols-[1fr_450px]">
      <div className="space-y-12">
        {/* Elite Progress Indicator */}
        <div className="flex items-center gap-6 px-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-1 flex flex-col gap-4 group">
              <div className={`h-[2px] w-full rounded-full transition-all duration-1000 ${step >= i ? "bg-primary shadow-[0_0_20px_#faff5d]" : "bg-white/5"}`} />
              <div className="flex justify-between items-center">
                <span className={`text-[9px] font-black uppercase tracking-[0.4em] transition-colors ${step === i ? "text-primary" : "text-white/20"}`}>
                  Phase 0{i}
                </span>
                {step > i && <span className="text-primary text-[10px]">✓</span>}
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...slideTransition} className="space-y-10">
              <div className="space-y-4">
                <h2 className="font-display text-5xl font-black text-white tracking-tighter leading-none">Confirm <br/><span className="text-gradient-gold italic">Geopoint.</span></h2>
                <p className="text-white/30 text-lg font-light tracking-wide max-w-md">Our network requires high-precision coordinates for elite responder dispatch.</p>
              </div>

              <div className="relative group overflow-hidden rounded-[32px] border border-white/5 bg-white/[0.02]">
                <input
                  ref={addressInputRef}
                  className="w-full pl-16 pr-32 h-24 text-lg bg-transparent border-none focus:ring-0 text-white placeholder:text-white/10"
                  placeholder="Street, Landmark or City..."
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                />
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary">
                   <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <button 
                  onClick={useCurrentLocation}
                  disabled={locating}
                  className="absolute right-6 top-1/2 -translate-y-1/2 h-12 px-6 rounded-2xl bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform"
                >
                  {locating ? "Scanning..." : "GPS Uplink"}
                </button>
              </div>

              <MapPanel 
                heightClass="h-[450px] sm:h-[550px]"
                interactive 
                onLocationSelect={loc => applyLocation(loc)}
                customerLocation={form.latitude ? { latitude: form.latitude, longitude: form.longitude } : null}
                nearbyMechanics={nearbyMechanics}
              />

              <button 
                onClick={() => form.latitude ? setStep(2) : toast.error("Coordinate Lock Required")} 
                className="btn-primary w-full !py-8 text-xs font-black uppercase tracking-[0.5em]"
              >
                Establish Mission Point →
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...slideTransition} className="space-y-12">
              <div className="space-y-4">
                <h2 className="font-display text-5xl font-black text-white tracking-tighter leading-none">Service <br/><span className="text-gradient-gold italic">Profile.</span></h2>
                <p className="text-white/30 text-lg font-light tracking-wide max-w-md">Classify the asset and incident nature for tactical response.</p>
              </div>

              <div className="space-y-10">
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50 ml-1">Asset Category</label>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {vehicleTypes.map(v => (
                      <button
                        key={v}
                        onClick={() => setForm({ ...form, vehicleType: v })}
                        className={`h-20 rounded-[28px] border text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                          form.vehicleType === v ? "border-primary bg-primary/10 text-primary shadow-[0_15px_40px_rgba(250,255,93,0.15)]" : "border-white/5 bg-white/[0.02] text-white/30 hover:bg-white/[0.05]"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50 ml-1">Incident Classification</label>
                  <div className="grid grid-cols-2 gap-4">
                    {issueTypes.map(issue => (
                      <button
                        key={issue.id}
                        onClick={() => setForm({ ...form, issueType: issue.id })}
                        className={`flex flex-col items-center justify-center gap-6 p-10 rounded-[40px] border transition-all duration-700 group relative overflow-hidden ${
                          form.issueType === issue.id ? "border-primary bg-primary/5 shadow-2xl" : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03]"
                        }`}
                      >
                        <span className="text-4xl transition-transform duration-700 group-hover:scale-125 group-hover:rotate-6">{issue.icon}</span>
                        <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${form.issueType === issue.id ? "text-white" : "text-white/20"}`}>{issue.label}</span>
                        
                        {form.issueType === issue.id && (
                          <motion.div layoutId="activeIssue" className="absolute bottom-6 h-1 w-1 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-6">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Phase 01</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-[2]">Finalize Uplink →</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...slideTransition} className="space-y-12">
              <div className="space-y-4">
                <h2 className="font-display text-5xl font-black text-white tracking-tighter leading-none">Deployment <br/><span className="text-gradient-gold italic">Briefing.</span></h2>
                <p className="text-white/30 text-lg font-light tracking-wide max-w-md">Final tactical notes for the responding expert team.</p>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50 ml-1">Service Notes</label>
                <textarea
                  className="input-field w-full min-h-[250px] !p-10 !text-xl !leading-relaxed"
                  placeholder="Describe situational specifics..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="premium-panel !rounded-[48px] border-primary/20 bg-primary/5 p-12 relative overflow-hidden group">
                 {/* Decorative Pulse */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] animate-pulse" />
                
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-center border-b border-white/5 pb-8">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Mission Quote</p>
                    <div className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Elite Dispatch</span>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-4">
                    <p className="text-6xl font-black text-white tracking-tighter">₹{nearbyMechanics[0]?.priceEstimate || 1850}</p>
                    <p className="text-sm font-bold text-white/20 uppercase tracking-[0.2em]">Estimate</p>
                  </div>

                  <div className="grid grid-cols-2 gap-10 pt-4">
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Tactical ETA</p>
                      <p className="text-lg font-black text-white tracking-tight">~{nearbyMechanics[0]?.etaMinutes || 14} MINS</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Asset Class</p>
                      <p className="text-lg font-black text-white tracking-tight">{form.vehicleType}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-6">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">Phase 02</button>
                <button 
                  onClick={handleSubmit} 
                  disabled={submitting}
                  className="btn-primary flex-[3] !py-8 text-sm font-black uppercase tracking-[0.6em]"
                >
                  {submitting ? "Initiating Uplink..." : "Launch Rescue"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* High-Fidelity Network Context */}
      <div className="hidden lg:block space-y-10">
        <div className="sticky top-40 space-y-10">
          <div className="premium-panel !rounded-[48px] p-12 bg-[#080808]">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Elite Force Nearby</h4>
            </div>
            
            <div className="space-y-12">
              {nearbyMechanics.length > 0 ? (
                nearbyMechanics.slice(0, 3).map((m, idx) => (
                  <motion.div 
                    key={m._id} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className="group flex gap-8 items-start relative"
                  >
                    <div className="relative">
                      <div className="h-16 w-16 rounded-[24px] bg-white/[0.03] border border-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                        {idx === 0 ? '🏆' : '🎖️'}
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-4 border-black" />
                    </div>
                    
                    <div className="flex-1 border-b border-white/5 pb-10 group-last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-lg font-bold text-white tracking-tight">{m.name}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-primary italic">{m.averageRating || '5.0'}</span>
                           <span className="text-primary text-[10px]">★</span>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-4">Professional Response Team</p>
                      <div className="flex gap-3">
                        {m.skills?.slice(0,2).map(s => (
                          <span key={s} className="text-[8px] font-black uppercase tracking-[0.4em] px-3 py-1.5 rounded-lg bg-white/5 text-white/40 border border-white/5">{s}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center space-y-8">
                  <div className="h-12 w-12 border-2 border-white/5 border-t-white/20 rounded-full animate-spin mx-auto" />
                  <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Scanning Grid...</p>
                </div>
              )}
            </div>
          </div>

          <div className="premium-panel !rounded-[48px] p-12 bg-gradient-to-br from-white/[0.02] to-transparent border-white/[0.05]">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 italic">Security Protocol</h4>
            <p className="text-sm leading-8 text-white/30 font-light tracking-wide">
              Every rescue mission is end-to-end encrypted. We prioritize client safety and vehicle integrity through world-class logistics and verified expert response.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
