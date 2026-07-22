
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { getSensor, updateSensor } from "../services/sensorService";
import { getFarms } from "../services/farmService";

export default function EditSensor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [farms,setFarms]=useState([]);
  const [formData,setFormData]=useState({
    name:"",type:"",farm:"",location:"",
    batteryLevel:100,status:"Active"
  });

  useEffect(()=>{
    (async()=>{
      try{
        const [sr,fr]=await Promise.all([getSensor(id),getFarms()]);
        if(sr.success){
          const s=sr.sensor;
          setFormData({
            name:s.name||"",
            type:s.type||"",
            farm:s.farm?._id||"",
            location:s.location||"",
            batteryLevel:s.batteryLevel??100,
            status:s.status||"Active"
          });
        }
        if(fr.success) setFarms(fr.farms);
      }finally{
        setLoading(false);
      }
    })();
  },[id]);

  const handleChange=e=>{
    setFormData({...formData,[e.target.name]:e.target.value});
  };

  const handleSubmit=async e=>{
    e.preventDefault();
    setSaving(true);
    try{
      const res=await updateSensor(id,formData);
      if(res.success){
        alert("Sensor updated successfully");
        navigate("/equipment");
      }
    }catch(e){
      alert("Failed to update sensor");
    }finally{
      setSaving(false);
    }
  };

  if(loading){
    return <DashboardLayout><div className="p-10 text-center">Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Edit Sensor</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input className="w-full border rounded-lg p-3" name="name" value={formData.name} onChange={handleChange} placeholder="Sensor Name"/>
          <input className="w-full border rounded-lg p-3 bg-gray-100" value={formData.type} disabled />
          <select className="w-full border rounded-lg p-3" name="farm" value={formData.farm} onChange={handleChange}>
            <option value="">Select Farm</option>
            {farms.map(f=><option key={f._id} value={f._id}>{f.farmName||f.name}</option>)}
          </select>
          <input className="w-full border rounded-lg p-3" name="location" value={formData.location} onChange={handleChange} placeholder="Location"/>
          <div>
            <label>Battery ({formData.batteryLevel}%)</label>
            <input className="w-full" type="range" min="0" max="100" name="batteryLevel" value={formData.batteryLevel} onChange={handleChange}/>
          </div>
          <select className="w-full border rounded-lg p-3" name="status" value={formData.status} onChange={handleChange}>
            <option>Active</option>
            <option>Inactive</option>
            <option>Calibrating</option>
            <option>Maintenance</option>
          </select>
          <div className="flex gap-4">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg" disabled={saving}>
              {saving?"Saving...":"Update Sensor"}
            </button>
            <button type="button" onClick={()=>navigate("/equipment")} className="bg-gray-300 px-6 py-3 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
