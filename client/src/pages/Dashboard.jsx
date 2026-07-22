import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getEquipment } from "../services/equipmentService";
import { getSensors } from "../services/sensorService";
import { getFarms } from "../services/farmService";
import { getWeather } from "../services/weatherService";
import { getDashboardStats } from "../services/dashboardService";
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
  Tractor,
  Sprout,
  Radio,
  ShoppingCart,
  Bell,
  PlusCircle,
  Package,
  ArrowUpRight,
  Clock,
  LocateFixed,
  MapPin,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Static config
// ---------------------------------------------------------------------------

const INITIAL_ZONES = [
  { id: "zone-a", name: "Zone A · North Field", moisture: 62 },
  { id: "zone-b", name: "Zone B · Greenhouse", moisture: 74 },
  { id: "zone-c", name: "Zone C · Terrace Plot", moisture: 48 },
  { id: "zone-d", name: "Zone D · East Slope", moisture: 55 },
];

const DEFAULT_CITY = "shimla";
const CITY_CACHE_KEY = "weatherCity";
const CITY_SOURCE_KEY = "weatherCitySource";

// ---------------------------------------------------------------------------
// Geolocation helpers
// ---------------------------------------------------------------------------

function getCurrentCoords({ timeout = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { timeout, maximumAge: 10 * 60 * 1000 }
    );
  });
}

async function reverseGeocodeCity(lat, lon) {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.city || data.locality || data.principalSubdivision || null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Presentational helpers
// ---------------------------------------------------------------------------

const SkeletonLine = ({ w = "w-20" }) => (
  <div className={`h-4 ${w} rounded-full bg-[#1C2B24] animate-pulse`} />
);

const StatusDot = ({ tone = "#6BFFB8", pulse = true }) => (
  <span
    className={`inline-block w-1.5 h-1.5 rounded-full ${pulse ? "hud-blink" : ""}`}
    style={{ backgroundColor: tone, boxShadow: `0 0 8px ${tone}` }}
  />
);

const KpiCard = ({ label, icon: Icon, value, accent, sub, loading }) => (
  <div className="hud-panel rounded-2xl p-6 group hover:border-[#2A3B32] transition-colors duration-300">
    <div className="flex justify-between items-start">
      <h2 className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">
        {label}
      </h2>
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: `${accent}1A` }}
      >
        <Icon size={18} style={{ color: accent }} />
      </div>
    </div>
    {loading ? (
      <div className="mt-6 space-y-2">
        <SkeletonLine w="w-16" />
        <SkeletonLine w="w-24" />
      </div>
    ) : (
      <>
        <h1
          className="hud-mono text-4xl font-semibold mt-5 tracking-tight"
          style={{ color: accent }}
        >
          {value}
        </h1>
        <p className="text-[#6E877B] text-sm mt-2">{sub}</p>
      </>
    )}
  </div>
);

const QuickAction = ({ label, icon: Icon, accent, href }) => (
  <button
    onClick={() => (window.location.href = href)}
    className="relative rounded-xl p-5 flex flex-col items-center gap-3 border border-[#1C2B24] bg-[#0E1512] hover:bg-[#131C17] transition-colors duration-200"
  >
    <div
      className="w-11 h-11 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: `${accent}1A` }}
    >
      <Icon size={22} style={{ color: accent }} />
    </div>
    <span className="text-sm text-[#B7C7BE] font-medium">{label}</span>
  </button>
);

const OverviewRow = ({ label, value, accent }) => (
  <div className="flex justify-between items-center">
    <span className="text-[#6E877B] text-sm">{label}</span>
    <span className="font-semibold hud-mono" style={{ color: accent }}>
      {value}
    </span>
  </div>
);

const getBatteryIcon = (level) => {
  if (level === undefined || level === null) return Battery;
  if (level < 20) return BatteryLow;
  if (level < 50) return BatteryMedium;
  return BatteryFull;
};

const getBatteryColor = (level) => {
  if (level === undefined || level === null) return "#6E877B";
  if (level < 20) return "#FF6B6B";
  if (level < 50) return "#FFC163";
  return "#6BFFB8";
};

