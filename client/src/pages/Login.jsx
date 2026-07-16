import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Satellite, Radio } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
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
      `}</style>

      {/* Left Section */}
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
          Precision Farming
          <br />
          Starts Here
        </h2>

        <p className="relative mt-6 text-lg text-[#B7C7BE] leading-8 max-w-md">
          Monitor farms, check weather, receive irrigation
          recommendations and manage everything from one
          live control console.
        </p>

        <div className="relative mt-10 inline-flex items-center gap-2 hud-mono text-xs text-[#6BFFB8]">
          <Radio size={13} className="hud-blink" />
          SYSTEM ACTIVE &middot; ALL ZONES REPORTING
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex justify-center items-center p-10 hud-grid-bg">

        <div
          className="w-full max-w-md rounded-3xl p-10"
          style={{
            background: "rgba(12,23,19,0.85)",
            border: "1px solid #1C2B24",
            backdropFilter: "blur(6px)",
            boxShadow: "0 20px 60px -20px rgba(0,0,0,0.6)",
          }}
        >

          <h2 className="hud-display text-3xl font-semibold text-center text-[#EAF5EE]">
            Welcome Back
          </h2>

          <p className="text-center text-[#6E877B] mt-3 mb-8 hud-mono text-sm">
            LOGIN TO CONTINUE
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

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
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-3.5 text-[#6E877B] hover:text-[#6BFFB8] transition"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            {/* Login Button */}

            <button
              type="submit"
              className="w-full bg-[#6BFFB8]/15 hover:bg-[#6BFFB8]/25 text-[#6BFFB8] ring-1 ring-[#6BFFB8]/40 py-3 rounded-xl text-lg font-semibold hud-display transition duration-300"
              style={{ textShadow: "0 0 12px rgba(107,255,184,0.35)" }}
            >
              Login
            </button>

          </form>

          <p className="text-center mt-8 text-[#6E877B] text-sm">

            Don't have an account?

            <Link
              to="/register"
              className="text-[#6BFFB8] font-semibold ml-2 hover:underline"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;