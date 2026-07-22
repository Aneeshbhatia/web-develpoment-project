import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addSensor } from "../../services/sensorCatalogService";

const AddSensor = () => {
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

  const {
    name,
    brand,
    sensorType,
    description,
    price,
    stock,
    batteryLife,
    connectivity,
    warranty,
    rating,
    reviews,
    image,
  } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await addSensor(formData);
      alert("Sensor Added Successfully!");
      navigate("/admin/sensors");
    } catch (error) {
      console.log(error);
      alert("Failed to add sensor");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Add New Sensor
      </h1>

      <form
        onSubmit={onSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Sensor Name"
          value={name}
          onChange={onChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={brand}
          onChange={onChange}
          required
          className="w-full border p-3 rounded"
        />

        <select
          name="sensorType"
          value={sensorType}
          onChange={onChange}
          required
          className="w-full border p-3 rounded"
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
          placeholder="Description"
          value={description}
          onChange={onChange}
          rows="4"
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={price}
          onChange={onChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={stock}
          onChange={onChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="batteryLife"
          placeholder="Battery Life (e.g. 2 Years)"
          value={batteryLife}
          onChange={onChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="connectivity"
          placeholder="Connectivity (WiFi/Bluetooth/LoRa)"
          value={connectivity}
          onChange={onChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="warranty"
          placeholder="Warranty"
          value={warranty}
          onChange={onChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          step="0.1"
          name="rating"
          placeholder="Rating"
          value={rating}
          onChange={onChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="reviews"
          placeholder="Reviews"
          value={reviews}
          onChange={onChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={image}
          onChange={onChange}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
        >
          Add Sensor
        </button>
      </form>
    </div>
  );
};

export default AddSensor;