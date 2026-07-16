import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

import { getFarms } from "../services/farmService";
import { addEquipment } from "../services/equipmentService";

const AddEquipment = () => {
  const navigate = useNavigate();

  const [farms, setFarms] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "Running",
    lastService: "",
    farm: "",
  });

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const response = await getFarms();

      if (response.success) {
        setFarms(response.farms);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await addEquipment(formData);

      alert(response.message);

      navigate("/equipment");
    } catch (error) {
      console.log(error);

      alert("Failed to add equipment");
    }
  };

  return (
    <DashboardLayout>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-green-700 mb-8">
          🚜 Add Equipment
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="font-semibold">
              Equipment Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-2 border rounded-xl p-3"
              placeholder="Water Pump"
              required
            />

          </div>

          <div>

            <label className="font-semibold">
              Equipment Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full mt-2 border rounded-xl p-3"
              required
            >
              <option value="">
                Select Type
              </option>

              <option>
                Pump
              </option>

              <option>
                Sprinkler
              </option>

              <option>
                Valve
              </option>

              <option>
                Tractor
              </option>

              <option>
                Sensor
              </option>

            </select>

          </div>

          <div>

            <label className="font-semibold">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full mt-2 border rounded-xl p-3"
            >
              <option>
                Running
              </option>

              <option>
                Maintenance
              </option>

              <option>
                Offline
              </option>

            </select>

          </div>
                    {/* Farm */}

          <div>

            <label className="font-semibold">
              Select Farm
            </label>

            <select
              name="farm"
              value={formData.farm}
              onChange={handleChange}
              className="w-full mt-2 border rounded-xl p-3"
              required
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

          {/* Last Service */}

          <div>

            <label className="font-semibold">
              Last Service Date
            </label>

            <input
              type="date"
              name="lastService"
              value={formData.lastService}
              onChange={handleChange}
              className="w-full mt-2 border rounded-xl p-3"
              required
            />

          </div>

          {/* Buttons */}

          <div className="flex gap-4 pt-4">

            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
            >
              Save Equipment
            </button>

            <button
              type="button"
              onClick={() => navigate("/equipment")}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </DashboardLayout>
  );
};

export default AddEquipment;