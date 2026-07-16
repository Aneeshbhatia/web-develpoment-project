import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getWeather } from "../services/weatherService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  CloudSun,
  Droplets,
  Tractor,
  Sprout,
  Wind,
  Thermometer,
  AlertTriangle,
  Power,
  CheckCircle2,
  Wrench,
  Gauge,
  Satellite,
  Radio,
} from "lucide-react";

// ---- Palette / tokens ---------------------------------------------------
// bg #05100C | panel #0C1713 | line #1C2B24
// mint #6BFFB8 | cyan #4FD1FF | amber #FFC163 | red #FF6B6B
// text #E9F5EE | muted #6E877B

// ---- Mock data (swap for real API/DB data when ready) ------------------

const INITIAL_ZONES = [
  { id: "z1", name: "North Field", crop: "Wheat", moisture: 68, valveOn: true },
  { id: "z2", name: "East Terrace", crop: "Maize", moisture: 34, valveOn: false },
  { id: "z3", name: "South Plot", crop: "Vegetables", moisture: 52, valveOn: true },
];

const WATER_USAGE = [
  { day: "Mon", liters: 420 },
  { day: "Tue", liters: 380 },
  { day: "Wed", liters: 510 },
  { day: "Thu", liters: 460 },
  { day: "Fri", liters: 390 },
  { day: "Sat", liters: 340 },
  { day: "Sun", liters: 300 },
];

const EQUIPMENT = [
  { id: "e1", name: "Main Pump", status: "running" },
  { id: "e2", name: "Drip Valve A", status: "running" },
  { id: "e3", name: "Sprinkler B", status: "maintenance" },
];

// ---- Global style injection (fonts + keyframes) -------------------------

const HudStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .hud-root { font-family: 'Inter', sans-serif; }
    .hud-display { font-family: 'Space Grotesk', sans-serif; }
    .hud-mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.02em; }

    .hud-grid-bg {
      background-image:
        linear-gradient(rgba(107,255,184,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(107,255,184,0.05) 1px, transparent 1px);
      background-size: 32px 32px;
    }

    @keyframes hud-sweep {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .hud-sweep {
      animation: hud-sweep 4s linear infinite;
    }

    @keyframes hud-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.25; }
    }
    .hud-blink { animation: hud-blink 1.8s ease-in-out infinite; }

    @keyframes hud-scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }
    .hud-scanline::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 0%, rgba(107,255,184,0.06) 50%, transparent 100%);
      animation: hud-scanline 5s linear infinite;
      pointer-events: none;
    }

    .hud-panel {
      background: rgba(12,23,19,0.75);
      border: 1px solid #1C2B24;
      backdrop-filter: blur(6px);
    }
    .hud-panel:hover {
      border-color: rgba(107,255,184,0.35);
      box-shadow: 0 0 0 1px rgba(107,255,184,0.08), 0 12px 32px -12px rgba(0,0,0,0.6);
    }
  `}</style>
);

// ---- Small presentational helpers --------------------------------------

const StatusPulse = ({ status }) => {
  const map = {
    running: { label: "ONLINE", dot: "#6BFFB8", icon: CheckCircle2, glow: "0 0 8px #6BFFB8" },
    maintenance: { label: "CHECK", dot: "#FFC163", icon: Wrench, glow: "0 0 8px #FFC163" },
    off: { label: "OFFLINE", dot: "#5B6B63", icon: Power, glow: "none" },
  };
  const { label, dot, icon: Icon, glow } = map[status] ?? map.off;
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-medium hud-mono text-[#B7C7BE]">
      <span
        className={`w-1.5 h-1.5 rounded-full ${status === "running" ? "hud-blink" : ""}`}
        style={{ backgroundColor: dot, boxShadow: glow }}
      />
      <Icon size={12} style={{ color: dot }} />
      {label}
    </span>
  );
};

const MoistureGauge = ({ value }) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value < 40 ? "#FFC163" : value < 60 ? "#4FD1FF" : "#6BFFB8";

  return (
    <div className="relative w-20 h-20 shrink-0">
      {/* rotating scan ring */}
      <div className="absolute inset-0 hud-sweep" style={{ opacity: 0.35 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle
            cx="40" cy="40" r="38"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeDasharray="2 10"
          />
        </svg>
      </div>
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90 relative">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="#1C2B24" strokeWidth="8" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 700ms ease, stroke 700ms ease", filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold hud-mono" style={{ color }}>{value}%</span>
      </div>
    </div>
  );
};

const SkeletonLine = ({ w = "w-24" }) => (
  <div className={`h-4 ${w} bg-white/5 rounded animate-pulse`} />
);

// ---- Main component ------------------------------------------------------

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [now, setNow] = useState(new Date());

  const city = "Palampur";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await getWeather(city);
        if (response.success) setWeather(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const toggleValve = (id) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, valveOn: !z.valveOn } : z))
    );
  };

  const lowMoistureZones = useMemo(
    () => zones.filter((z) => z.moisture < 40),
    [zones]
  );

  const greeting = useMemo(() => {
    const h = now.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, [now]);

  const timeStr = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <DashboardLayout>
      <div className="hud-root hud-grid-bg -m-6 p-6 min-h-screen" style={{ backgroundColor: "#05100C" }}>
        <HudStyles />

        {/* Hero / mission-control header */}
        <div className="relative overflow-hidden hud-scanline rounded-3xl p-8 mb-8 border border-[#1C2B24]"
             style={{ background: "linear-gradient(135deg, #071C15 0%, #0C1713 60%, #05100C 100%)" }}>
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] hud-mono text-[#6BFFB8]/70 mb-2 flex items-center gap-2">
                <Satellite size={13} /> FIELD CONTROL &middot; {now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <h1 className="hud-display text-3xl md:text-4xl font-semibold text-[#EAF5EE] tracking-tight">
                Smart Irrigation
              </h1>
              <p className="mt-3 text-lg text-[#EAF5EE]/90">
                {greeting}, <strong>{user?.name ?? "Farmer"}</strong>
              </p>
              <p className="text-[#B7C7BE] text-sm mt-1">
                Live telemetry across all zones &middot; last sync <span className="hud-mono">{timeStr}</span>
              </p>

              {lowMoistureZones.length > 0 && (
                <div className="mt-5 inline-flex items-center gap-2 bg-[#FFC163]/10 text-[#FFC163] ring-1 ring-[#FFC163]/30 rounded-xl px-4 py-2 text-sm hud-mono">
                  <AlertTriangle size={16} />
                  {lowMoistureZones.length === 1
                    ? `${lowMoistureZones[0].name} — moisture below threshold`
                    : `${lowMoistureZones.length} zones below moisture threshold`}
                </div>
              )}
            </div>

            <div className="hidden sm:flex flex-col items-end gap-1 hud-mono text-[11px] text-[#6E877B]">
              <span className="inline-flex items-center gap-1.5 text-[#6BFFB8]">
                <Radio size={12} className="hud-blink" /> SYSTEM ACTIVE
              </span>
              <span>UPTIME 99.7%</span>
            </div>
          </div>
        </div>

        {/* Top metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Weather */}
          <div className="hud-panel rounded-2xl p-6 transition">
            <div className="flex justify-between items-center">
              <h2 className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Weather</h2>
              <CloudSun className="text-[#FFC163]" size={22} />
            </div>

            {loading ? (
              <div className="mt-5 space-y-2">
                <SkeletonLine w="w-16" />
                <SkeletonLine w="w-28" />
              </div>
            ) : (
              <>
                <h1 className="hud-mono text-4xl font-semibold mt-4 text-[#EAF5EE]">
                  {weather?.temperature}&deg;
                </h1>
                <p className="mt-3 text-[#B7C7BE] text-sm">{weather?.city}</p>
                <p className="text-[#6E877B] text-sm">{weather?.description}</p>
              </>
            )}
          </div>

          {/* Humidity */}
          <div className="hud-panel rounded-2xl p-6 transition">
            <div className="flex justify-between items-center">
              <h2 className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Humidity</h2>
              <Droplets className="text-[#4FD1FF]" size={22} />
            </div>
            <h1 className="hud-mono text-4xl font-semibold mt-4 text-[#4FD1FF]">
              {weather?.humidity ?? "--"}%
            </h1>
          </div>

          {/* Wind */}
          <div className="hud-panel rounded-2xl p-6 transition">
            <div className="flex justify-between items-center">
              <h2 className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Wind Speed</h2>
              <Wind className="text-[#4FD1FF]" size={22} />
            </div>
            <h1 className="hud-mono text-4xl font-semibold mt-4 text-[#4FD1FF]">
              {weather?.windSpeed ?? "--"} <span className="text-lg">m/s</span>
            </h1>
          </div>

          {/* Farms */}
          <div className="hud-panel rounded-2xl p-6 transition">
            <div className="flex justify-between items-center">
              <h2 className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Total Farms</h2>
              <Sprout className="text-[#6BFFB8]" size={22} />
            </div>
            <h1 className="hud-mono text-4xl font-semibold mt-4 text-[#6BFFB8]">1</h1>
          </div>
        </div>

        {/* Irrigation zones */}
        <div className="mt-8">
          <h2 className="hud-display text-xl font-semibold text-[#EAF5EE] mb-4 flex items-center gap-2">
            <Gauge size={20} className="text-[#6BFFB8]" />
            Irrigation Zones
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="hud-panel rounded-2xl p-6 flex items-center gap-4 transition"
              >
                <MoistureGauge value={zone.moisture} />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#EAF5EE] truncate hud-display">{zone.name}</p>
                  <p className="text-sm text-[#6E877B] mb-3 hud-mono">{zone.crop}</p>

                  <button
                    onClick={() => toggleValve(zone.id)}
                    className={`w-full inline-flex items-center justify-center gap-2 text-sm font-medium px-3 py-2 rounded-xl transition hud-mono ${
                      zone.valveOn
                        ? "bg-[#6BFFB8]/15 text-[#6BFFB8] ring-1 ring-[#6BFFB8]/40 hover:bg-[#6BFFB8]/25"
                        : "bg-white/5 text-[#6E877B] ring-1 ring-white/10 hover:bg-white/10"
                    }`}
                  >
                    <Power size={14} />
                    VALVE {zone.valveOn ? "ON" : "OFF"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Water usage + Equipment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Chart */}
          <div className="lg:col-span-2 hud-panel rounded-2xl p-6">
            <h2 className="hud-display text-lg font-semibold text-[#EAF5EE] mb-1">Weekly Water Usage</h2>
            <p className="text-sm text-[#6E877B] mb-4 hud-mono">LITERS / DAY &middot; ALL ZONES</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={WATER_USAGE} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1C2B24" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6E877B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6E877B" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#0C1713", borderRadius: 12, border: "1px solid #1C2B24", color: "#EAF5EE" }}
                    labelStyle={{ color: "#B7C7BE" }}
                    formatter={(v) => [`${v} L`, "Usage"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="liters"
                    stroke="#6BFFB8"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#6BFFB8", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Equipment */}
          <div className="hud-panel rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Tractor className="text-[#6BFFB8]" size={22} />
              <h2 className="hud-display text-lg font-semibold text-[#EAF5EE]">Equipment Status</h2>
            </div>

            <div className="space-y-3">
              {EQUIPMENT.map((eq) => (
                <div key={eq.id} className="flex items-center justify-between border border-[#1C2B24] rounded-xl px-4 py-3">
                  <span className="text-sm font-medium text-[#EAF5EE]">{eq.name}</span>
                  <StatusPulse status={eq.status} />
                </div>
              ))}
            </div>

            <p className="text-xs text-[#6E877B] mt-4 hud-mono">
              {EQUIPMENT.filter((e) => e.status === "running").length} / {EQUIPMENT.length} ACTIVE
            </p>
          </div>
        </div>

        {/* Temperature detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="hud-panel rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Thermometer className="text-[#FF6B6B]" size={22} />
              <h2 className="hud-display text-xl font-semibold text-[#EAF5EE]">Temperature Details</h2>
            </div>
            <p className="mt-6 text-[#6E877B] text-sm hud-mono">CURRENT TEMPERATURE</p>
            <h1 className="hud-mono text-5xl font-semibold text-[#FF6B6B] mt-2">
              {weather?.temperature ?? "--"}&deg;
            </h1>
          </div>

          <div className="hud-panel rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Droplets className="text-[#4FD1FF]" size={22} />
              <h2 className="hud-display text-xl font-semibold text-[#EAF5EE]">Average Soil Moisture</h2>
            </div>
            <p className="mt-6 text-[#6E877B] text-sm hud-mono">ACROSS ALL ZONES</p>
            <h1 className="hud-mono text-5xl font-semibold text-[#4FD1FF] mt-2">
              {Math.round(zones.reduce((s, z) => s + z.moisture, 0) / zones.length)}%
            </h1>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;