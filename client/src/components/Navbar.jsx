import { Bell, Search, Moon, UserCircle, Satellite } from "lucide-react";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "linear-gradient(90deg, #071C15 0%, #0C1713 100%)",
        borderColor: "#1C2B24",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .nav-display { font-family: 'Space Grotesk', sans-serif; }
        .nav-mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.02em; }
        .nav-search::placeholder { color: #5B6B63; }
        .nav-search:focus-within {
          box-shadow: 0 0 0 1px rgba(107,255,184,0.35);
        }
        @keyframes nav-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .nav-blink { animation: nav-blink 1.6s ease-in-out infinite; }
      `}</style>

      <div className="flex justify-between items-center px-8 py-4">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-[#6BFFB8]/10 text-[#6BFFB8] p-2.5 rounded-xl ring-1 ring-[#6BFFB8]/30">
            <Satellite size={20} />
          </div>
          <div>
            <h1 className="nav-display text-xl font-semibold text-[#EAF5EE] tracking-tight">
              Smart Irrigation
            </h1>
            <p className="nav-mono text-[11px] uppercase tracking-[0.15em] text-[#6E877B]">
              Precision Farming Console
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="nav-search hidden lg:flex items-center bg-[#0C1713] border border-[#1C2B24] rounded-xl px-4 py-2 w-[380px] transition">
          <Search className="text-[#6E877B]" size={18} />
          <input
            type="text"
            placeholder="Search farms, crops..."
            className="bg-transparent outline-none ml-3 w-full text-sm text-[#EAF5EE] nav-search"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Theme toggle */}
          <button className="bg-[#0C1713] border border-[#1C2B24] hover:border-[#6BFFB8]/40 text-[#B7C7BE] p-3 rounded-full transition">
            <Moon size={18} />
          </button>

          {/* Notifications */}
          <button className="relative bg-[#0C1713] border border-[#1C2B24] hover:border-[#6BFFB8]/40 text-[#B7C7BE] p-3 rounded-full transition">
            <Bell size={18} />
            <span
              className="nav-blink absolute -top-1 -right-1 bg-[#FF6B6B] w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center"
              style={{ boxShadow: "0 0 6px #FF6B6B" }}
            >
              2
            </span>
          </button>

          {/* User */}
          <div className="flex items-center gap-3 pl-2 border-l border-[#1C2B24]">
            <UserCircle size={38} className="text-[#6BFFB8]" />
            <div className="hidden md:block">
              <h3 className="nav-display font-semibold text-sm text-[#EAF5EE]">
                {user?.name}
              </h3>
              <p className="nav-mono text-xs text-[#6E877B]">
                {user?.role}
              </p>
            </div>
          </div>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;