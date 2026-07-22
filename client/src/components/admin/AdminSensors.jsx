import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getSensors,
  deleteSensor,
} from "../../services/sensorCatalogService";

const AdminSensors = () => {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSensors = async () => {
    try {
      const res = await getSensors();
      setSensors(res.sensors);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sensor?")) return;

    try {
      await deleteSensor(id);
      fetchSensors();
    } catch (err) {
      console.log(err);
      alert("Failed to delete sensor");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-xl">
        Loading Sensors...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Sensor Catalog
        </h1>

        <Link
          to="/admin/add-sensor"
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          + Add Sensor
        </Link>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white">

          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sensors.map((sensor) => (
              <tr
                key={sensor._id}
                className="border-b text-center"
              >
                <td className="p-3">
                  <img
                    src={sensor.image}
                    alt={sensor.name}
                    className="w-16 h-16 object-cover rounded mx-auto"
                  />
                </td>

                <td>{sensor.name}</td>

                <td>{sensor.sensorType}</td>

                <td>{sensor.brand}</td>

                <td>₹{sensor.price}</td>

                <td>{sensor.stock}</td>

                <td className="space-x-2">

                  <Link
                    to={`/admin/edit-sensor/${sensor._id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(sensor._id)
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminSensors;