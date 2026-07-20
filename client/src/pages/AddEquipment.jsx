import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

import { getFarms } from "../services/farmService";
import { addEquipment } from "../services/equipmentService";

import { Tractor, Loader2 } from "lucide-react";

const EQUIPMENT_TYPES = ["Pump", "Sprinkler", "Valve", "Tractor", "Sensor"];
const STATUS_OPTIONS = ["Running", "Maintenance", "Offline"];

const fieldLabel =
  "text-[13px] font-medium text-[#B7C7BE] tracking-wide";
const fieldInput =
  "w-full mt-2 bg-[#0C1713] border border-[#1C2B24] focus:border-[#6BFFB8]/50 rounded-xl p-3 text-[#EAF5EE] placeholder:text-[#6E877B] outline-none transition-colors";

const AddEquipment = () => {
  const navigate = useNavigate();

  const [farms, setFarms] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "Running",
    lastService: "",
    farm: "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const response = await getFarms();
      if (response.success) {
        setFarms(response.farms);
      }
    } catch (error) {
      console.error("Failed to load farms:", error);
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
    if (submitting) return;

    setSubmitting(true);
    try {
      const response = await addEquipment(formData);
      alert(response.message);
      navigate("/equipment");
    } catch (error) {
      console.error("Failed to add equipment:", error);
      alert("Failed to add equipment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#080C0A] px-6 md:px-10 py-8">
        <div className="max-w-2xl mx-auto hud-panel rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#4FD1FF]/10">
              <Tractor size={22} className="text-[#4FD1FF]" />
            </div>
            <div>
              <h1 className="hud-display text-2xl font-semibold text-[#EAF5EE]">
                Add Equipment
              </h1>
              <p className="text-[#6E877B] text-sm mt-0.5">
                Register new equipment to a farm.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={fieldLabel}>Equipment Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={fieldInput}
                placeholder="Water Pump"
                required
              />
            </div>

            <div>
              <label className={fieldLabel}>Equipment Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={fieldInput}
                required
              >
                <option value="">Select Type</option>
                {EQUIPMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={fieldLabel}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={fieldInput}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Farm */}
            <div>
              <label className={fieldLabel}>Select Farm</label>
              <select
                name="farm"
                value={formData.farm}
                onChange={handleChange}
                className={fieldInput}
                required
              >
                <option value="">Select Farm</option>
                {farms.map((farm) => (
                  <option key={farm._id} value={farm._id}>
                    {farm.farmName}
                  </option>
                ))}
              </select>
            </div>

            {/* Last Service */}
            <div>
              <label className={fieldLabel}>Last Service Date</label>
              <input
                type="date"
                name="lastService"
                value={formData.lastService}
                onChange={handleChange}
                className={`${fieldInput} [color-scheme:dark]`}
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#6BFFB8] hover:bg-[#57f3a2] disabled:opacity-60 disabled:cursor-not-allowed text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Equipment"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/equipment")}
                disabled={submitting}
                className="flex-1 bg-[#0C1713] border border-[#1C2B24] hover:border-[#2A3B32] text-[#B7C7BE] py-3 rounded-xl font-semibold transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddEquipment;