import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSensor } from "../services/sensorCatalogService";

const SensorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sensor, setSensor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSensor();
  }, []);

  const loadSensor = async () => {
    try {
      const res = await getSensor(id);
      setSensor(res.sensor);
    } catch (error) {
      console.log(error);
      alert("Unable to load sensor");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-2xl">
        Loading...
      </div>
    );
  }

  if (!sensor) {
    return (
      <div className="text-center mt-10 text-2xl">
        Sensor Not Found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="grid md:grid-cols-2 gap-10">

        <img
          src={sensor.image}
          alt={sensor.name}
          className="w-full rounded-xl shadow-lg"
        />

        <div>

          <h1 className="text-4xl font-bold mb-2">
            {sensor.name}
          </h1>

          <p className="text-xl text-gray-600 mb-4">
            {sensor.brand}
          </p>

          <p className="mb-5">
            {sensor.description}
          </p>

          <div className="space-y-3">

            <p>
              <strong>Sensor Type:</strong>{" "}
              {sensor.sensorType}
            </p>

            <p>
              <strong>Battery Life:</strong>{" "}
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

            <p>
              <strong>Stock:</strong>{" "}
              {sensor.stock}
            </p>

            <p>
              <strong>Rating:</strong> ⭐{" "}
              {sensor.rating}
            </p>

            <p>
              <strong>Reviews:</strong>{" "}
              {sensor.reviews}
            </p>

          </div>

          <h2 className="text-4xl text-green-700 font-bold mt-8">
            ₹{sensor.price}
          </h2>

          <div className="flex gap-4 mt-8">

            <button
              onClick={() =>
                navigate(`/install-sensor/${sensor._id}`)
              }
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
            >
              Install Sensor
            </button>

            <button
              onClick={() => navigate("/sensors")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg"
            >
              Back
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SensorDetails;