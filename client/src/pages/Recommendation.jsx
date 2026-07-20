import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { getRecommendation } from "../services/recommendationService";
import {
  CloudSun,
  Droplets,
  Thermometer,
  Wind,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  MapPin,
  Sprout,
} from "lucide-react";

const NO_IRRIGATION_MESSAGE = "No irrigation required today";

const Recommendation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadRecommendation();
  }, [id]);

  const loadRecommendation = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await getRecommendation(id);

      if (res.success) {
        setData(res);
      } else {
        setErrorMessage(res.message || "Failed to load recommendation.");
      }
    } catch (err) {
      console.error("Failed to load recommendation:", err);
      setErrorMessage("Failed to load recommendation.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#080C0A] flex justify-center items-center h-[70vh]">
          <div className="flex items-center gap-3 text-[#6E877B] hud-mono">
            <div className="w-4 h-4 rounded-full border-2 border-[#6BFFB8] border-t-transparent animate-spin" />
            Loading recommendation...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (errorMessage || !data?.weather) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#080C0A] flex justify-center items-center px-6">
          <div className="hud-panel rounded-2xl p-8 max-w-md text-center">
            <div className="w-12 h-12 rounded-xl bg-[#FF6B6B]/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-[#FF6B6B]" />
            </div>
            <h2 className="hud-display text-lg font-semibold text-[#EAF5EE] mb-2">
              Couldn't load recommendation
            </h2>
            <p className="text-[#6E877B] text-sm">
              {errorMessage || "Something went wrong. Please try again."}
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={loadRecommendation}
                className="flex-1 bg-[#6BFFB8]/10 hover:bg-[#6BFFB8]/20 text-[#6BFFB8] px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-[#0C1713] border border-[#1C2B24] hover:border-[#2A3B32] text-[#B7C7BE] px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { weather } = data;
  const isHealthy = data.recommendation === NO_IRRIGATION_MESSAGE;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#080C0A] text-[#EAF5EE] px-6 md:px-10 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 bg-[#0C1713] border border-[#1C2B24] hover:border-[#2A3B32] text-[#B7C7BE] px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Hero */}
        <div className="hud-panel rounded-3xl p-8 border-[#6BFFB8]/20">
          <div className="flex items-center gap-3">
            <Sprout size={26} className="text-[#6BFFB8]" />
            <h1 className="hud-display text-2xl md:text-3xl font-semibold">
              Irrigation Recommendation
            </h1>
          </div>
          <p className="mt-3 text-[#B7C7BE] text-sm md:text-base">
            Smart recommendation generated using live weather and farm
            information.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Farm Information */}
          <div className="hud-panel rounded-2xl p-6">
            <h2 className="hud-display text-lg font-semibold mb-5">
              Farm Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Sprout size={18} className="text-[#6BFFB8] shrink-0" />
                <span className="font-medium text-[#B7C7BE]">Farm :</span>
                <span className="text-[#EAF5EE]">{data.farm}</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <MapPin size={18} className="text-[#FF6B6B] shrink-0" />
                <span className="font-medium text-[#B7C7BE]">
                  Location :
                </span>
                <span className="text-[#EAF5EE]">{data.location}</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Sprout size={18} className="text-[#6BFFB8] shrink-0" />
                <span className="font-medium text-[#B7C7BE]">Crop :</span>
                <span className="text-[#EAF5EE]">{data.crop}</span>
              </div>
            </div>
          </div>

          {/* Live Weather */}
          <div className="hud-panel rounded-2xl p-6">
            <h2 className="hud-display text-lg font-semibold mb-5">
              Live Weather
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl p-5 border border-[#1C2B24] bg-[#0E1512]">
                <Thermometer size={20} className="text-[#FF6B6B] mb-3" />
                <h3 className="text-[11px] uppercase tracking-[0.15em] hud-mono text-[#6E877B]">
                  Temperature
                </h3>
                <p className="hud-mono text-2xl font-semibold mt-2 text-[#EAF5EE]">
                  {weather.temperature}°C
                </p>
              </div>

              <div className="rounded-xl p-5 border border-[#1C2B24] bg-[#0E1512]">
                <Droplets size={20} className="text-[#4FD1FF] mb-3" />
                <h3 className="text-[11px] uppercase tracking-[0.15em] hud-mono text-[#6E877B]">
                  Humidity
                </h3>
                <p className="hud-mono text-2xl font-semibold mt-2 text-[#EAF5EE]">
                  {weather.humidity}%
                </p>
              </div>

              <div className="rounded-xl p-5 border border-[#1C2B24] bg-[#0E1512]">
                <Wind size={20} className="text-[#4FD1FF] mb-3" />
                <h3 className="text-[11px] uppercase tracking-[0.15em] hud-mono text-[#6E877B]">
                  Wind
                </h3>
                <p className="hud-mono text-2xl font-semibold mt-2 text-[#EAF5EE]">
                  {weather.windSpeed} m/s
                </p>
              </div>

              <div className="rounded-xl p-5 border border-[#1C2B24] bg-[#0E1512]">
                <CloudSun size={20} className="text-[#FFC163] mb-3" />
                <h3 className="text-[11px] uppercase tracking-[0.15em] hud-mono text-[#6E877B]">
                  Condition
                </h3>
                <p className="text-base font-semibold mt-2 text-[#EAF5EE]">
                  {weather.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Recommendation Card */}
          <div className="hud-panel rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              {isHealthy ? (
                <CheckCircle2 className="text-[#6BFFB8]" size={26} />
              ) : (
                <AlertTriangle className="text-[#FFC163]" size={26} />
              )}
              <h2 className="hud-display text-lg font-semibold">
                Recommendation
              </h2>
            </div>

            <div
              className={`rounded-xl p-5 ${
                isHealthy
                  ? "bg-[#6BFFB8]/10 border border-[#6BFFB8]/30"
                  : "bg-[#FFC163]/10 border border-[#FFC163]/30"
              }`}
            >
              <h2
                className={`text-xl font-semibold ${
                  isHealthy ? "text-[#6BFFB8]" : "text-[#FFC163]"
                }`}
              >
                {data.recommendation}
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#B7C7BE] text-sm flex items-center gap-2">
                  <Droplets size={16} className="text-[#4FD1FF]" />
                  Water Required
                </span>
                <span className="text-lg font-semibold hud-mono text-[#4FD1FF]">
                  {data.waterRequired}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-[#B7C7BE] text-sm flex items-center gap-2">
                  <Clock3 size={16} className="text-[#6E877B]" />
                  Best Time
                </span>
                <span className="text-base font-semibold text-[#EAF5EE]">
                  6:00 AM - 8:00 AM
                </span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="hud-panel rounded-2xl p-6">
            <h2 className="hud-display text-lg font-semibold mb-5">
              Smart Tips
            </h2>

            <div className="space-y-3">
              <div className="border-l-2 border-[#6BFFB8] bg-[#6BFFB8]/5 p-4 rounded-r-lg text-sm text-[#B7C7BE]">
                Irrigate early morning for maximum efficiency.
              </div>
              <div className="border-l-2 border-[#4FD1FF] bg-[#4FD1FF]/5 p-4 rounded-r-lg text-sm text-[#B7C7BE]">
                Avoid overwatering to reduce water loss.
              </div>
              <div className="border-l-2 border-[#FFC163] bg-[#FFC163]/5 p-4 rounded-r-lg text-sm text-[#B7C7BE]">
                Monitor weather daily before irrigation.
              </div>
              <div className="border-l-2 border-[#FF6B6B] bg-[#FF6B6B]/5 p-4 rounded-r-lg text-sm text-[#B7C7BE]">
                Inspect irrigation equipment weekly.
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Recommendation;