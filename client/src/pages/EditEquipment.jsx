import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { getFarms } from "../services/farmService";
import {
  getEquipment,
  updateEquipment,
} from "../services/equipmentService";

const EditEquipment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [farms, setFarms] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "",
    lastService: "",
    farm: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const farmRes = await getFarms();

      if (farmRes.success) {
        setFarms(farmRes.farms);
      }

      const equipmentRes = await getEquipment();

      const equipment = equipmentRes.equipment.find(
        (item) => item._id === id
      );

      if (equipment) {
        setFormData({
          name: equipment.name,
          type: equipment.type,
          status: equipment.status,
          lastService: equipment.lastService.slice(0, 10),
          farm: equipment.farm._id,
        });
      }
    } catch (error) {
      console.log(error);
      alert("Failed to load equipment");
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
      const response = await updateEquipment(
        id,
        formData
      );

      alert(response.message);

      navigate("/equipment");
    } catch (error) {
      console.log(error);

      alert("Update Failed");
    }
  };

  return (
    <DashboardLayout>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-green-700 mb-8">
          ✏ Edit Equipment
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
              <option value="Pump">Pump</option>
              <option value="Sprinkler">Sprinkler</option>
              <option value="Valve">Valve</option>
              <option value="Tractor">Tractor</option>
              <option value="Sensor">Sensor</option>
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
              <option value="Running">Running</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Offline">Offline</option>
            </select>

          </div>
                    {/* Farm */}

          <div>
            <label className="font-semibold">
              Farm
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
              Last Service
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
              Update Equipment
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

export default EditEquipment;