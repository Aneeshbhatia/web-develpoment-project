import { useEffect, useState } from "react";
import { addSensor } from "../services/sensorService";
import { getFarms } from "../services/farmService";

const InstallSensorModal = ({ sensor, onClose, onInstalled }) => {
  const [farms, setFarms] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    farm: "",
    location: "",
    batteryLevel: 100,
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const res = await getFarms();

      if (res.success) {
        setFarms(res.farms);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to load farms");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInstall = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        type: sensor.type,
      };

      const res = await addSensor(payload);

      if (res.success) {
        alert("Sensor installed successfully!");

        if (onInstalled) {
          onInstalled();
        }

        onClose();
      }
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Failed to install sensor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold mb-6">
          Install {sensor.type} Sensor
        </h2>

        <form onSubmit={handleInstall} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Sensor Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <select
            name="farm"
            value={formData.farm}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select Farm</option>

            {farms.map((farm) => (
              <option
                key={farm._id}
                value={farm._id}
              >
                {farm.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            name="batteryLevel"
            value={formData.batteryLevel}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full border rounded-lg p-3"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
            >
              {loading ? "Installing..." : "Install Sensor"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default InstallSensorModal;