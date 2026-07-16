import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFarm, updateFarm } from "../services/farmService";

const EditFarm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    farmName: "",
    location: "",
    cropType: "",
    area: "",
    soilType: "",
  });

  const [loading, setLoading] = useState(true);

  // Load Farm Details
  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const response = await getFarm(id);

        if (response.success) {
          setFormData({
            farmName: response.farm.farmName,
            location: response.farm.location,
            cropType: response.farm.cropType,
            area: response.farm.area,
            soilType: response.farm.soilType,
          });
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load farm");
      } finally {
        setLoading(false);
      }
    };

    fetchFarm();
  }, [id]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update Farm
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updateFarm(id, formData);

      alert(response.message);

      navigate("/farms");
    } catch (error) {
      console.error(error);
      alert("Failed to update farm");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">

      <h1 className="text-3xl font-bold text-green-700 mb-6">
        ✏️ Edit Farm
      </h1>

      <form onSubmit={handleSubmit}>

        <div className="mb-4">
          <label className="block mb-2">Farm Name</label>

          <input
            type="text"
            name="farmName"
            value={formData.farmName}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Location</label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Crop Type</label>

          <input
            type="text"
            name="cropType"
            value={formData.cropType}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Area (Acres)</label>

          <input
            type="number"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">Soil Type</label>

          <input
            type="text"
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Update Farm
        </button>

      </form>
    </div>
  );
};

export default EditFarm;