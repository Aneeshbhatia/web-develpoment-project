import { Bell, Search } from "lucide-react";

const AdminNavbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="bg-white shadow-sm px-8 py-5 flex justify-between items-center">

      <div className="relative">

        <Search
          className="absolute left-3 top-3 text-gray-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 border rounded-lg w-80 outline-none focus:ring-2 focus:ring-green-500"
        />

      </div>

      <div className="flex items-center gap-6">

        <Bell className="text-gray-600 cursor-pointer" />

        <div className="text-right">

          <h2 className="font-semibold">
            {user?.name}
          </h2>

          <p className="text-sm text-gray-500">
            Administrator
          </p>

        </div>

        <img
          src="https://i.pravatar.cc/150"
          alt="Admin"
          className="w-11 h-11 rounded-full"
        />

      </div>

    </header>
  );
};

export default AdminNavbar;