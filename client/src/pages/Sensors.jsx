import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import SensorCard from "../components/SensorCard";
import InstalledSensorCard from "../components/InstalledSensorCard";

import sensors from "../data/sensorCatalog";
import { getSensors } from "../services/sensorService";

const Sensors = () => {
  const [installedSensors, setInstalledSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInstalledSensors = async () => {
    try {
      const res = await getSensors();

      if (res.success) {
        setInstalledSensors(res.sensors);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load sensors");
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadInstalledSensors();
      setLoading(false);
    };

    init();
  }, []);

  const refreshSensors = async () => {
    await loadInstalledSensors();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[70vh] text-2xl font-semibold">
          Loading Sensors...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-12">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Smart Sensors
            </h1>
            <p className="text-gray-500 mt-2">
              Monitor and manage all sensors installed on your farms.
            </p>
          </div>

          <div className="bg-green-100 text-green-700 px-5 py-3 rounded-xl font-semibold">
            Installed : {installedSensors.length}
          </div>
        </div>

        {/* Installed Sensors */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Installed Sensors
          </h2>

          {installedSensors.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-10 text-center">
              <h3 className="text-xl font-semibold mb-2">
                No Sensors Installed
              </h3>

              <p className="text-gray-500">
                Install a smart sensor from the catalog below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {installedSensors.map((sensor) => (
                <InstalledSensorCard
                  key={sensor._id}
                  sensor={sensor}
                  onRefresh={refreshSensors}
                />
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <hr />

        {/* Available Sensors */}
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Available Sensor Types
          </h2>

          <p className="text-gray-500 mb-8">
            Choose a sensor below and install it on any of your farms.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sensors.map((sensor) => (
              <SensorCard
                key={sensor.id}
                sensor={sensor}
                onInstalled={refreshSensors}
              />
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Sensors;