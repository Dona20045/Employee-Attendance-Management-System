import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Register from "./pages/Register";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import Attendance from "./pages/employee/Attendance";
import Leave from "./pages/employee/Leave";
import Profile from "./pages/employee/Profile";

import HRDashboard from "./pages/hr/HRDashboard";
import Employees from "./pages/hr/Employees";
import AttendanceManagement from "./pages/hr/AttendanceManagement";
import LeaveManagement from "./pages/hr/LeaveManagement";

import { useState } from "react";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-section">
        <Navbar
          onMenuClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
        />

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

const HomeRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={
        user.role === "hr"
          ? "/hr/dashboard"
          : "/dashboard"
      }
      replace
    />
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* Employee Routes */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="employee">
            <Layout>
              <EmployeeDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute role="employee">
            <Layout>
              <Attendance />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leave"
        element={
          <ProtectedRoute role="employee">
            <Layout>
              <Leave />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute role="employee">
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* HR Routes */}

      <Route
        path="/hr/dashboard"
        element={
          <ProtectedRoute role="hr">
            <Layout>
              <HRDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/employees"
        element={
          <ProtectedRoute role="hr">
            <Layout>
              <Employees />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/attendance"
        element={
          <ProtectedRoute role="hr">
            <Layout>
              <AttendanceManagement />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/leaves"
        element={
          <ProtectedRoute role="hr">
            <Layout>
              <LeaveManagement />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;