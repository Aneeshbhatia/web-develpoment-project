import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getFarms } from "../services/farmService";
import { addSensor } from "../services/sensorService";

const InstallSensorModal = ({ sensor, onClose }) => {
  const [farms, setFarms] = useState([]);

  const [form, setForm] = useState({
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
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleInstall = async () => {
    if (!form.farm) {
      return alert("Please select a farm");
    }

    try {
      setLoading(true);

      const payload = {
        name: sensor.name,
        type: sensor.sensorType || sensor.category,
        image: sensor.image,
        farm: form.farm,
        location: form.location,
        batteryLevel: Number(form.batteryLevel),
        status: form.status,
      };

      const res = await addSensor(payload);

      if (res.success) {
        alert("Sensor Installed Successfully");
        onClose();
      }
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
          "Installation Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">

        <button
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          Install Sensor
        </h2>

        <div className="flex items-center gap-4 mb-6">

          <img
            src={sensor.image}
            alt={sensor.name}
            className="w-24 h-24 rounded-lg object-cover"
          />

          <div>

            <h3 className="text-xl font-semibold">
              {sensor.name}
            </h3>

            <p className="text-gray-500">
              {sensor.brand}
            </p>

            <p className="text-green-600 font-bold mt-2">
              ₹{sensor.price}
            </p>

          </div>

        </div>

        <div className="space-y-4">

          <div>

            <label className="block mb-2 font-medium">
              Select Farm
            </label>

            <select
              name="farm"
              value={form.farm}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="">
                Select Farm
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

          <div>

            <label className="block mb-2 font-medium">
              Installation Location
            </label>

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="North Field"
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Battery Level
            </label>

            <input
              type="number"
              name="batteryLevel"
              value={form.batteryLevel}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Maintenance</option>
            </select>

          </div>

          <button
            onClick={handleInstall}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Installing..." : "Install Sensor"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default InstallSensorModal;