// ---------------------------------------------------------------------------
// Main Dashboard Component
// ---------------------------------------------------------------------------

const Dashboard = () => {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  // States from first dashboard
  const [stats, setStats] = useState({
    farms: 0,
    equipment: 0,
    sensors: 0,
    activeSensors: 0,
    inactiveSensors: 0,
    lowBattery: 0,
    runningEquipment: 0,
  });
  const [recentSensors, setRecentSensors] = useState([]);

  // States from second dashboard
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(
    localStorage.getItem(CITY_CACHE_KEY) || DEFAULT_CITY
  );
  const [citySource, setCitySource] = useState(
    localStorage.getItem(CITY_SOURCE_KEY) || "default"
  );
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [zones] = useState(INITIAL_ZONES);
  const [now, setNow] = useState(new Date());

  const [dashboard, setDashboard] = useState({
    totalFarms: 0,
    totalEquipment: 0,
    totalOrders: 0,
    totalAlerts: 0,
    recentOrders: [],
    recentAlerts: [],
  });

  // Greeting based on time of day
  const greeting = useMemo(() => {
    const h = now.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, [now]);

  const formattedTime = useMemo(
    () =>
      now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [now]
  );

  const formattedDate = useMemo(
    () =>
      now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    [now]
  );

  // Moisture trend derived from zones
  const moistureTrend = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const base = zones.reduce((sum, z) => sum + z.moisture, 0) / zones.length;
    return days.map((day, i) => ({
      day,
      moisture: Math.round(
        base + Math.sin(i / 1.3) * 6 + (i === days.length - 1 ? 2 : 0)
      ),
    }));
  }, [zones]);

  // Load weather data
  const loadWeather = async (selectedCity) => {
    try {
      const weatherResponse = await getWeather(selectedCity);
      if (weatherResponse?.success) setWeather(weatherResponse.data);
    } catch (error) {
      console.error("Weather load failed:", error);
    }
  };

  // Detect location and update weather
  const detectLocation = async ({ silent = false } = {}) => {
    if (!silent) setLocating(true);
    try {
      const { lat, lon } = await getCurrentCoords();
      const detectedCity = await reverseGeocodeCity(lat, lon);

      if (detectedCity) {
        setCity(detectedCity);
        setCitySource("auto");
        localStorage.setItem(CITY_CACHE_KEY, detectedCity);
        localStorage.setItem(CITY_SOURCE_KEY, "auto");
        await loadWeather(detectedCity);
      }
    } catch (error) {
      console.warn("Location auto-detect skipped:", error?.message || error);
    } finally {
      setLocating(false);
    }
  };

  // Load all dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load weather
        const hasManualOrCachedCity =
          localStorage.getItem(CITY_SOURCE_KEY) === "manual" ||
          localStorage.getItem(CITY_CACHE_KEY);

        if (hasManualOrCachedCity) {
          await loadWeather(city);
        } else {
          await detectLocation({ silent: true });
          if (!localStorage.getItem(CITY_CACHE_KEY)) {
            await loadWeather(DEFAULT_CITY);
          }
        }

        // Load farm, equipment, and sensor data
        const [farmRes, eqRes, sensorRes, dashboardRes] = await Promise.all([
          getFarms(),
          getEquipment(),
          getSensors(),
          getDashboardStats(),
        ]);

        const farms = farmRes.success ? farmRes.farms : [];
        const equipment = eqRes.success ? eqRes.equipment : [];
        const sensors = sensorRes.success ? sensorRes.sensors : [];

        // Update stats
        setStats({
          farms: farms.length,
          equipment: equipment.length,
          sensors: sensors.length,
          activeSensors: sensors.filter(s => s.status === "Active").length,
          inactiveSensors: sensors.filter(s => s.status !== "Active").length,
          lowBattery: sensors.filter(s => (s.batteryLevel ?? 100) < 20).length,
          runningEquipment: equipment.filter(e => e.status === "Running").length,
        });

        setRecentSensors(sensors.slice(0, 5));

        // Update dashboard stats
        if (dashboardRes?.success) {
          setDashboard({
            totalFarms: dashboardRes.stats.totalFarms,
            totalEquipment: dashboardRes.stats.totalEquipment,
            totalOrders: dashboardRes.stats.totalOrders,
            totalAlerts: dashboardRes.stats.totalAlerts,
            recentOrders: dashboardRes.recentOrders ?? [],
            recentAlerts: dashboardRes.recentAlerts ?? [],
          });
        }
      } catch (error) {
        console.error("Dashboard load failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#080C0A] text-[#EAF5EE] px-6 md:px-10 py-8 space-y-8">
        {/* =====================================================
            Header
        ===================================================== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[#6E877B] text-sm hud-mono">
              {greeting}
              {user?.name ? `, ${user.name}` : ""}
            </p>
            <h1 className="hud-display text-2xl md:text-3xl font-semibold mt-1">
              Smart Irrigation Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hud-panel rounded-xl px-4 py-2.5 flex items-center gap-2.5">
              <Clock size={15} className="text-[#6E877B]" />
              <span className="hud-mono text-sm text-[#B7C7BE]">
                {formattedDate} · {formattedTime}
              </span>
            </div>
            <div className="hud-panel rounded-xl px-4 py-2.5 flex items-center gap-2">
              <StatusDot tone="#6BFFB8" />
              <span className="text-sm text-[#6BFFB8] font-medium">
                System Online
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            Weather + KPI Row
        ===================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-5">
          {/* Weather Card */}
          <div className="hud-panel rounded-2xl p-6 xl:col-span-2">
            <div className="flex justify-between items-start">
              <h2 className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">
                Weather
              </h2>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => detectLocation()}
                  disabled={locating}
                  title="Use my current location"
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#4FD1FF]/10 hover:bg-[#4FD1FF]/20 transition-colors disabled:opacity-60"
                >
                  <LocateFixed
                    size={13}
                    className={`text-[#4FD1FF] ${
                      locating ? "animate-pulse" : ""
                    }`}
                  />
                </button>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#FFC163]/10">
                  <CloudSun size={18} className="text-[#FFC163]" />
                </div>
              </div>
            </div>

            {loading || locating ? (
              <div className="mt-6 space-y-2">
                <SkeletonLine w="w-16" />
                <SkeletonLine w="w-28" />
              </div>
            ) : (
              <>
                <h1 className="hud-mono text-4xl font-semibold mt-5 text-[#EAF5EE] tracking-tight">
                  {weather?.temperature ?? "--"}°
                </h1>
                <div className="flex items-center gap-1.5 mt-2">
                  <MapPin size={12} className="text-[#6E877B]" />
                  <p className="text-[#B7C7BE] text-sm">
                    {weather?.city ?? city}
                  </p>
                  {citySource === "auto" && (
                    <span className="text-[10px] text-[#6BFFB8] bg-[#6BFFB8]/10 px-1.5 py-0.5 rounded-full hud-mono">
                      auto
                    </span>
                  )}
                </div>
                <p className="text-[#6E877B] text-xs mt-1">
                  {weather?.description ?? "Fetching conditions"}
                </p>
              </>
            )}
          </div>

          {/* KPI Cards */}
          <KpiCard
            label="Farms"
            icon={Sprout}
            accent="#6BFFB8"
            value={stats.farms}
            sub="Registered farms"
            loading={loading}
          />
          <KpiCard
            label="Equipment"
            icon={Tractor}
            accent="#4FD1FF"
            value={stats.equipment}
            sub={`${stats.runningEquipment} running`}
            loading={loading}
          />
          <KpiCard
            label="Sensors"
            icon={Radio}
            accent="#FFC163"
            value={stats.sensors}
            sub={`${stats.activeSensors} active`}
            loading={loading}
          />
          <KpiCard
            label="Alerts"
            icon={Bell}
            accent="#FF6B6B"
            value={stats.lowBattery + dashboard.totalAlerts}
            sub={`${stats.lowBattery} low battery`}
            loading={loading}
          />
        </div>

        {/* =====================================================
            Sensor Status Cards (Additional Stats)
        ===================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="hud-panel rounded-2xl p-5">
            <h3 className="text-[#6E877B] text-sm">Active Sensors</h3>
            <p className="text-2xl font-bold text-[#6BFFB8] mt-1">
              {stats.activeSensors}
            </p>
            <p className="text-xs text-[#6E877B] mt-1">
              {Math.round((stats.activeSensors / stats.sensors) * 100) || 0}% of total
            </p>
          </div>
          <div className="hud-panel rounded-2xl p-5">
            <h3 className="text-[#6E877B] text-sm">Inactive Sensors</h3>
            <p className="text-2xl font-bold text-[#FF6B6B] mt-1">
              {stats.inactiveSensors}
            </p>
            <p className="text-xs text-[#6E877B] mt-1">Need attention</p>
          </div>
          <div className="hud-panel rounded-2xl p-5">
            <h3 className="text-[#6E877B] text-sm">Low Battery</h3>
            <p className="text-2xl font-bold text-[#FFC163] mt-1">
              {stats.lowBattery}
            </p>
            <p className="text-xs text-[#6E877B] mt-1">Below 20%</p>
          </div>
          <div className="hud-panel rounded-2xl p-5">
            <h3 className="text-[#6E877B] text-sm">Running Equipment</h3>
            <p className="text-2xl font-bold text-[#4FD1FF] mt-1">
              {stats.runningEquipment}
            </p>
            <p className="text-xs text-[#6E877B] mt-1">
              {Math.round((stats.runningEquipment / stats.equipment) * 100) || 0}% operational
            </p>
          </div>
        </div>

        {/* =====================================================
            Moisture Trend + Zone Moisture
        ===================================================== */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="hud-panel rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="hud-display text-lg font-semibold">
                Soil Moisture Trend
              </h2>
              <span className="text-xs text-[#6E877B] hud-mono">
                7-day average
              </span>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={moistureTrend}>
                <CartesianGrid stroke="#1C2B24" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#6E877B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6E877B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0E1512",
                    border: "1px solid #1C2B24",
                    borderRadius: 12,
                    color: "#EAF5EE",
                  }}
                  labelStyle={{ color: "#6E877B" }}
                />
                <Line
                  type="monotone"
                  dataKey="moisture"
                  stroke="#6BFFB8"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#6BFFB8", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="hud-panel rounded-2xl p-6">
            <h2 className="hud-display text-lg font-semibold mb-5">
              Zone Moisture
            </h2>
            <div className="space-y-5">
              {zones.map((zone) => (
                <div key={zone.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#B7C7BE]">{zone.name}</span>
                    <span className="hud-mono text-[#6BFFB8]">
                      {zone.moisture}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#1C2B24] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#6BFFB8]"
                      style={{ width: `${zone.moisture}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
            Recent Sensors + Recent Orders
        ===================================================== */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Sensors */}
          <div className="hud-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Radio size={20} className="text-[#FFC163]" />
                <h2 className="hud-display text-lg font-semibold">
                  Recent Sensors
                </h2>
              </div>
              <a
                href="/sensors"
                className="text-xs text-[#6E877B] hover:text-[#B7C7BE] flex items-center gap-1 transition-colors"
              >
                View all <ArrowUpRight size={13} />
              </a>
            </div>

            {loading ? (
              <div className="space-y-3">
                <SkeletonLine w="w-full" />
                <SkeletonLine w="w-full" />
                <SkeletonLine w="w-2/3" />
              </div>
            ) : recentSensors.length === 0 ? (
              <p className="text-[#6E877B] text-sm py-6 text-center">
                No sensors installed
              </p>
            ) : (
              <div className="space-y-3">
                {recentSensors.map((sensor) => {
                  const BatteryIcon = getBatteryIcon(sensor.batteryLevel);
                  const batteryColor = getBatteryColor(sensor.batteryLevel);
                  return (
                    <div
                      key={sensor._id}
                      className="border border-[#1C2B24] rounded-xl p-4 hover:border-[#2A3B32] transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-[#EAF5EE] font-medium text-sm">
                            {sensor.name}
                          </h3>
                          <p className="text-[#6E877B] text-xs mt-0.5">
                            {sensor.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              sensor.status === "Active"
                                ? "bg-[#6BFFB8]/10 text-[#6BFFB8]"
                                : "bg-[#FF6B6B]/10 text-[#FF6B6B]"
                            }`}
                          >
                            {sensor.status}
                          </span>
                          <div className="flex items-center gap-1 mt-1 justify-end">
                            <BatteryIcon
                              size={12}
                              style={{ color: batteryColor }}
                            />
                            <span
                              className="text-xs"
                              style={{ color: batteryColor }}
                            >
                              {sensor.batteryLevel ?? 100}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="hud-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-[#FFC163]" />
                <h2 className="hud-display text-lg font-semibold">
                  Recent Orders
                </h2>
              </div>
              <a
                href="/orders"
                className="text-xs text-[#6E877B] hover:text-[#B7C7BE] flex items-center gap-1 transition-colors"
              >
                View all <ArrowUpRight size={13} />
              </a>
            </div>

            {loading ? (
              <div className="space-y-3">
                <SkeletonLine w="w-full" />
                <SkeletonLine w="w-full" />
                <SkeletonLine w="w-2/3" />
              </div>
            ) : dashboard.recentOrders.length === 0 ? (
              <p className="text-[#6E877B] text-sm py-6 text-center">
                No orders yet
              </p>
            ) : (
              <div className="space-y-3">
                {dashboard.recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-[#1C2B24] rounded-xl p-4 hover:border-[#2A3B32] transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-[#EAF5EE] font-medium text-sm">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <span className="text-[#FFC163] hud-mono text-sm font-semibold">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[#6E877B] text-xs">
                        {order.paymentMethod}
                      </p>
                      <span className="text-[#6BFFB8] text-xs px-2 py-0.5 rounded-full bg-[#6BFFB8]/10">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            System Overview + Quick Actions
        ===================================================== */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="hud-panel rounded-2xl p-6 lg:col-span-2">
            <h2 className="hud-display text-lg font-semibold mb-6">
              System Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-[#6E877B] text-xs uppercase tracking-wider">
                  Total Farms
                </p>
                <p className="text-2xl font-bold text-[#6BFFB8] mt-1">
                  {dashboard.totalFarms}
                </p>
              </div>
              <div>
                <p className="text-[#6E877B] text-xs uppercase tracking-wider">
                  Equipment
                </p>
                <p className="text-2xl font-bold text-[#4FD1FF] mt-1">
                  {dashboard.totalEquipment}
                </p>
              </div>
              <div>
                <p className="text-[#6E877B] text-xs uppercase tracking-wider">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-[#FFC163] mt-1">
                  {dashboard.totalOrders}
                </p>
              </div>
              <div>
                <p className="text-[#6E877B] text-xs uppercase tracking-wider">
                  Alerts
                </p>
                <p className="text-2xl font-bold text-[#FF6B6B] mt-1">
                  {dashboard.totalAlerts}
                </p>
              </div>
            </div>
            <hr className="border-[#1C2B24] my-4" />
            <div className="flex justify-between items-center">
              <span className="text-[#6E877B] text-sm">System Status</span>
              <span className="text-[#6BFFB8] text-sm flex items-center gap-2 font-medium">
                <Radio size={12} className="hud-blink" />
                Online
              </span>
            </div>
          </div>

          <div className="hud-panel rounded-2xl p-6">
            <h2 className="hud-display text-lg font-semibold mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction
                label="Add Farm"
                icon={PlusCircle}
                accent="#6BFFB8"
                href="/add-farm"
              />
              <QuickAction
                label="Add Equipment"
                icon={Tractor}
                accent="#4FD1FF"
                href="/add-equipment"
              />
              <QuickAction
                label="Marketplace"
                icon={ShoppingCart}
                accent="#FFC163"
                href="/marketplace"
              />
              <QuickAction
                label="Orders"
                icon={Package}
                accent="#FF6B6B"
                href="/orders"
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            Footer
        ===================================================== */}
        <div className="pt-4 text-center text-[#6E877B] hud-mono text-xs">
          Smart Irrigation System Dashboard
          <br />
          Powered by React • Node.js • Express • MongoDB
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;