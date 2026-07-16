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

const Recommendation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    loadRecommendation();
  }, []);

  const loadRecommendation = async () => {
    try {
      const res = await getRecommendation(id);

      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to load recommendation");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <h2 className="text-3xl font-bold text-green-700">
            Loading Recommendation...
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  const weather = data.weather;

  return (
    <DashboardLayout>

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-3xl text-white p-8 shadow-xl">

        <h1 className="text-4xl font-bold">
          🌱 Irrigation Recommendation
        </h1>

        <p className="mt-3 text-lg">
          Smart recommendation generated using
          weather and farm information.
        </p>

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-5">
            Farm Information
          </h2>

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <Sprout className="text-green-700" />
              <span className="font-semibold">
                Farm :
              </span>
              {data.farm}
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-red-500" />
              <span className="font-semibold">
                Location :
              </span>
              {data.location}
            </div>

            <div className="flex items-center gap-3">
              <Sprout className="text-green-700" />
              <span className="font-semibold">
                Crop :
              </span>
              {data.crop}
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-5">
            Live Weather
          </h2>

          <div className="grid grid-cols-2 gap-5">

            <div className="bg-green-50 rounded-xl p-5">

              <Thermometer
                className="text-red-500 mb-3"
              />

              <h3 className="font-semibold">
                Temperature
              </h3>

              <p className="text-3xl font-bold mt-2">
                {weather.temperature}°C
              </p>

            </div>

            <div className="bg-blue-50 rounded-xl p-5">

              <Droplets
                className="text-blue-500 mb-3"
              />

              <h3 className="font-semibold">
                Humidity
              </h3>

              <p className="text-3xl font-bold mt-2">
                {weather.humidity}%
              </p>

            </div>

            <div className="bg-yellow-50 rounded-xl p-5">

              <Wind
                className="text-cyan-600 mb-3"
              />

              <h3 className="font-semibold">
                Wind
              </h3>

              <p className="text-3xl font-bold mt-2">
                {weather.windSpeed} m/s
              </p>

            </div>

            <div className="bg-orange-50 rounded-xl p-5">

              <CloudSun
                className="text-yellow-500 mb-3"
              />

              <h3 className="font-semibold">
                Condition
              </h3>

              <p className="text-xl font-bold mt-2">
                {weather.description}
              </p>

            </div>

          </div>

        </div>

      </div>
            <div className="grid lg:grid-cols-2 gap-6 mt-8">

        {/* Recommendation Card */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <div className="flex items-center gap-3 mb-5">

            {data.recommendation ===
            "No irrigation required today" ? (
              <CheckCircle2
                className="text-green-600"
                size={32}
              />
            ) : (
              <AlertTriangle
                className="text-orange-500"
                size={32}
              />
            )}

            <h2 className="text-2xl font-bold">
              Recommendation
            </h2>

          </div>

          <div
            className={`rounded-xl p-5 text-white ${
              data.recommendation ===
              "No irrigation required today"
                ? "bg-green-600"
                : "bg-orange-500"
            }`}
          >

            <h2 className="text-2xl font-bold">
              {data.recommendation}
            </h2>

          </div>

          <div className="mt-6 space-y-4">

            <div className="flex justify-between items-center">

              <span className="font-semibold">
                Water Required
              </span>

              <span className="text-xl font-bold text-blue-600">
                💧 {data.waterRequired}
              </span>

            </div>

            <div className="flex justify-between items-center">

              <span className="font-semibold flex items-center gap-2">
                <Clock3 size={18} />
                Best Time
              </span>

              <span className="text-lg font-bold">
                6:00 AM - 8:00 AM
              </span>

            </div>

          </div>

        </div>

        {/* Tips */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-5">
            Smart Tips
          </h2>

          <div className="space-y-4">

            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">

              ✅ Irrigate early morning for maximum efficiency.

            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">

              💧 Avoid overwatering to reduce water loss.

            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">

              🌤 Monitor weather daily before irrigation.

            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">

              🚜 Inspect irrigation equipment weekly.

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Recommendation;