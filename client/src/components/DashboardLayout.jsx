import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Radio } from "lucide-react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#05100C" }}>

      {/* Top Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex">

        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">

          <div className="p-8">

            {/* System status strip */}
            <div
              className="rounded-2xl px-6 py-3 mb-8 flex items-center justify-between"
              style={{
                background: "rgba(12,23,19,0.75)",
                border: "1px solid #1C2B24",
                backdropFilter: "blur(6px)",
              }}
            >
              <span
                className="text-[11px] uppercase tracking-[0.2em] text-[#6E877B]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Precision Farming Control
              </span>

              <div className="flex items-center gap-2">
                <Radio size={12} className="text-[#6BFFB8] animate-pulse" />
                <span
                  className="text-[#6BFFB8] text-xs font-medium tracking-wide"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  SYSTEM ONLINE
                </span>
              </div>

            </div>

            {/* Dynamic Page Content */}
            <div className="animate-fade-in">
              {children}
            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;