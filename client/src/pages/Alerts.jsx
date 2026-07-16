import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getAlerts } from "../services/alertService";

import {
  Bell,
  Search,
  AlertTriangle,
  CloudRain,
  Droplets,
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

const ALERT_ICON = {
  Weather: CloudRain,
  Irrigation: Droplets,
};

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      const response = await getAlerts();

      if (response.success) {
        setAlerts(response.alerts);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  // Derived, not stored in state — avoids an extra render per keystroke
  const filteredAlerts = useMemo(() => {
    return alerts.filter(
      (alert) =>
        alert.title.toLowerCase().includes(search.toLowerCase()) ||
        alert.type.toLowerCase().includes(search.toLowerCase()) ||
        alert.message.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, alerts]);

  if (loading) {
    return (
      <DashboardLayout>
        <div
          className="hud-root flex flex-col justify-center items-center h-[80vh] gap-3"
          style={{ backgroundColor: "#05100C" }}
        >
          <HudStyles />
          <Radio size={22} className="text-[#6BFFB8] hud-blink" />
          <h1 className="hud-mono text-lg text-[#6BFFB8] tracking-widest uppercase">
            Loading Alerts...
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

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="hud-display text-4xl font-semibold text-[#EAF5EE] flex items-center gap-3">
              <Bell className="text-[#FF6B6B]" />
              Alerts
            </h1>
            <p className="text-[#6E877B] mt-2 hud-mono text-sm">
              Weather, irrigation and equipment notifications.
            </p>
          </div>

        </div>

        {/* Search */}

        <div className="relative mb-8">
          <Search
            className="absolute left-4 top-4 text-[#5B6B63]"
            size={20}
          />
          <input
            type="text"
            placeholder="Search alerts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="hud-input w-full rounded-xl p-4 pl-12 transition"
          />
        </div>

        {/* Statistics */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="hud-panel rounded-2xl p-6 transition">
            <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Total Alerts</p>
            <h2 className="hud-mono text-4xl font-semibold text-[#FF6B6B] mt-2">
              {alerts.length}
            </h2>
          </div>

          <div className="hud-panel rounded-2xl p-6 transition">
            <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Unread</p>
            <h2 className="hud-mono text-4xl font-semibold text-[#FFC163] mt-2">
              {alerts.filter((a) => a.status === "Unread").length}
            </h2>
          </div>

          <div className="hud-panel rounded-2xl p-6 transition">
            <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">Read</p>
            <h2 className="hud-mono text-4xl font-semibold text-[#6BFFB8] mt-2">
              {alerts.filter((a) => a.status === "Read").length}
            </h2>
          </div>

        </div>

        {/* Alert Cards */}

        {filteredAlerts.length === 0 ? (

          <div className="hud-panel rounded-3xl p-12 text-center">
            <Bell size={56} className="mx-auto text-[#6BFFB8]/60 mb-4" />
            <h2 className="hud-display text-3xl font-semibold text-[#EAF5EE]">
              No Alerts Found
            </h2>
            <p className="text-[#6E877B] mt-3 hud-mono text-sm">
              Everything looks good, nothing to report.
            </p>
          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {filteredAlerts.map((alert) => {
              const AlertIcon = ALERT_ICON[alert.type] ?? AlertTriangle;
              const isUnread = alert.status === "Unread";

              return (
                <div
                  key={alert._id}
                  className="hud-panel rounded-3xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
                >

                  {/* Header */}

                  <div
                    className="p-6 border-b border-[#1C2B24]"
                    style={{ background: "linear-gradient(135deg, #1C0F0C 0%, #0C1713 100%)" }}
                  >

                    <div className="flex justify-between items-center">
                      <AlertIcon size={32} className={isUnread ? "text-[#FFC163]" : "text-[#6E877B]"} />

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold hud-mono ring-1 ${
                          isUnread
                            ? "bg-[#FFC163]/10 text-[#FFC163] ring-[#FFC163]/30"
                            : "bg-[#6BFFB8]/10 text-[#6BFFB8] ring-[#6BFFB8]/30"
                        }`}
                      >
                        {alert.status?.toUpperCase()}
                      </span>
                    </div>

                    <h2 className="hud-display text-2xl font-semibold mt-5 text-[#EAF5EE]">
                      {alert.title}
                    </h2>

                    <div className="mt-3">
                      <span className="bg-white/5 ring-1 ring-white/10 px-3 py-1 rounded-full text-xs hud-mono text-[#B7C7BE]">
                        {alert.type}
                      </span>
                    </div>

                  </div>

                  {/* Body */}

                  <div className="p-6">

                    <p className="text-[#B7C7BE] leading-7 text-sm">
                      {alert.message}
                    </p>

                    <div className="mt-6 text-xs text-[#6E877B] hud-mono">
                      <strong className="text-[#EAF5EE]">CREATED:</strong>{" "}
                      {new Date(alert.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
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

export default Alerts;