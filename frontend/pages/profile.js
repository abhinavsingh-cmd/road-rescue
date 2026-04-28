import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { hoverLift, staggerWrap, staggerItem } from "@/components/Motion";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("garage");
  const [vehicles, setVehicles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.vehicles) setVehicles(user.vehicles);
  }, [user]);

  const handleSaveGarage = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ vehicles });
      toast.success("Garage updated successfully");
    } catch (e) {
      toast.error("Failed to update garage");
    } finally {
      setIsSaving(false);
    }
  };

  const addVehicle = () => {
    setVehicles([...vehicles, { make: "", model: "", licensePlate: "", fuelType: "Petrol" }]);
  };

  const updateVehicle = (index, field, value) => {
    const newVehicles = [...vehicles];
    newVehicles[index][field] = value;
    setVehicles(newVehicles);
  };

  return (
    <ProtectedRoute>
      <MainLayout title="My Profile | Road Rescue">
        <section className="shell py-12 sm:py-20">
          <motion.div variants={staggerWrap} initial="hidden" animate="visible" className="grid gap-12 lg:grid-cols-[300px_1fr]">
            {/* Sidebar Navigation */}
            <motion.div variants={staggerItem} className="space-y-2">
              <div className="mb-8">
                <p className="kicker">Profile Settings</p>
                <h1 className="font-display text-3xl font-bold text-white mt-2">Account Hub</h1>
              </div>
              
              {["garage", "locations", "security"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                    activeTab === tab ? "bg-primary/10 border-primary/20 text-primary" : "bg-white/5 border-transparent text-white/40 hover:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </motion.div>

            {/* Main Content */}
            <motion.div variants={staggerItem} className="premium-panel p-8 sm:p-12 rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-xl min-h-[500px]">
              <AnimatePresence mode="wait">
                {activeTab === "garage" && (
                  <motion.div key="garage" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="flex justify-between items-center mb-10">
                      <div>
                        <h2 className="text-2xl font-bold text-white">The Garage</h2>
                        <p className="text-sm text-white/30 mt-1">Manage your vehicle fleet for rapid dispatch.</p>
                      </div>
                      <button onClick={addVehicle} className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/5 transition-all">+</button>
                    </div>

                    <div className="grid gap-6">
                      {vehicles.map((v, i) => (
                        <div key={i} className="grid gap-4 sm:grid-cols-4 p-6 rounded-3xl bg-white/5 border border-white/5">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-white/20 ml-1">Make</label>
                            <input className="input-field py-3" value={v.make} onChange={(e) => updateVehicle(i, "make", e.target.value)} placeholder="BMW" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-white/20 ml-1">Model</label>
                            <input className="input-field py-3" value={v.model} onChange={(e) => updateVehicle(i, "model", e.target.value)} placeholder="M4" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-white/20 ml-1">License</label>
                            <input className="input-field py-3" value={v.licensePlate} onChange={(e) => updateVehicle(i, "licensePlate", e.target.value)} placeholder="ABC 123" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-white/20 ml-1">Fuel</label>
                            <select className="input-field py-3" value={v.fuelType} onChange={(e) => updateVehicle(i, "fuelType", e.target.value)}>
                              <option>Petrol</option>
                              <option>Diesel</option>
                              <option>Electric</option>
                              <option>Hybrid</option>
                            </select>
                          </div>
                        </div>
                      ))}

                      {vehicles.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                          <p className="text-white/20 font-bold uppercase tracking-widest text-xs">Your garage is empty.</p>
                        </div>
                      )}
                    </div>

                    <motion.button
                      whileHover={hoverLift}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveGarage}
                      disabled={isSaving}
                      className="btn-primary mt-10 px-12 py-5 text-[10px] font-black uppercase tracking-widest"
                    >
                      {isSaving ? "Saving..." : "Update Fleet"}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </section>
      </MainLayout>
    </ProtectedRoute>
  );
}
