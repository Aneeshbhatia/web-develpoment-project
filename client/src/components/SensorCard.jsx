import InstallSensorModal from "./InstallSensorModal";

const SensorCard = ({ sensor, onInstalled }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
      <img
        src={sensor.image}
        alt={sensor.type}
        className="w-full h-52 object-cover"
      />

      <div className="p-5">
        <h2 className="text-2xl font-bold">{sensor.type}</h2>

        <p className="text-gray-600 mt-2">
          {sensor.description}
        </p>

        <div className="mt-6">
          <InstallSensorModal
            sensor={sensor}
            onInstalled={onInstalled}
          />
        </div>
      </div>
    </div>
  );
};

export default SensorCard;