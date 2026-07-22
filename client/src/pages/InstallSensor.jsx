import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getSensor } from "../services/sensorCatalogService";

const InstallSensor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sensor, setSensor] = useState(null);
  const [farms, setFarms] = useState([]);
  const [farmId, setFarmId] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const sensorRes = await getSensor(id);

      const farmRes = await axios.get(
        "http://localhost:5001/api/farms",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSensor(sensorRes.sensor);
      setFarms(farmRes.data.farms);
    } catch (error) {
      console.log(error);
      alert("Unable to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async () => {
    if (!farmId) {
      alert("Please select a farm");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5001/api/sensors",
        {
          farm: farmId,
          sensorCatalog: sensor._id,
          sensorName: sensor.name,
          sensorType: sensor.sensorType,
          brand: sensor.brand,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Sensor Installed Successfully!");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Installation Failed");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <div className="bg-white shadow-lg rounded-xl p-6">

        <h1 className="text-3xl font-bold mb-6">
          Install Sensor
        </h1>

        <img
          src={sensor.image}
          alt={sensor.name}
          className="w-full h-72 object-cover rounded-lg"
        />

        <h2 className="text-2xl font-bold mt-5">
          {sensor.name}
        </h2>

        <p className="text-gray-500">
          {sensor.brand}
        </p>

        <p className="mt-2">
          {sensor.description}
        </p>

        <div className="mt-6">

          <label className="font-semibold">
            Select Farm
          </label>

          <select
            className="w-full border rounded-lg p-3 mt-2"
            value={farmId}
            onChange={(e) => setFarmId(e.target.value)}
          >
            <option value="">
              Choose Farm
            </option>

            {farms.map((farm) => (
              <option
                key={farm._id}
                value={farm._id}
              >
                {farm.farmName}
              </option>
            ))}
          </select>

        </div>

        <button
          onClick={handleInstall}
          className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
        >
          Install Sensor
        </button>

      </div>

    </div>
  );
};

export default InstallSensor;