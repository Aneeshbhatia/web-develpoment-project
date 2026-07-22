import { useState } from "react";
import {
  updateSensor,
  deleteSensor,
  changeSensorStatus,
} from "../services/sensorService";

const InstalledSensorCard = ({ sensor, onRefresh }) => {
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: sensor.name,
    location: sensor.location,
    batteryLevel: sensor.batteryLevel,
    status: sensor.status,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await updateSensor(sensor._id, formData);

      if (res.success) {
        alert("Sensor updated successfully");
        setEditing(false);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update sensor");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this sensor?")) return;

    try {
      const res = await deleteSensor(sensor._id);

      if (res.success) {
        alert("Sensor deleted successfully");
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete sensor");
    }
  };

  const handleStatusChange = async (e) => {
    const status = e.target.value;

    try {
      const res = await changeSensorStatus(sensor._id, status);

      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          status,
        }));

        onRefresh();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <img
        src={sensor.image}
        alt={sensor.type}
        className="w-full h-52 object-cover"
      />

      <div className="p-5">
        <h2 className="text-xl font-bold">{sensor.type}</h2>

        {editing ? (
          <>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-3"
            />

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-3"
            />

            <input
              type="number"
              name="batteryLevel"
              value={formData.batteryLevel}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full border rounded p-2 mt-3"
            />

            <button
              onClick={handleUpdate}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
            >
              Save Changes
            </button>

            <button
              onClick={() => setEditing(false)}
              className="w-full mt-2 bg-gray-300 py-2 rounded-lg"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <p className="mt-3">
              <strong>Name:</strong> {sensor.name}
            </p>

            <p>
              <strong>Farm:</strong>{" "}
              {sensor.farm?.name || "Not Assigned"}
            </p>

            <p>
              <strong>Location:</strong> {sensor.location}
            </p>

            <p>
              <strong>Battery:</strong>{" "}
              {sensor.batteryLevel}%
            </p>

            <div className="mt-3">
              <label className="font-semibold">
                Status
              </label>

              <select
                value={formData.status}
                onChange={handleStatusChange}
                className="w-full border rounded-lg p-2 mt-1"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default InstalledSensorCard;