import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSensor,
  updateSensor,
} from "../../services/sensorCatalogService";

const EditSensor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    sensorType: "",
    description: "",
    price: "",
    stock: "",
    batteryLife: "",
    connectivity: "",
    warranty: "",
    rating: "",
    reviews: "",
    image: "",
  });

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    loadSensor();
  }, []);

  const loadSensor = async () => {
    try {
      const res = await getSensor(id);
      setFormData(res.sensor);
    } catch (error) {
      console.log(error);
      alert("Unable to load sensor");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateSensor(id, formData);
      alert("Sensor Updated Successfully!");
      navigate("/admin/sensors");
    } catch (error) {
      console.log(error);
      alert("Failed to update sensor");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Edit Sensor
      </h1>

      <form
        onSubmit={onSubmit}
        className="bg-white shadow-lg rounded-lg p-6 space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Sensor Name"
          value={formData.name}
          onChange={onChange}
          required
          className="w-full border rounded p-3"
        />

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={onChange}
          required
          className="w-full border rounded p-3"
        />

        <select
          name="sensorType"
          value={formData.sensorType}
          onChange={onChange}
          required
          className="w-full border rounded p-3"
        >
          <option value="">Select Sensor Type</option>
          <option value="Soil Moisture">Soil Moisture</option>
          <option value="Temperature">Temperature</option>
          <option value="Humidity">Humidity</option>
          <option value="Rain">Rain</option>
          <option value="Water Level">Water Level</option>
          <option value="Light">Light</option>
          <option value="pH">pH</option>
          <option value="Pressure">Pressure</option>
        </select>

        <textarea
          name="description"
          rows="4"
          placeholder="Description"
          value={formData.description}
          onChange={onChange}
          className="w-full border rounded p-3"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={onChange}
          required
          className="w-full border rounded p-3"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={onChange}
          required
          className="w-full border rounded p-3"
        />

        <input
          type="text"
          name="batteryLife"
          placeholder="Battery Life"
          value={formData.batteryLife}
          onChange={onChange}
          className="w-full border rounded p-3"
        />

        <input
          type="text"
          name="connectivity"
          placeholder="Connectivity"
          value={formData.connectivity}
          onChange={onChange}
          className="w-full border rounded p-3"
        />

        <input
          type="text"
          name="warranty"
          placeholder="Warranty"
          value={formData.warranty}
          onChange={onChange}
          className="w-full border rounded p-3"
        />

        <input
          type="number"
          step="0.1"
          name="rating"
          placeholder="Rating"
          value={formData.rating}
          onChange={onChange}
          className="w-full border rounded p-3"
        />

        <input
          type="number"
          name="reviews"
          placeholder="Reviews"
          value={formData.reviews}
          onChange={onChange}
          className="w-full border rounded p-3"
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={onChange}
          className="w-full border rounded p-3"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
        >
          Update Sensor
        </button>
      </form>
    </div>
  );
};

export default EditSensor;