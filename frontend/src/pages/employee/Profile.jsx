import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>View your employee information.</p>
        </div>
      </div>

      <div className="profile-card card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{user?.name}</h2>
            <p>{user?.designation}</p>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-field">
            <span>Employee ID</span>
            <strong>{user?.employeeId || "-"}</strong>
          </div>

          <div className="profile-field">
            <span>Email</span>
            <strong>{user?.email}</strong>
          </div>

          <div className="profile-field">
            <span>Department</span>
            <strong>{user?.department}</strong>
          </div>

          <div className="profile-field">
            <span>Designation</span>
            <strong>{user?.designation}</strong>
          </div>

          <div className="profile-field">
            <span>Monthly Salary</span>
            <strong>₹{user?.monthlySalary}</strong>
          </div>

          <div className="profile-field">
            <span>Leave Balance</span>
            <strong>{user?.leaveBalance} days</strong>
          </div>

          <div className="profile-field">
            <span>Joining Date</span>
            <strong>
              {user?.joiningDate
                ? new Date(
                    user.joiningDate
                  ).toLocaleDateString()
                : "-"}
            </strong>
          </div>

          <div className="profile-field">
            <span>Account Status</span>
            <strong>
              {user?.isActive ? "Active" : "Inactive"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;