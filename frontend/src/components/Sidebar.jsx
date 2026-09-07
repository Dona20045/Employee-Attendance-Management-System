import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();

  const employeeLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊"
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: "🕐"
    },
    {
      name: "Leave",
      path: "/leave",
      icon: "📅"
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "👤"
    }
  ];

  const hrLinks = [
    {
      name: "Dashboard",
      path: "/hr/dashboard",
      icon: "📊"
    },
    {
      name: "Employees",
      path: "/hr/employees",
      icon: "👥"
    },
    {
      name: "Attendance",
      path: "/hr/attendance",
      icon: "🕐"
    },
    {
      name: "Leave Management",
      path: "/hr/leaves",
      icon: "📅"
    }
  ];

  const links = user?.role === "hr" ? hrLinks : employeeLinks;

  return (
    <>
      {open && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">EA</div>
          <div>
            <h3>Employee</h3>
            <span>Attendance</span>
          </div>
        </div>

        <nav>
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span>{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;