import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  getEquipment,
  deleteEquipment,
  changeEquipmentStatus,
} from "../services/equipmentService";

import {
  getSensors,
  deleteSensor,
  changeSensorStatus,
} from "../services/sensorService";

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
  Cpu,
} from "lucide-react";

const HudStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .hud-root{
      font-family:'Inter',sans-serif;
    }

    .hud-display{
      font-family:'Space Grotesk',sans-serif;
    }

    .hud-mono{
      font-family:'JetBrains Mono',monospace;
      letter-spacing:.02em;
    }

    .hud-panel{
      background:rgba(12,23,19,.75);
      border:1px solid #1C2B24;
      backdrop-filter:blur(6px);
    }

    .hud-panel:hover{
      border-color:rgba(107,255,184,.35);
      box-shadow:0 0 0 1px rgba(107,255,184,.08),
                 0 12px 32px -12px rgba(0,0,0,.6);
    }

    .hud-input{
      background:#0C1713;
      border:1px solid #1C2B24;
      color:#EAF5EE;
    }

    .hud-input::placeholder{
      color:#5B6B63;
    }

    .hud-input:focus{
      outline:none;
      border-color:#6BFFB8;
      box-shadow:0 0 0 1px rgba(107,255,184,.4);
    }

    .tab-active{
      background:#6BFFB8;
      color:#05100C;
    }

    .tab-inactive{
      background:#0C1713;
      color:#A5B8AE;
      border:1px solid #1C2B24;
    }

    @keyframes hud-blink{
      0%,100%{opacity:1;}
      50%{opacity:.25;}
    }

    .hud-blink{
      animation:hud-blink 1.8s ease-in-out infinite;
    }
  `}</style>
);

const STATUS_STYLE = {
  Running: {
    color: "#6BFFB8",
    icon: CheckCircle,
    label: "RUNNING",
  },

  Maintenance: {
    color: "#FFC163",
    icon: AlertTriangle,
    label: "MAINTENANCE",
  },

  Offline: {
    color: "#FF6B6B",
    icon: XCircle,
    label: "OFFLINE",
  },

  Active: {
    color: "#6BFFB8",
    icon: CheckCircle,
    label: "ACTIVE",
  },

  Inactive: {
    color: "#FF6B6B",
    icon: XCircle,
    label: "INACTIVE",
  },

  Calibrating: {
    color: "#FFC163",
    icon: AlertTriangle,
    label: "CALIBRATING",
  },
};

const Equipment = () => {
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("equipment");

  // =============================
  // Load Equipment
  // =============================
  const loadEquipment = async () => {
    try {
      const response = await getEquipment();

      if (response.success) {
        setEquipment(response.equipment);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to load equipment");
    }
  };

  // =============================
  // Load Sensors
  // =============================
  const loadSensors = async () => {
    try {
      const response = await getSensors();

      if (response.success) {
        setSensors(response.sensors);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to load sensors");
    }
  };

  // =============================
  // Refresh Everything
  // =============================
  const refreshData = async () => {
    setLoading(true);

    await Promise.all([
      loadEquipment(),
      loadSensors(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

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
  }, [equipment, search]);

  const filteredSensors = useMemo(() => {
    return sensors.filter((sensor) => {
      return (
        sensor.name?.toLowerCase().includes(search.toLowerCase()) ||
        sensor.type?.toLowerCase().includes(search.toLowerCase()) ||
        sensor.farm?.farmName
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [sensors, search]);
    // =============================
  // Delete Equipment
  // =============================
  const handleDeleteEquipment = async (id) => {
    if (!window.confirm("Delete this equipment?")) return;

    try {
      await deleteEquipment(id);
      await refreshData();
    } catch (err) {
      console.log(err);
      alert("Failed to delete equipment");
    }
  };

  // =============================
  // Delete Sensor
  // =============================
  const handleDeleteSensor = async (id) => {
    if (!window.confirm("Delete this sensor?")) return;

    try {
      await deleteSensor(id);
      await refreshData();
    } catch (err) {
      console.log(err);
      alert("Failed to delete sensor");
    }
  };

  // =============================
  // Update Equipment Status
  // =============================
  const handleEquipmentStatus = async (id, status) => {
    let nextStatus = "Running";

    if (status === "Running") {
      nextStatus = "Maintenance";
    } else if (status === "Maintenance") {
      nextStatus = "Offline";
    } else if (status === "Offline") {
      nextStatus = "Running";
    }

    try {
      await changeEquipmentStatus(id, nextStatus);
      await refreshData();
    } catch (err) {
      console.log(err);
      alert("Failed to update equipment status");
    }
  };

  // =============================
  // Update Sensor Status
  // =============================
  const handleSensorStatus = async (id, status) => {
    let nextStatus = "Active";

    if (status === "Active") {
      nextStatus = "Calibrating";
    } else if (status === "Calibrating") {
      nextStatus = "Inactive";
    } else if (status === "Inactive") {
      nextStatus = "Active";
    }

    try {
      await changeSensorStatus(id, nextStatus);
      await refreshData();
    } catch (err) {
      console.log(err);
      alert("Failed to update sensor status");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="hud-root min-h-screen bg-[#05100C] flex items-center justify-center">
          <HudStyles />

          <div className="text-center">
            <div className="hud-blink text-2xl text-[#6BFFB8] font-bold">
              Loading Devices...
            </div>

            <p className="text-gray-400 mt-4">
              Fetching equipment and smart sensors...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div
        className="hud-root min-h-screen p-8"
        style={{ backgroundColor: "#05100C" }}
      >
        <HudStyles />

        {/* ========================= */}
        {/* Header */}
        {/* ========================= */}

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">

          <div>
            <h1 className="hud-display text-4xl font-bold text-white">
              Equipment Management
            </h1>

            <p className="text-[#6E877B] mt-2">
              Manage irrigation equipment and installed smart sensors.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">

            <button
              onClick={() => navigate("/add-equipment")}
              className="bg-green-600 hover:bg-green-700
              text-white px-6 py-3 rounded-xl
              flex items-center gap-2 transition"
            >
              <Plus size={20} />
              Add Equipment
            </button>

            <button
              onClick={() => navigate("/sensors")}
              className="bg-blue-600 hover:bg-blue-700
              text-white px-6 py-3 rounded-xl
              flex items-center gap-2 transition"
            >
              <Cpu size={20} />
              Browse Sensors
            </button>

          </div>

        </div>

        {/* ========================= */}
        {/* Tabs */}
        {/* ========================= */}

        <div className="flex gap-4 mb-8">

          <button
            onClick={() => setActiveTab("equipment")}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === "equipment"
                ? "tab-active"
                : "tab-inactive"
            }`}
          >
            🚜 Equipment ({equipment.length})
          </button>

          <button
            onClick={() => setActiveTab("sensors")}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === "sensors"
                ? "tab-active"
                : "tab-inactive"
            }`}
          >
            📡 Installed Sensors ({sensors.length})
          </button>

        </div>

        {/* ========================= */}
        {/* Search */}
        {/* ========================= */}

        <div className="relative mb-10">

          <Search
            size={20}
            className="absolute left-4 top-4 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === "equipment"
                ? "Search equipment..."
                : "Search installed sensors..."
            }
            className="hud-input rounded-xl w-full p-4 pl-12"
          />

        </div>

        {/* ========================= */}
        {/* Equipment Section */}
        {/* ========================= */}

        {activeTab === "equipment" ? (
          filteredEquipment.length === 0 ? (
            <div className="hud-panel rounded-3xl p-12 text-center">
              <Tractor
                size={70}
                className="mx-auto text-[#6BFFB8]/70 mb-5"
              />

              <h2 className="text-3xl text-white font-bold">
                No Equipment Found
              </h2>

              <p className="text-gray-400 mt-3">
                Add your first irrigation equipment to get started.
              </p>

              <button
                onClick={() => navigate("/add-equipment")}
                className="mt-8 bg-green-600 hover:bg-green-700
                text-white px-6 py-3 rounded-xl transition"
              >
                Add Equipment
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredEquipment.map((item) => {
                const statusInfo =
                  STATUS_STYLE[item.status] ??
                  STATUS_STYLE.Offline;

                const StatusIcon = statusInfo.icon;

                const image =
                  item.image ||
                  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900";

                return (
                  <div
                    key={item._id}
                    className="hud-panel rounded-3xl overflow-hidden
                    hover:-translate-y-1 transition duration-300"
                  >
                    <img
                      src={image}
                      alt={item.name}
                      className="w-full h-56 object-cover"
                    />

                    <div className="p-6">

                      <div className="flex justify-between items-center">

                        <h2 className="text-2xl font-bold text-white">
                          {item.name}
                        </h2>

                        <StatusIcon
                          size={24}
                          style={{
                            color: statusInfo.color,
                          }}
                        />

                      </div>

                      <span
                        className="inline-block mt-4
                        bg-white/5
                        text-gray-300
                        px-3 py-1
                        rounded-full text-sm"
                      >
                        {item.type}
                      </span>

                      <div className="mt-5 space-y-3 text-gray-300">

                        <p>
                          <strong className="text-white">
                            Farm:
                          </strong>{" "}
                          {item.farm?.farmName || "Unassigned"}
                        </p>

                        <p>
                          <strong className="text-white">
                            Status:
                          </strong>{" "}
                          <span
                            style={{
                              color: statusInfo.color,
                            }}
                          >
                            {item.status}
                          </span>
                        </p>

                        <p>
                          <strong className="text-white">
                            Last Service:
                          </strong>{" "}
                          {item.lastService
                            ? new Date(
                                item.lastService
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>

                      </div>

                      <div className="grid grid-cols-3 gap-3 mt-7">

                        <button
                          onClick={() =>
                            navigate(
                              `/edit-equipment/${item._id}`
                            )
                          }
                          className="bg-yellow-500/10
                          hover:bg-yellow-500/20
                          text-yellow-400
                          rounded-xl
                          py-3
                          transition"
                        >
                          <Pencil
                            size={18}
                            className="mx-auto"
                          />
                        </button>

                        <button
                          onClick={() =>
                            handleEquipmentStatus(
                              item._id,
                              item.status
                            )
                          }
                          className="bg-sky-500/10
                          hover:bg-sky-500/20
                          text-sky-400
                          rounded-xl
                          py-3
                          transition"
                        >
                          <RefreshCcw
                            size={18}
                            className="mx-auto"
                          />
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteEquipment(item._id)
                          }
                          className="bg-red-500/10
                          hover:bg-red-500/20
                          text-red-400
                          rounded-xl
                          py-3
                          transition"
                        >
                          <Trash2
                            size={18}
                            className="mx-auto"
                          />
                        </button>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          filteredSensors.length === 0 ? (
            <div className="hud-panel rounded-3xl p-12 text-center">
              <Radio
                size={70}
                className="mx-auto text-[#4FD1FF]/70 mb-5"
              />

              <h2 className="text-3xl font-bold text-white">
                No Installed Sensors
              </h2>

              <p className="text-gray-400 mt-3">
                Install your first smart sensor to monitor your farm.
              </p>

              <button
                onClick={() => navigate("/sensors")}
                className="mt-8 bg-blue-600 hover:bg-blue-700
                text-white px-6 py-3 rounded-xl transition"
              >
                Browse Sensors
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredSensors.map((sensor) => {
                const statusInfo =
                  STATUS_STYLE[sensor.status] ??
                  STATUS_STYLE.Inactive;

                const StatusIcon = statusInfo.icon;

                const image =
                  sensor.image ||
                  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900";

                return (
                  <div
                    key={sensor._id}
                    className="hud-panel rounded-3xl overflow-hidden hover:-translate-y-1 transition duration-300"
                  >
                    <img
                      src={image}
                      alt={sensor.name}
                      className="w-full h-56 object-cover"
                    />

                    <div className="p-6">

                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">
                          {sensor.name}
                        </h2>

                        <StatusIcon
                          size={24}
                          style={{
                            color: statusInfo.color,
                          }}
                        />
                      </div>

                      <span
                        className="inline-block mt-4 px-3 py-1
                        rounded-full bg-white/5
                        text-sm text-gray-300"
                      >
                        {sensor.type}
                      </span>

                      <div className="mt-5 space-y-3 text-gray-300">

                        <p>
                          <strong className="text-white">
                            Farm:
                          </strong>{" "}
                          {sensor.farm?.farmName ||
                            sensor.farm?.name ||
                            "Unassigned"}
                        </p>

                        <p>
                          <strong className="text-white">
                            Location:
                          </strong>{" "}
                          {sensor.location}
                        </p>

                        <p>
                          <strong className="text-white">
                            Status:
                          </strong>{" "}
                          <span
                            style={{
                              color: statusInfo.color,
                            }}
                          >
                            {sensor.status}
                          </span>
                        </p>

                        <div>
                          <strong className="text-white">
                            Battery
                          </strong>

                          <div className="w-full h-3 rounded-full bg-[#1B2A22] mt-2 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                sensor.batteryLevel >= 60
                                  ? "bg-green-500"
                                  : sensor.batteryLevel >= 30
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${sensor.batteryLevel || 0}%`,
                              }}
                            />
                          </div>

                          <p
                            className={`mt-1 text-sm ${
                              sensor.batteryLevel >= 60
                                ? "text-green-400"
                                : sensor.batteryLevel >= 30
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {sensor.batteryLevel || 0}%
                          </p>
                        </div>

                        <p>
                          <strong className="text-white">
                            Installed:
                          </strong>{" "}
                          {sensor.installedAt
                            ? new Date(
                                sensor.installedAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>

                      </div>

                      <div className="grid grid-cols-3 gap-3 mt-7">

                        <button
                          onClick={() =>
                            navigate(`/edit-sensor/${sensor._id}`)
                          }
                          className="bg-yellow-500/10
                          hover:bg-yellow-500/20
                          text-yellow-400
                          rounded-xl py-3 transition"
                        >
                          <Pencil
                            size={18}
                            className="mx-auto"
                          />
                        </button>

                        <button
                          onClick={() =>
                            handleSensorStatus(
                              sensor._id,
                              sensor.status
                            )
                          }
                          className="bg-sky-500/10
                          hover:bg-sky-500/20
                          text-sky-400
                          rounded-xl py-3 transition"
                        >
                          <RefreshCcw
                            size={18}
                            className="mx-auto"
                          />
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteSensor(sensor._id)
                          }
                          className="bg-red-500/10
                          hover:bg-red-500/20
                          text-red-400
                          rounded-xl py-3 transition"
                        >
                          <Trash2
                            size={18}
                            className="mx-auto"
                          />
                        </button>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

      </div>
    </DashboardLayout>
  );
};

export default Equipment;