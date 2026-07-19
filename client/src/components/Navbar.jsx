import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Search,
  Moon,
  Sun,
  UserCircle,
  Satellite,
  LogOut,
  Settings,
} from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:5001";

const Navbar = () => {
  const user = useMemoParse("user");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [search, setSearch] = useState("");

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    fetchAlerts();

    const interval = setInterval(() => {
      fetchAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/alerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAlerts(res.data.alerts ?? []);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = alerts.filter(
    (item) => item.status === "Unread"
  ).length;

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
    setShowNotifications(false);
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${API_BASE}/api/alerts/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAlerts();
    } catch (err) {
      console.error("Failed to mark alert as read:", err);
    }
  };

  const deleteAlert = async (id) => {
    try {
      await axios.delete(
        `${API_BASE}/api/alerts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAlerts();
    } catch (err) {
      console.error("Failed to delete alert:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#080C0A]/95 backdrop-blur-md border-b border-[#1C2B24]">
  <div className="flex items-center justify-between gap-4 px-6 md:px-10 h-16">

    {/* Brand */}
    <div className="flex items-center gap-2.5 shrink-0">
      <div className="w-8 h-8 rounded-lg bg-[#6BFFB8]/10 flex items-center justify-center">
        <Satellite size={17} className="text-[#6BFFB8]" />
      </div>

      <span className="hud-display text-[#EAF5EE] font-semibold text-sm hidden sm:block">
        Smart Irrigation
      </span>
    </div>

    {/* Search */}
    <form
      onSubmit={handleSearchSubmit}
      className="flex-1 max-w-md hidden md:block"
    >
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E877B]"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search farms, equipment, orders..."
          className="w-full bg-[#0C1713] border border-[#1C2B24] focus:border-[#6BFFB8]/40 rounded-full pl-10 pr-4 py-2 text-sm text-[#EAF5EE] placeholder:text-[#6E877B] outline-none transition"
        />
      </div>
    </form>

    {/* Right Controls */}
    <div className="flex items-center gap-3 shrink-0">

      {/* Theme */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-[#0C1713] border border-[#1C2B24] hover:border-[#6BFFB8]/40 text-[#B7C7BE] p-3 rounded-full transition"
      >
        {darkMode ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {/* Notifications */}
      <div className="relative" ref={notificationRef}>
        <button
          onClick={toggleNotifications}
          className="relative bg-[#0C1713] border border-[#1C2B24] hover:border-[#6BFFB8]/40 text-[#B7C7BE] p-3 rounded-full transition"
        >
          <Bell size={18} />

          {unreadCount > 0 && (
            <span
              className="nav-blink absolute -top-1 -right-1 bg-[#FF6B6B] w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center font-medium"
              style={{ boxShadow: "0 0 6px #FF6B6B" }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-3 w-96 bg-[#0C1713] border border-[#1C2B24] rounded-2xl shadow-2xl overflow-hidden z-50">

            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-[#1C2B24]">
              <h2 className="text-[#EAF5EE] font-semibold text-base">
                Notifications
              </h2>

              <span className="text-xs bg-[#6BFFB8]/20 text-[#6BFFB8] px-3 py-1 rounded-full">
                {unreadCount} Unread
              </span>
            </div>

            <div className="max-h-96 overflow-y-auto">

              {loading && (
                <div className="text-center py-8 text-[#6E877B]">
                  Loading...
                </div>
              )}

              {!loading && alerts.length === 0 && (
                <div className="text-center py-10 text-[#6E877B]">
                  No notifications
                </div>
              )}

              {!loading &&
                alerts.map((alert) => (
                  <div
                    key={alert._id}
                    className={`border-b border-[#1C2B24] p-4 hover:bg-[#14241C] transition ${
                      alert.status === "Unread"
                        ? "bg-[#122019]"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between gap-3">

                      <div className="flex-1">

                        <h3 className="text-[#EAF5EE] font-medium">
                          {alert.title}
                        </h3>

                        <p className="text-sm text-[#90A49A] mt-1">
                          {alert.message}
                        </p>

                        <p className="text-xs text-[#6E877B] mt-2">
                          {formatDistanceToNow(
                            new Date(alert.createdAt),
                            { addSuffix: true }
                          )}
                        </p>

                        <div className="flex gap-2 mt-3">

                          <span className="text-[11px] bg-green-600/20 text-green-400 px-2 py-1 rounded-full">
                            {alert.type}
                          </span>

                          <span
                            className={`text-[11px] px-2 py-1 rounded-full ${
                              alert.status === "Unread"
                                ? "bg-red-600/20 text-red-400"
                                : "bg-blue-600/20 text-blue-400"
                            }`}
                          >
                            {alert.status}
                          </span>

                        </div>

                      </div>

                      <div className="flex flex-col gap-2">

                        {alert.status === "Unread" && (
                          <button
                            onClick={() => markAsRead(alert._id)}
                            className="text-xs bg-[#6BFFB8] text-black px-3 py-1 rounded-lg hover:bg-[#54f09d]"
                          >
                            Read
                          </button>
                        )}

                        <button
                          onClick={() => deleteAlert(alert._id)}
                          className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>

                      </div>

                    </div>
                  </div>
                ))}

            </div>

            <div className="p-4 border-t border-[#1C2B24]">
              <button
                onClick={() => {
                  setShowNotifications(false);
                  navigate("/alerts");
                }}
                className="w-full bg-[#6BFFB8] text-black py-2 rounded-xl font-semibold hover:bg-[#57f3a2] transition"
              >
                View All Alerts
              </button>
            </div>

          </div>
        )}
      </div>
            {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={toggleProfile}
          className="flex items-center gap-2 bg-[#0C1713] border border-[#1C2B24] hover:border-[#6BFFB8]/40 rounded-full pl-2 pr-3 py-1.5 transition"
        >
          <UserCircle
            size={22}
            className="text-[#B7C7BE]"
          />

          <span className="text-sm text-[#EAF5EE] font-medium hidden sm:block max-w-[110px] truncate">
            {user?.name ?? "Account"}
          </span>
        </button>

        {showProfile && (
          <div className="absolute right-0 mt-3 w-56 bg-[#0C1713] border border-[#1C2B24] rounded-2xl shadow-2xl overflow-hidden z-50">

            <div className="px-4 py-4 border-b border-[#1C2B24]">
              <p className="text-[#EAF5EE] font-medium text-sm truncate">
                {user?.name ?? "Account"}
              </p>

              <p className="text-[#6E877B] text-xs mt-1 truncate">
                {user?.email ?? ""}
              </p>
            </div>

            <button
              onClick={() => {
                setShowProfile(false);
                navigate("/settings");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#B7C7BE] hover:bg-[#14241C] transition"
            >
              <Settings size={16} />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#FF6B6B] hover:bg-[#14241C] transition border-t border-[#1C2B24]"
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>
        )}
      </div>

    </div>
  </div>
</nav>
  );
};

function useMemoParse(key) {
  const [value] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  });

  return value;
}

export default Navbar;