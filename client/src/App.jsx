import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import Farms from "./pages/Farms";
import AddFarm from "./pages/AddFarm";
import EditFarm from "./pages/EditFarm";

import Equipment from "./pages/Equipment";
import AddEquipment from "./pages/AddEquipment";
import EditEquipment from "./pages/EditEquipment";

import Marketplace from "./pages/Marketplace";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

import Alerts from "./pages/Alerts";
import Recommendation from "./pages/Recommendation";
import Profile from "./pages/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==========================
            Public Routes
        ========================== */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ==========================
            User Dashboard
        ========================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ==========================
            Farm Routes
        ========================== */}

        <Route
          path="/farms"
          element={
            <ProtectedRoute>
              <Farms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-farm"
          element={
            <ProtectedRoute>
              <AddFarm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-farm/:id"
          element={
            <ProtectedRoute>
              <EditFarm />
            </ProtectedRoute>
          }
        />

        {/* ==========================
            Equipment Routes
        ========================== */}

        <Route
          path="/equipment"
          element={
            <ProtectedRoute>
              <Equipment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-equipment"
          element={
            <ProtectedRoute>
              <AddEquipment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-equipment/:id"
          element={
            <ProtectedRoute>
              <EditEquipment />
            </ProtectedRoute>
          }
        />

        {/* ==========================
            Marketplace
        ========================== */}

        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* ==========================
            Alerts
        ========================== */}

        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />

        {/* ==========================
            Recommendation
        ========================== */}

        <Route
          path="/recommendation/:id"
          element={
            <ProtectedRoute>
              <Recommendation />
            </ProtectedRoute>
          }
        />

        {/* ==========================
            Profile
        ========================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ==========================
            Admin Panel
        ========================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-product"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit-product/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;