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

import BrowseSensors from "./pages/BrowseSensors";
import SensorDetails from "./pages/SensorDetails";
import EditSensor from "./pages/EditSensor";

import Marketplace from "./pages/Marketplace";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";

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

// NEW Sensor Catalog Admin Pages
import AdminSensors from "./components/admin/AdminSensors";
import AddSensor from "./components/admin/AddSensor";
import EditSensorCatalog from "./components/admin/EditSensor";
import InstallSensor from "./pages/InstallSensor";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =======================
            Public Routes
        ======================== */}

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* =======================
            Dashboard
        ======================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Farm Routes
        ======================== */}

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

        {/* =======================
            Equipment Routes
        ======================== */}

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
  path="/install-sensor/:id"
  element={
    <ProtectedRoute>
      <InstallSensor />
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

        {/* =======================
            Sensor Routes
        ======================== */}

        <Route
          path="/sensors"
          element={
            <ProtectedRoute>
              <BrowseSensors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sensor/:id"
          element={
            <ProtectedRoute>
              <SensorDetails />
            </ProtectedRoute>
          }
        />

        {/* Installed Sensor */}
        <Route
          path="/edit-sensor/:id"
          element={
            <ProtectedRoute>
              <EditSensor />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Marketplace
        ======================== */}

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
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
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

        {/* =======================
            Alerts
        ======================== */}

        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Recommendation
        ======================== */}

        <Route
          path="/recommendation/:id"
          element={
            <ProtectedRoute>
              <Recommendation />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Profile
        ======================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Admin Routes
        ======================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* Product Management */}

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-product"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit-product/:id"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <EditProduct />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* =======================
            Sensor Catalog Admin
        ======================== */}

        <Route
          path="/admin/sensors"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminSensors />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-sensor"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AddSensor />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit-sensor/:id"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <EditSensorCatalog />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* Orders */}

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* Users */}

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;