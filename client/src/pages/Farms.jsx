import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFarms, deleteFarm } from "../services/farmService";

import {
  MapPin,
  Sprout,
  Mountain,
  Ruler,
  User,
  Pencil,
  Trash2,
  Plus,
  Search,
  CloudSun,
  Tractor,
  Radio,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

const HudStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
    .hud-root { font-family: 'Inter', sans-serif; }
    .hud-display { font-family: 'Space Grotesk', sans-serif; }
    .hud-mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.02em; }

    .hud-panel {
      background: rgba(12,23,19,0.75);
      border: 1px solid #1C2B24;
      backdrop-filter: blur(6px);
    }
    .hud-panel:hover {
      border-color: rgba(107,255,184,0.35);
      box-shadow: 0 0 0 1px rgba(107,255,184,0.08), 0 12px 32px -12px rgba(0,0,0,0.6);
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

    @keyframes hud-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.25; }
    }
    .hud-blink { animation: hud-blink 1.8s ease-in-out infinite; }
  `}</style>
);

const Farms = () => {
  const navigate = useNavigate();

  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ==========================
  // Load Farms
  // ==========================

  const loadFarms = async () => {
    try {
      const response = await getFarms();

      if (response.success) {
        setFarms(response.farms);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  // ==========================
  // Search (derived, not stored in state)
  // ==========================

  const filteredFarms = useMemo(() => {
    return farms.filter(
      (farm) =>
        farm.farmName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        farm.location
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        farm.cropType
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [search, farms]);

  // ==========================
  // Delete
  // ==========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this farm?"
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteFarm(id);

      alert(response.message);

      loadFarms();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="hud-root flex flex-col justify-center items-center h-[80vh] gap-3" style={{ backgroundColor: "#05100C" }}>
          <HudStyles />
          <Radio size={22} className="text-[#6BFFB8] hud-blink" />
          <h1 className="hud-mono text-lg text-[#6BFFB8] tracking-widest uppercase">
            Loading Farms...
          </h1>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="hud-root -m-8 p-8 min-h-screen" style={{ backgroundColor: "#05100C" }}>
        <HudStyles />

        {/* Header */}

        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">

          <div>
            <h1 className="hud-display text-4xl font-semibold text-[#EAF5EE]">
              My Farms
            </h1>
            <p className="text-[#6E877B] mt-2 hud-mono text-sm">
              Manage all registered plots from one console.
            </p>
          </div>

          <button
            onClick={() => navigate("/add-farm")}
            className="flex items-center gap-2 bg-[#6BFFB8]/15 hover:bg-[#6BFFB8]/25 text-[#6BFFB8] ring-1 ring-[#6BFFB8]/40 px-6 py-3 rounded-xl transition hud-display font-medium"
          >
            <Plus size={20} />
            Add Farm
          </button>

        </div>

        {/* Search */}

        <div className="relative mb-8">
          <Search
            size={20}
            className="absolute left-4 top-4 text-[#5B6B63]"
          />
          <input
            type="text"
            placeholder="Search by farm, crop or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="hud-input w-full rounded-xl p-4 pl-12 transition"
          />
        </div>

        {/* Statistics */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="hud-panel rounded-2xl p-6 transition">
            <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Total Farms</p>
            <h2 className="hud-mono text-4xl font-semibold text-[#6BFFB8] mt-2">
              {farms.length}
            </h2>
          </div>

          <div className="hud-panel rounded-2xl p-6 transition">
            <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Total Area</p>
            <h2 className="hud-mono text-4xl font-semibold text-[#4FD1FF] mt-2">
              {farms.reduce((sum, farm) => sum + farm.area, 0)}{" "}
              <span className="text-lg">Acres</span>
            </h2>
          </div>

          <div className="hud-panel rounded-2xl p-6 transition">
            <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Crop Types</p>
            <h2 className="hud-mono text-4xl font-semibold text-[#FFC163] mt-2">
              {new Set(farms.map((farm) => farm.cropType)).size}
            </h2>
          </div>

          <div className="hud-panel rounded-2xl p-6 transition">
            <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Equipment</p>
            <h2 className="hud-mono text-4xl font-semibold text-[#EAF5EE] mt-2 flex items-center gap-2">
              <Tractor size={28} className="text-[#6BFFB8]" />
              3
            </h2>
          </div>

        </div>

        {/* Empty State */}

        {filteredFarms.length === 0 ? (

          <div className="hud-panel rounded-3xl p-12 text-center">
            <Sprout size={56} className="mx-auto text-[#6BFFB8]/60" />
            <h2 className="hud-display text-3xl font-semibold mt-5 text-[#EAF5EE]">
              No Farms Found
            </h2>
            <p className="text-[#6E877B] mt-3 hud-mono text-sm">
              Try another keyword, or register a new farm.
            </p>
          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {filteredFarms.map((farm) => (

              <div
                key={farm._id}
                className="hud-panel rounded-3xl overflow-hidden transition"
              >

                {/* Card Header */}

                <div className="p-6 border-b border-[#1C2B24]" style={{ background: "linear-gradient(135deg, #071C15 0%, #0C1713 100%)" }}>
                  <h2 className="hud-display text-2xl font-semibold text-[#EAF5EE]">
                    {farm.farmName}
                  </h2>
                  <p className="flex items-center gap-2 mt-2 text-[#6BFFB8] hud-mono text-sm">
                    <MapPin size={16} />
                    {farm.location}
                  </p>
                </div>

                {/* Card Body */}

                <div className="p-6">

                  <div className="flex flex-wrap gap-2 mb-5">

                    <span className="bg-[#6BFFB8]/10 text-[#6BFFB8] ring-1 ring-[#6BFFB8]/30 px-3 py-1 rounded-full flex items-center gap-1 text-xs hud-mono">
                      <Sprout size={13} />
                      {farm.cropType}
                    </span>

                    <span className="bg-[#FFC163]/10 text-[#FFC163] ring-1 ring-[#FFC163]/30 px-3 py-1 rounded-full flex items-center gap-1 text-xs hud-mono">
                      <Mountain size={13} />
                      {farm.soilType}
                    </span>

                  </div>

                  <div className="space-y-3 text-[#B7C7BE] text-sm">

                    <p className="flex items-center gap-2">
                      <Ruler size={16} className="text-[#6E877B]" />
                      <strong className="text-[#EAF5EE]">Area:</strong>
                      <span className="hud-mono">{farm.area} Acres</span>
                    </p>

                    <p className="flex items-center gap-2">
                      <User size={16} className="text-[#6E877B]" />
                      <strong className="text-[#EAF5EE]">Farmer:</strong>
                      {farm.farmer?.name || "Unknown"}
                    </p>

                  </div>

                  {/* Action Buttons */}

                  <div className="grid grid-cols-3 gap-3 mt-6">

                    <button
                      onClick={() => navigate(`/recommendation/${farm._id}`)}
                      className="bg-[#6BFFB8]/10 hover:bg-[#6BFFB8]/20 text-[#6BFFB8] ring-1 ring-[#6BFFB8]/30 py-2 rounded-lg flex items-center justify-center transition"
                    >
                      <CloudSun size={18} />
                    </button>

                    <button
                      onClick={() => navigate(`/edit-farm/${farm._id}`)}
                      className="bg-[#4FD1FF]/10 hover:bg-[#4FD1FF]/20 text-[#4FD1FF] ring-1 ring-[#4FD1FF]/30 py-2 rounded-lg flex items-center justify-center transition"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(farm._id)}
                      className="bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-[#FF6B6B] ring-1 ring-[#FF6B6B]/30 py-2 rounded-lg flex items-center justify-center transition"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}
      </div>
    </DashboardLayout>
  );

};

export default Farms;