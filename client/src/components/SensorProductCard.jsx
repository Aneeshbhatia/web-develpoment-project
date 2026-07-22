import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InstallSensorModal from "./InstallSensorModal";
import {
  Battery,
  Star,
  ShoppingCart,
  Eye,
  Wifi,
} from "lucide-react";

const SensorProductCard = ({ product }) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover"
        />

        {/* Content */}
        <div className="p-5">

          {/* Category */}
          <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            {product.sensorType || product.category}
          </span>

          {/* Name */}
          <h2 className="text-xl font-bold mt-3">
            {product.name}
          </h2>

          {/* Brand */}
          <p className="text-gray-500 text-sm mt-1">
            Brand : {product.brand}
          </p>

          {/* Description */}
          <p className="text-gray-600 mt-3 line-clamp-3">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center mt-4 gap-2">
            <Star className="text-yellow-500 fill-yellow-500" size={18} />

            <span className="font-semibold">
              {product.rating || 4.8}
            </span>

            <span className="text-gray-500">
              ({product.reviews || 0} Reviews)
            </span>
          </div>

          {/* Battery */}
          <div className="flex items-center gap-2 mt-3 text-gray-600">
            <Battery size={18} />
            {product.batteryLife || "2 Years"}
          </div>

          {/* Connectivity */}
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <Wifi size={18} />
            {product.connectivity || "Wi-Fi"}
          </div>

          {/* Price */}
          <div className="mt-5">
            <span className="text-3xl font-bold text-green-700">
              ₹{product.price}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">

            <button
              onClick={() =>
                navigate(`/sensor/${product._id}`)
              }
              className="flex-1 border border-green-600 text-green-600 hover:bg-green-50 rounded-lg py-3 flex items-center justify-center gap-2"
            >
              <Eye size={18} />
              View
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Install
            </button>

          </div>

        </div>
      </div>

      {showModal && (
        <InstallSensorModal
          sensor={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default SensorProductCard;