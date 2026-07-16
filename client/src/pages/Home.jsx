import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          <h1 className="text-3xl font-bold">🌱 Smart Irrigation</h1>

          <div className="space-x-4">
            <Link
              to="/login"
              className="hover:text-green-200 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-white text-green-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 py-20 flex flex-col lg:flex-row items-center justify-between">

        <div className="lg:w-1/2">
          <h1 className="text-6xl font-extrabold text-gray-800 leading-tight">
            Smart Irrigation
            <span className="text-green-600"> & Farm</span>
            <br />
            Management System
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Monitor farms, manage irrigation, view weather forecasts,
            receive smart alerts, rent farming equipment and sell
            agricultural products through one intelligent platform.
          </p>

          <div className="mt-8 flex gap-5">
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg"
            >
              Get Started
            </Link>

            <Link
              to="/register"
              className="border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg text-lg"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="lg:w-1/2 flex justify-center mt-12 lg:mt-0">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800"
            alt="Farm"
            className="rounded-2xl shadow-2xl"
          />
        </div>

      </section>

      {/* Features */}
      <section className="bg-white py-20">

        <h2 className="text-4xl font-bold text-center mb-14">
          Our Features
        </h2>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-8">

          <div className="bg-green-50 rounded-xl p-8 shadow hover:shadow-xl transition">
            <div className="text-5xl">🌦</div>

            <h3 className="text-2xl font-bold mt-5">
              Weather Forecast
            </h3>

            <p className="mt-4 text-gray-600">
              Live weather information with rainfall prediction.
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-8 shadow hover:shadow-xl transition">
            <div className="text-5xl">💧</div>

            <h3 className="text-2xl font-bold mt-5">
              Smart Irrigation
            </h3>

            <p className="mt-4 text-gray-600">
              Intelligent irrigation recommendations using sensor data.
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-8 shadow hover:shadow-xl transition">
            <div className="text-5xl">🚜</div>

            <h3 className="text-2xl font-bold mt-5">
              Equipment Rental
            </h3>

            <p className="mt-4 text-gray-600">
              Rent farming tools and machinery online.
            </p>
          </div>

        </div>

      </section>

      {/* Footer */}

      <footer className="bg-green-700 text-white py-6 text-center">
        © 2026 Smart Irrigation System | MERN Project
      </footer>

    </div>
  );
};

export default Home;