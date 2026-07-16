import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Sidebar */}

      <AdminSidebar />

      {/* Main */}

      <div className="flex-1 flex flex-col">

        <AdminNavbar />

        <main className="p-6 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;