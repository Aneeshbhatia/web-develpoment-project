import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Satellite,
  Radio,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await registerUser(formData);

      alert(data.message);

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex hud-root" style={{ background: "#05100C" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .hud-root { font-family: 'Inter', sans-serif; }
        .hud-display { font-family: 'Space Grotesk', sans-serif; }
        .hud-mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.02em; }

        .hud-grid-bg {
          background-image:
            linear-gradient(rgba(107,255,184,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(107,255,184,0.06) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        @keyframes hud-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
        .hud-blink { animation: hud-blink 1.8s ease-in-out infinite; }

        .hud-input {
          background: #0C1713;
          border: 1px solid #1C2B24;
          color: #EAF5EE;
        }
        .hud-input::placeholder { color: #5B6B63; }
        .hud-input:focus {
          outline: none;
          box-shadow: 0 0 0 1px rgba(107,255,184,0.4);
          border-color: rgba(107,255,184,0.4);
        }

        .hud-select {
          background: #0C1713;
          border: 1px solid #1C2B24;
          color: #EAF5EE;
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236BFFB8' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>");
          background-repeat: no-repeat;
          background-position: right 1rem center;
        }
        .hud-select:focus {
          outline: none;
          box-shadow: 0 0 0 1px rgba(107,255,184,0.4);
          border-color: rgba(107,255,184,0.4);
        }
        .hud-select option {
          background: #0C1713;
          color: #EAF5EE;
        }
      `}</style>

      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden hud-grid-bg text-white flex-col justify-center px-20"
           style={{ background: "linear-gradient(160deg, #071C15 0%, #0C1713 55%, #05100C 100%)" }}>

        <div className="absolute inset-0 border-r border-[#1C2B24] pointer-events-none" />

        <div className="relative flex items-center gap-4 mb-8">
          <div className="bg-[#6BFFB8]/10 p-4 rounded-2xl ring-1 ring-[#6BFFB8]/30">
            <Satellite className="text-[#6BFFB8]" size={36} />
          </div>
          <h1 className="hud-display text-4xl font-semibold tracking-tight">
            Smart Irrigation
          </h1>
        </div>

        <h2 className="relative hud-display text-4xl font-semibold leading-tight text-[#EAF5EE]">
          Join The Future
          <br />
          Of Smart Farming
        </h2>

        <p className="relative mt-6 text-lg text-[#B7C7BE] leading-8 max-w-md">
          Create your account to monitor weather,
          manage farms and receive intelligent irrigation
          recommendations.
        </p>

        <div className="relative mt-10 inline-flex items-center gap-2 hud-mono text-xs text-[#6BFFB8]">
          <Radio size={13} className="hud-blink" />
          NEW OPERATOR REGISTRATION
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex justify-center items-center p-10 hud-grid-bg">

        <div
          className="rounded-3xl p-10 w-full max-w-md"
          style={{
            background: "rgba(12,23,19,0.85)",
            border: "1px solid #1C2B24",
            backdropFilter: "blur(6px)",
            boxShadow: "0 20px 60px -20px rgba(0,0,0,0.6)",
          }}
        >

          <h2 className="hud-display text-3xl font-semibold text-center text-[#EAF5EE]">
            Create Account
          </h2>

          <p className="text-center text-[#6E877B] mt-3 mb-8 hud-mono text-sm">
            START YOUR FARMING JOURNEY
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div className="relative">

              <User
                size={20}
                className="absolute left-4 top-3.5 text-[#5B6B63]"
              />

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="hud-input w-full rounded-xl py-3 pl-12 pr-4 transition"
                required
              />

            </div>

            {/* Email */}
            <div className="relative">

              <Mail
                size={20}
                className="absolute left-4 top-3.5 text-[#5B6B63]"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="hud-input w-full rounded-xl py-3 pl-12 pr-4 transition"
                required
              />

            </div>

            {/* Password */}
            <div className="relative">

              <Lock
                size={20}
                className="absolute left-4 top-3.5 text-[#5B6B63]"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="hud-input w-full rounded-xl py-3 pl-12 pr-12 transition"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-[#6E877B] hover:text-[#6BFFB8] transition"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            {/* Role */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="hud-select w-full rounded-xl py-3 px-4 transition"
            >
              <option value="farmer">Farmer</option>
              <option value="admin">Admin</option>
            </select>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-[#6BFFB8]/15 hover:bg-[#6BFFB8]/25 text-[#6BFFB8] ring-1 ring-[#6BFFB8]/40 py-3 rounded-xl text-lg font-semibold hud-display transition"
              style={{ textShadow: "0 0 12px rgba(107,255,184,0.35)" }}
            >
              Create Account
            </button>

          </form>

          <p className="text-center mt-8 text-[#6E877B] text-sm">
            Already have an account?

            <Link
              to="/login"
              className="ml-2 text-[#6BFFB8] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;