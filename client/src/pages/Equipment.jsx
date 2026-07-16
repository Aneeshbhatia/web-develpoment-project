import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  getEquipment,
  deleteEquipment,
  changeEquipmentStatus,
} from "../services/equipmentService";

import {
  Tractor,
  Search,
  Plus,
  RefreshCcw,
  Trash2,
  Pencil,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Radio,
} from "lucide-react";

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

const STATUS_STYLE = {
  Running: { color: "#6BFFB8", icon: CheckCircle, label: "RUNNING" },
  Maintenance: { color: "#FFC163", icon: AlertTriangle, label: "MAINTENANCE" },
  Offline: { color: "#FF6B6B", icon: XCircle, label: "OFFLINE" },
};

const Equipment = () => {
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadEquipment = async () => {
    try {
      const response = await getEquipment();

      if (response.success) {
        setEquipment(response.equipment);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  // Derived, not stored in state — avoids an extra render per keystroke
  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase()) ||
        item.farm?.farmName
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [search, equipment]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this equipment?"
    );

    if (!confirmDelete) return;

    try {
      await deleteEquipment(id);
      loadEquipment();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const handleStatus = async (id, status) => {
    let nextStatus = "Running";

    if (status === "Running") {
      nextStatus = "Maintenance";
    } else if (status === "Maintenance") {
      nextStatus = "Offline";
    } else {
      nextStatus = "Running";
    }

    try {
      await changeEquipmentStatus(id, nextStatus);
      loadEquipment();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="hud-root flex flex-col justify-center items-center h-[80vh] gap-3" style={{ backgroundColor: "#05100C" }}>
          <HudStyles />
          <Radio size={22} className="text-[#6BFFB8] hud-blink" />
          <h1 className="hud-mono text-lg text-[#6BFFB8] tracking-widest uppercase">
            Loading Equipment...
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

        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">

          <div>
            <h1 className="hud-display text-4xl font-semibold text-[#EAF5EE]">
              Equipment
            </h1>
            <p className="text-[#6E877B] mt-2 hud-mono text-sm">
              Monitor and control all irrigation hardware.
            </p>
          </div>

          <button
            onClick={() => navigate("/add-equipment")}
            className="bg-[#6BFFB8]/15 hover:bg-[#6BFFB8]/25 text-[#6BFFB8] ring-1 ring-[#6BFFB8]/40 px-6 py-3 rounded-xl transition flex items-center gap-2 hud-display font-medium"
          >
            <Plus size={20} />
            Add Equipment
          </button>

        </div>

        {/* Search */}

        <div className="relative mb-8">
          <Search
            className="absolute left-4 top-4 text-[#5B6B63]"
            size={20}
          />
          <input
            type="text"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="hud-input w-full rounded-xl p-4 pl-12 transition"
          />
        </div>

        {/* Statistics */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="hud-panel rounded-2xl p-6 transition">
            <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Total Equipment</p>
            <h2 className="hud-mono text-4xl font-semibold text-[#EAF5EE] mt-2">
              {equipment.length}
            </h2>
          </div>

          <div className="hud-panel rounded-2xl p-6 transition">
            <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Running</p>
            <h2 className="hud-mono text-4xl font-semibold text-[#6BFFB8] mt-2">
              {equipment.filter((item) => item.status === "Running").length}
            </h2>
          </div>

          <div className="hud-panel rounded-2xl p-6 transition">
            <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Maintenance</p>
            <h2 className="hud-mono text-4xl font-semibold text-[#FFC163] mt-2">
              {equipment.filter((item) => item.status === "Maintenance").length}
            </h2>
          </div>

          <div className="hud-panel rounded-2xl p-6 transition">
            <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Offline</p>
            <h2 className="hud-mono text-4xl font-semibold text-[#FF6B6B] mt-2">
              {equipment.filter((item) => item.status === "Offline").length}
            </h2>
          </div>

        </div>

        {/* Equipment Cards */}

        {filteredEquipment.length === 0 ? (

          <div className="hud-panel rounded-3xl p-12 text-center">
            <Tractor size={56} className="mx-auto text-[#6BFFB8]/60 mb-4" />
            <h2 className="hud-display text-3xl font-semibold text-[#EAF5EE]">
              No Equipment Found
            </h2>
            <p className="text-[#6E877B] mt-3 hud-mono text-sm">
              Add your first unit to start monitoring.
            </p>
          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {filteredEquipment.map((item) => {
              const statusInfo = STATUS_STYLE[item.status] ?? STATUS_STYLE.Offline;
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={item._id}
                  className="hud-panel rounded-3xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
                >

                  {/* Header */}

                  <div
                    className="p-6 border-b border-[#1C2B24]"
                    style={{ background: "linear-gradient(135deg, #071C15 0%, #0C1713 100%)" }}
                  >

                    <div className="flex justify-between items-center">
                      <Tractor size={38} className="text-[#6BFFB8]" />
                      <StatusIcon size={26} style={{ color: statusInfo.color }} />
                    </div>

                    <h2 className="hud-display text-2xl font-semibold mt-5 text-[#EAF5EE]">
                      {item.name}
                    </h2>

                    <div className="mt-3">
                      <span className="bg-white/5 ring-1 ring-white/10 px-3 py-1 rounded-full text-xs hud-mono text-[#B7C7BE]">
                        {item.type}
                      </span>
                    </div>

                  </div>

                  {/* Body */}

                  <div className="p-6 space-y-4 text-[#B7C7BE] text-sm">

                    <p>
                      <strong className="text-[#EAF5EE]">Farm:</strong>{" "}
                      {item.farm?.farmName}
                    </p>

                    <p className="flex items-center gap-2">
                      <strong className="text-[#EAF5EE]">Status:</strong>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold hud-mono ring-1"
                        style={{
                          color: statusInfo.color,
                          backgroundColor: `${statusInfo.color}1A`,
                          borderColor: `${statusInfo.color}4D`,
                        }}
                      >
                        {statusInfo.label}
                      </span>
                    </p>

                    <p>
                      <strong className="text-[#EAF5EE]">Last Service:</strong>{" "}
                      <span className="hud-mono">
                        {new Date(item.lastService).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </p>

                    {/* Buttons */}

                    <div className="grid grid-cols-3 gap-3 pt-4">

                      <button
                        onClick={() => navigate(`/edit-equipment/${item._id}`)}
                        className="bg-[#FFC163]/10 hover:bg-[#FFC163]/20 text-[#FFC163] ring-1 ring-[#FFC163]/30 py-3 rounded-xl flex justify-center items-center transition"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleStatus(item._id, item.status)}
                        className="bg-[#4FD1FF]/10 hover:bg-[#4FD1FF]/20 text-[#4FD1FF] ring-1 ring-[#4FD1FF]/30 py-3 rounded-xl flex justify-center items-center transition"
                        title="Change Status"
                      >
                        <RefreshCcw size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-[#FF6B6B] ring-1 ring-[#FF6B6B]/30 py-3 rounded-xl flex justify-center items-center transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}
      </div>
    </DashboardLayout>
  );
};

export default Equipment;