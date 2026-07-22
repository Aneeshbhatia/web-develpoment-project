import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="bg-[#080C0A] text-white min-h-screen">

      {/* Fixed Navbar */}
      <Navbar />

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-72 pt-16">
        <div
          className="h-[calc(100vh-64px)] overflow-y-auto p-8"
          style={{ backgroundColor: "#080C0A" }}
        >
          {children}
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;