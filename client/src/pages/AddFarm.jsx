import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addFarm } from "../services/farmService";
import { Sprout, MapPin, Ruler, Mountain, ArrowLeft } from "lucide-react";

const AddFarm = () => {
  const navigate = useNavigate();

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    farmer: user?.id || "",
    farmName: "",
    location: "",
    cropType: "",
    area: "",
    soilType: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await addFarm(formData);

      alert(data.message);

      navigate("/farms");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to add farm");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 hud-root"
      style={{ backgroundColor: "#05100C" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .hud-root { font-family: 'Inter', sans-serif; }
        .hud-display { font-family: 'Space Grotesk', sans-serif; }
        .hud-mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.02em; }

        .hud-grid-bg {
          background-image:
            linear-gradient(rgba(107,255,184,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(107,255,184,0.06) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        .hud-input {
          background: #0C1713;
          border: 1px solid #1C2B24;
          color: #EAF5EE;
        }
        .hud-input::placeholder { color: #5B6B63; }
        .hud-input:focus {
          outline: none;
          box-shadow: 0 0 0 1px rgba(107,255,184,0.4);
          border-color: rgba(107,255,184,0.4);
        }

        .hud-label {
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-size: 11px;
          color: #6E877B;
        }
      `}</style>

      <div className="hud-grid-bg absolute inset-0 pointer-events-none opacity-40" />

      <div className="relative w-full max-w-xl">

        <button
          onClick={() => navigate("/farms")}
          className="flex items-center gap-2 text-[#6E877B] hover:text-[#6BFFB8] transition mb-6 hud-mono text-sm"
        >
          <ArrowLeft size={16} />
          Back to Farms
        </button>

        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(12,23,19,0.85)",
            border: "1px solid #1C2B24",
            backdropFilter: "blur(6px)",
            boxShadow: "0 20px 60px -20px rgba(0,0,0,0.6)",
          }}
        >

          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#6BFFB8]/10 text-[#6BFFB8] p-3 rounded-xl ring-1 ring-[#6BFFB8]/30">
              <Sprout size={24} />
            </div>
            <div>
              <h2 className="hud-display text-2xl font-semibold text-[#EAF5EE]">
                Register New Farm
              </h2>
              <p className="hud-mono text-xs text-[#6E877B] mt-0.5">
                Add a plot to your monitoring console
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="hud-label block mb-2">Farm Name</label>
              <input
                type="text"
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                placeholder="e.g. North Field"
                className="hud-input w-full rounded-xl py-3 px-4 transition"
                required
              />
            </div>

            <div>
              <label className="hud-label block mb-2 flex items-center gap-1.5">
                <MapPin size={12} /> Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Palampur, Himachal Pradesh"
                className="hud-input w-full rounded-xl py-3 px-4 transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="hud-label block mb-2">Crop Type</label>
                <input
                  type="text"
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleChange}
                  placeholder="e.g. Wheat"
                  className="hud-input w-full rounded-xl py-3 px-4 transition"
                  required
                />
              </div>

              <div>
                <label className="hud-label block mb-2 flex items-center gap-1.5">
                  <Mountain size={12} /> Soil Type
                </label>
                <input
                  type="text"
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  placeholder="e.g. Loamy"
                  className="hud-input w-full rounded-xl py-3 px-4 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="hud-label block mb-2 flex items-center gap-1.5">
                <Ruler size={12} /> Area (Acres)
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. 4.5"
                className="hud-input w-full rounded-xl py-3 px-4 transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6BFFB8]/15 hover:bg-[#6BFFB8]/25 text-[#6BFFB8] ring-1 ring-[#6BFFB8]/40 py-3 rounded-xl text-lg font-semibold hud-display transition mt-2"
              style={{ textShadow: "0 0 12px rgba(107,255,184,0.35)" }}
            >
              Save Farm
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default AddFarm;