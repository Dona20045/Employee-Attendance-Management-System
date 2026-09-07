import { useAuth } from "../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="nav-left">
        <button className="menu-button" onClick={onMenuClick}>
          ☰
        </button>

        <h2>Employee Attendance</h2>
      </div>

      <div className="nav-right">
        <div className="user-info">
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{user?.name}</strong>
            <small>{user?.role}</small>
          </div>
        </div>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;