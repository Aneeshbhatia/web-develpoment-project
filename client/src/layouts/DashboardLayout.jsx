import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080C0A" }}>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8" style={{ backgroundColor: "#080C0A" }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;