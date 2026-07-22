import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSensors } from "../services/sensorCatalogService";

const BrowseSensors = () => {
  const [sensors, setSensors] = useState([]);
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sensorType, setSensorType] = useState("All");

  useEffect(() => {
    fetchSensors();
  }, []);

  useEffect(() => {
    filterSensors();
  }, [search, sensorType, sensors]);

  const fetchSensors = async () => {
    try {
      const res = await getSensors();
      setSensors(res.sensors);
      setFilteredSensors(res.sensors);
    } catch (err) {
      console.log(err);
      alert("Failed to load sensors");
    } finally {
      setLoading(false);
    }
  };

  const filterSensors = () => {
    let data = [...sensors];

    if (sensorType !== "All") {
      data = data.filter(
        (sensor) => sensor.sensorType === sensorType
      );
    }

    if (search.trim() !== "") {
      data = data.filter(
        (sensor) =>
          sensor.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          sensor.brand
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    setFilteredSensors(data);
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-2xl">
        Loading Sensors...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-4xl font-bold text-center mb-8">
        Browse Sensors
      </h1>

      <div className="grid md:grid-cols-2 gap-4 mb-8">

        <input
          type="text"
          placeholder="Search Sensors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-3"
        />

        <select
          value={sensorType}
          onChange={(e) => setSensorType(e.target.value)}
          className="border rounded-lg p-3"
        >
          <option value="All">All Sensors</option>
          <option value="Soil Moisture">
            Soil Moisture
          </option>
          <option value="Temperature">
            Temperature
          </option>
          <option value="Humidity">
            Humidity
          </option>
          <option value="Rain">
            Rain
          </option>
          <option value="Water Level">
            Water Level
          </option>
          <option value="Light">
            Light
          </option>
          <option value="pH">
            pH
          </option>
          <option value="Pressure">
            Pressure
          </option>
        </select>

      </div>

      {filteredSensors.length === 0 ? (
        <div className="text-center text-xl mt-20">
          No Sensors Found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredSensors.map((sensor) => (

            <div
              key={sensor._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={sensor.image}
                alt={sensor.name}
                className="h-52 w-full object-cover"
              />

              <div className="p-5">

                <h2 className="text-xl font-bold">
                  {sensor.name}
                </h2>

                <p className="text-gray-500">
                  {sensor.brand}
                </p>

                <p className="mt-2">
                  <strong>Type:</strong>{" "}
                  {sensor.sensorType}
                </p>

                <p>
                  <strong>Battery:</strong>{" "}
                  {sensor.batteryLife}
                </p>

                <p>
                  <strong>Connectivity:</strong>{" "}
                  {sensor.connectivity}
                </p>

                <p>
                  <strong>Warranty:</strong>{" "}
                  {sensor.warranty}
                </p>

                <p className="text-yellow-600 font-semibold mt-2">
                  ⭐ {sensor.rating} ({sensor.reviews} Reviews)
                </p>

                <p className="text-2xl text-green-700 font-bold mt-3">
                  ₹{sensor.price}
                </p>

                <div className="mt-5">

                  <Link
                    to={`/sensor/${sensor._id}`}
                    className="block text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                  >
                    View Details
                  </Link>

                </div>

              </div>
            </div>

          ))}

        </div>
      )}
    </div>
  );
};

export default BrowseSensors;