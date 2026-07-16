import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import * as marketplaceService from "../../services/marketplaceService";
import { Trash2 } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await marketplaceService.getUsers();

      if (response.success) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const response = await marketplaceService.deleteUser(id);

      if (response.success) {
        setUsers(users.filter((user) => user._id !== id));
        alert("User deleted successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to delete user");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      const response = await marketplaceService.updateUserRole(id, role);

      if (response.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, role } : user
          )
        );

        alert("Role updated successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to update role");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <h2 className="text-2xl font-semibold">
            Loading Users...
          </h2>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow-lg p-6">

        <div className="flex justify-between items-center mb-6">

          <div>
            <h1 className="text-3xl font-bold">
              User Management
            </h1>

            <p className="text-gray-500">
              Manage all registered users
            </p>
          </div>

        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
        />

        <div className="overflow-x-auto">

          <table className="min-w-full border">

            <thead className="bg-green-600 text-white">

              <tr>

                <th className="px-4 py-3">Name</th>

                <th className="px-4 py-3">Email</th>

                <th className="px-4 py-3">Phone</th>

                <th className="px-4 py-3">Role</th>

                <th className="px-4 py-3">Joined</th>

                <th className="px-4 py-3">Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredUsers.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-8"
                  >
                    No Users Found
                  </td>

                </tr>

              ) : (

                filteredUsers.map((user) => (

                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="px-4 py-4 font-semibold">
                      {user.name}
                    </td>

                    <td className="px-4 py-4">
                      {user.email}
                    </td>

                    <td className="px-4 py-4">
                      {user.phone || "-"}
                    </td>

                    <td className="px-4 py-4">

                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user._id,
                            e.target.value
                          )
                        }
                        className="border rounded-lg p-2"
                      >
                        <option value="farmer">
                          Farmer
                        </option>

                        <option value="advisor">
                          Advisor
                        </option>

                        <option value="admin">
                          Admin
                        </option>

                      </select>

                    </td>

                    <td className="px-4 py-4">
                      {new Date(
                        user.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4">

                      <button
                        onClick={() =>
                          handleDelete(user._id)
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminUsers;