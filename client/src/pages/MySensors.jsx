import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Battery,
  MapPin,
  Cpu,
  Pencil,
  Trash2,
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";
import {
  getSensors,
  deleteSensor,
} from "../services/sensorService";

const MySensors = () => {
  const navigate = useNavigate();

  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    loadSensors();
  }, []);

  const loadSensors = async () => {
    try {
      setLoading(true);

      const res = await getSensors();

      if (res.success) {
        setSensors(res.sensors);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to load sensors");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sensor?")) return;

    try {
      const res = await deleteSensor(id);

      if (res.success) {
        setSensors((prev) =>
          prev.filter((sensor) => sensor._id !== id)
        );
      }
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  const filteredSensors = useMemo(() => {
    return sensors.filter((sensor) => {
      const matchesSearch =
        sensor.name.toLowerCase().includes(search.toLowerCase()) ||
        sensor.location?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || sensor.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [sensors, search, status]);

  return (
    <DashboardLayout>
      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              My Sensors
            </h1>

            <p className="text-gray-500">
              Manage all installed smart sensors.
            </p>
          </div>

        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-5 mb-8">

          <div className="grid md:grid-cols-2 gap-4">

            <div className="relative">

              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />

              <input
                type="text"
                placeholder="Search..."
                className="w-full border rounded-lg py-2 pl-10 pr-4"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <select
              className="border rounded-lg p-2"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Maintenance</option>
            </select>

          </div>

        </div>

        {/* Loading */}

        {loading ? (
          <div className="text-center py-20 text-xl">
            Loading Sensors...
          </div>
        ) : filteredSensors.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">

            <Cpu
              size={60}
              className="mx-auto text-gray-400"
            />

            <h2 className="text-2xl font-bold mt-5">
              No Installed Sensors
            </h2>

            <p className="text-gray-500 mt-2">
              Install sensors from Browse Sensors.
            </p>

          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">

            {filteredSensors.map((sensor) => (

              <div
                key={sensor._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >

                <img
                  src={sensor.image}
                  alt={sensor.name}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">

                  <div className="flex justify-between">

                    <h2 className="text-2xl font-bold">
                      {sensor.name}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        sensor.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : sensor.status === "Maintenance"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {sensor.status}
                    </span>

                  </div>

                  <div className="flex items-center gap-2 mt-4 text-gray-600">
                    <MapPin size={18} />
                    {sensor.location}
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-gray-600">
                    <Battery size={18} />
                    {sensor.batteryLevel}%
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">

                    <div
                      className={`h-3 rounded-full ${
                        sensor.batteryLevel > 60
                          ? "bg-green-500"
                          : sensor.batteryLevel > 30
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${sensor.batteryLevel}%`,
                      }}
                    />

                  </div>

                  <div className="mt-5 text-gray-600">

                    <p>
                      <strong>Farm :</strong>{" "}
                      {sensor.farm?.farmName || "N/A"}
                    </p>

                    <p>
                      <strong>Type :</strong> {sensor.type}
                    </p>

                  </div>

                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() =>
                        navigate(`/edit-sensor/${sensor._id}`)
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Pencil size={18} />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(sensor._id)
                      }
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default MySensors;