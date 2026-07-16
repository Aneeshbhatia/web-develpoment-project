import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getProfile,
  updateProfile,
} from "../services/profileService";

import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Camera,
  Tractor,
  ShoppingCart,
  Bell,
  Wrench,
  Sprout,
  ShoppingBag,
  CloudSun,
  KeyRound,
  UserCog,
  Trash2,
  Save,
  X,
} from "lucide-react";

const HudStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .hud-root{
      font-family:'Inter',sans-serif;
    }

    .hud-display{
      font-family:'Space Grotesk',sans-serif;
    }

    .hud-mono{
      font-family:'JetBrains Mono',monospace;
      letter-spacing:.02em;
    }

    .hud-panel{
      background:rgba(12,23,19,.75);
      border:1px solid #1C2B24;
      backdrop-filter:blur(8px);
    }

    .hud-panel:hover{
      border-color:rgba(107,255,184,.35);
      box-shadow:0 0 0 1px rgba(107,255,184,.08),
      0 15px 40px rgba(0,0,0,.45);
    }

    .hud-input{
      background:#081510;
      border:1px solid #1C2B24;
      color:#EAF5EE;
    }

    .hud-input:focus{
      outline:none;
      border-color:#6BFFB8;
      box-shadow:0 0 0 3px rgba(107,255,184,.15);
    }
  `}</style>
);

const STATS = [
  {
    key: "farms",
    label: "Farms",
    icon: Tractor,
    color: "#6BFFB8",
    value: 2,
  },
  {
    key: "equipment",
    label: "Equipment",
    icon: Wrench,
    color: "#4FD1FF",
    value: 5,
  },
  {
    key: "orders",
    label: "Orders",
    icon: ShoppingCart,
    color: "#FFC163",
    value: 8,
  },
  {
    key: "alerts",
    label: "Alerts",
    icon: Bell,
    color: "#FF6B6B",
    value: 3,
  },
];

const ACTIVITY = [
  {
    icon: Sprout,
    label: "Farm Added",
    time: "Today",
  },
  {
    icon: ShoppingBag,
    label: "Product Added To Cart",
    time: "Yesterday",
  },
  {
    icon: Tractor,
    label: "Equipment Updated",
    time: "2 Days Ago",
  },
  {
    icon: CloudSun,
    label: "Weather Checked",
    time: "3 Days Ago",
  },
];

const Profile = () => {

  const [loading,setLoading]=useState(true);

  const [editMode,setEditMode]=useState(false);

  const [profile,setProfile]=useState({
    name:"",
    email:"",
    phone:"",
    address:"",
    role:"",
    profileImage:"",
    createdAt:"",
  });

  const [formData,setFormData]=useState({
    name:"",
    phone:"",
    address:"",
  });

  // ===========================
  // Load Profile
  // ===========================

  const loadProfile=async()=>{

    try{

      const response=await getProfile();

      if(response.success){

        setProfile(response.user);

        setFormData({
          name:response.user.name||"",
          phone:response.user.phone||"",
          address:response.user.address||"",
        });

      }

    }catch(error){

      console.log(error);

    }finally{

      setLoading(false);

    }

  };

  useEffect(()=>{

    loadProfile();

  },[]);

  // ===========================
  // Handle Input
  // ===========================

  const handleChange=(e)=>{

    setFormData({
      ...formData,
      [e.target.name]:e.target.value,
    });

  };

  // ===========================
  // Update Profile
  // ===========================

  const handleUpdateProfile=async()=>{

    try{

      const response=await updateProfile(formData);

      if(response.success){

        alert("Profile Updated Successfully");

        setProfile(response.user);

        setEditMode(false);

      }

    }catch(error){

      console.log(error);

      alert("Update Failed");

    }

  };

  if(loading){

    return(

      <DashboardLayout>

        <div className="flex justify-center items-center h-[80vh]">

          <h2 className="text-3xl font-bold text-green-700">

            Loading Profile...

          </h2>

        </div>

      </DashboardLayout>

    );

  }
    return (

    <DashboardLayout>

      <div
        className="hud-root -m-8 p-8 min-h-screen"
        style={{ backgroundColor: "#05100C" }}
      >

        <HudStyles />

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="hud-display text-4xl font-semibold text-[#EAF5EE]">

              👤 My Profile

            </h1>

            <p className="text-[#6E877B] mt-2 hud-mono text-sm">

              Manage your personal information and account.

            </p>

          </div>

          <button
            onClick={() => setEditMode(true)}
            className="bg-[#6BFFB8]/15 hover:bg-[#6BFFB8]/25 text-[#6BFFB8] ring-1 ring-[#6BFFB8]/40 px-6 py-3 rounded-xl flex items-center gap-2 transition"
          >

            <Edit size={18} />

            Edit Profile

          </button>

        </div>

        {/* Profile Card */}

        <div className="hud-panel rounded-3xl p-8">

          <div className="flex flex-col lg:flex-row gap-10 items-center">

            {/* Avatar */}

            <div className="relative">

              <img
                src={
                  profile.profileImage
                    ? profile.profileImage
                    : `https://ui-avatars.com/api/?background=16a34a&color=ffffff&name=${encodeURIComponent(profile.name)}`
                }
                alt={profile.name}
                className="w-44 h-44 rounded-full object-cover border-4 border-[#6BFFB8]"
              />

              <button
                className="absolute bottom-2 right-2 bg-[#6BFFB8] text-black p-3 rounded-full"
              >

                <Camera size={18} />

              </button>

            </div>

            {/* Information */}

            <div className="flex-1">

              <h2 className="hud-display text-3xl text-[#EAF5EE]">

                {profile.name}

              </h2>

              <p className="text-[#6BFFB8] mt-2 uppercase hud-mono">

                {profile.role}

              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-8">

                <div className="flex gap-3 items-center text-[#B7C7BE]">

                  <Mail
                    className="text-[#6BFFB8]"
                    size={18}
                  />

                  {profile.email}

                </div>

                <div className="flex gap-3 items-center text-[#B7C7BE]">

                  <Phone
                    className="text-[#6BFFB8]"
                    size={18}
                  />

                  {profile.phone || "Not Added"}

                </div>

                <div className="flex gap-3 items-center text-[#B7C7BE]">

                  <MapPin
                    className="text-[#6BFFB8]"
                    size={18}
                  />

                  {profile.address || "Not Added"}

                </div>

                <div className="flex gap-3 items-center text-[#B7C7BE]">

                  <Calendar
                    className="text-[#6BFFB8]"
                    size={18}
                  />

                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "--"}

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Statistics */}

        <div className="grid md:grid-cols-4 gap-6 mt-8">

          {STATS.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.key}
                className="hud-panel rounded-2xl p-6 text-center"
              >

                <Icon
                  size={38}
                  className="mx-auto"
                  style={{
                    color: item.color,
                  }}
                />

                <h2
                  className="text-3xl font-bold mt-4 hud-display"
                  style={{
                    color: item.color,
                  }}
                >

                  {item.value}

                </h2>

                <p
                  className="mt-2 text-xs uppercase tracking-[0.2em]"
                  style={{
                    color: "#7C9188",
                  }}
                >

                  {item.label}

                </p>

              </div>

            );

          })}

        </div>

        {/* Recent Activity */}

        <div className="hud-panel rounded-3xl p-8 mt-8">

          <h2 className="hud-display text-2xl text-[#EAF5EE] mb-6">

            Recent Activity

          </h2>

          <div className="space-y-4">

            {ACTIVITY.map((item, index) => {

              const Icon = item.icon;

              return (

                <div
                  key={index}
                  className="flex justify-between items-center border-b border-[#1C2B24] pb-4"
                >

                  <div className="flex items-center gap-3 text-[#EAF5EE]">

                    <Icon
                      size={18}
                      className="text-[#6BFFB8]"
                    />

                    {item.label}

                  </div>

                  <span className="text-[#6E877B] hud-mono text-sm">

                    {item.time}

                  </span>

                </div>

              );

            })}

          </div>

        </div>
                {/* Account Settings */}

        <div className="hud-panel rounded-3xl p-8 mt-8">

          <h2 className="hud-display text-2xl text-[#EAF5EE] mb-6">

            Account Settings

          </h2>

          <div className="flex flex-wrap gap-4">

            <button
              className="bg-[#4FD1FF]/10 hover:bg-[#4FD1FF]/20 text-[#4FD1FF]
              ring-1 ring-[#4FD1FF]/30 px-6 py-3 rounded-xl flex items-center gap-2 transition"
            >

              <KeyRound size={18} />

              Change Password

            </button>

            <button
              onClick={() => setEditMode(true)}
              className="bg-[#6BFFB8]/10 hover:bg-[#6BFFB8]/20 text-[#6BFFB8]
              ring-1 ring-[#6BFFB8]/30 px-6 py-3 rounded-xl flex items-center gap-2 transition"
            >

              <UserCog size={18} />

              Update Profile

            </button>

            <button
              className="bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-[#FF6B6B]
              ring-1 ring-[#FF6B6B]/30 px-6 py-3 rounded-xl flex items-center gap-2 transition"
            >

              <Trash2 size={18} />

              Delete Account

            </button>

          </div>

        </div>

        {/* Edit Profile Modal */}

        {editMode && (

          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

            <div className="w-full max-w-xl hud-panel rounded-3xl p-8">

              <div className="flex justify-between items-center mb-8">

                <h2 className="hud-display text-3xl text-[#EAF5EE]">

                  Edit Profile

                </h2>

                <button
                  onClick={() => setEditMode(false)}
                  className="text-gray-400 hover:text-white"
                >

                  <X size={26} />

                </button>

              </div>

              <div className="space-y-6">

                <div>

                  <label className="block text-[#7C9188] mb-2">

                    Name

                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="hud-input w-full rounded-xl px-4 py-3"
                  />

                </div>

                <div>

                  <label className="block text-[#7C9188] mb-2">

                    Phone

                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="hud-input w-full rounded-xl px-4 py-3"
                  />

                </div>

                <div>

                  <label className="block text-[#7C9188] mb-2">

                    Address

                  </label>

                  <textarea
                    rows="3"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="hud-input w-full rounded-xl px-4 py-3"
                  />

                </div>

                <div className="flex justify-end gap-4 pt-4">

                  <button
                    onClick={() => setEditMode(false)}
                    className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white flex items-center gap-2"
                  >

                    <X size={18} />

                    Cancel

                  </button>

                  <button
                    onClick={handleUpdateProfile}
                    className="px-6 py-3 rounded-xl bg-[#6BFFB8] hover:bg-[#57f3a8] text-black font-semibold flex items-center gap-2"
                  >

                    <Save size={18} />

                    Save Changes

                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>

  );

};

export default Profile;