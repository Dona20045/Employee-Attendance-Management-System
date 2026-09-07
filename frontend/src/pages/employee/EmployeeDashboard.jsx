import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import StatCard from "../../components/StatCard";

const EmployeeDashboard = () => {
  const { user } = useAuth();

  const [today, setToday] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [todayRes, leaveRes, attendanceRes] =
        await Promise.all([
          api.get("/attendance/today"),
          api.get("/leaves/my"),
          api.get("/attendance/my")
        ]);

      setToday(todayRes.data.record);
      setLeaves(leaveRes.data.leaves);
      setAttendance(attendanceRes.data.records);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const checkIn = async () => {
    try {
      setLoading(true);
      setMessage("");

      await api.post("/attendance/check-in");

      setMessage("Checked in successfully!");
      loadData();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Check-in failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async () => {
    try {
      setLoading(true);
      setMessage("");

      await api.patch("/attendance/check-out");

      setMessage("Checked out successfully!");
      loadData();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Check-out failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const presentDays = attendance.filter(
    (item) =>
      item.status === "Present" ||
      item.status === "Late"
  ).length;

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "Pending"
  ).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Good day, {user?.name} 👋</h1>
          <p>
            Here's what's happening with your attendance.
          </p>
        </div>
      </div>

      {message && (
        <div className="info-message">
          {message}
        </div>
      )}

      <div className="stats-grid">
        <StatCard
          title="Present Days"
          value={presentDays}
          icon="✓"
        />

        <StatCard
          title="Leave Balance"
          value={user?.leaveBalance ?? 0}
          icon="📅"
        />

        <StatCard
          title="Pending Leaves"
          value={pendingLeaves}
          icon="⏳"
        />

        <StatCard
          title="Department"
          value={user?.department || "General"}
          icon="🏢"
        />
      </div>

      <div className="dashboard-grid">
        <div className="card attendance-action-card">
          <div className="card-header">
            <div>
              <h2>Today's Attendance</h2>
              <p>
                {new Date().toLocaleDateString()}
              </p>
            </div>

            <span
              className={`status-badge ${
                today
                  ? today.status.toLowerCase().replace(" ", "-")
                  : "absent"
              }`}
            >
              {today?.status || "Not Marked"}
            </span>
          </div>

          <div className="attendance-times">
            <div>
              <span>Check In</span>
              <strong>
                {today?.checkIn
                  ? new Date(
                      today.checkIn
                    ).toLocaleTimeString()
                  : "--:--"}
              </strong>
            </div>

            <div>
              <span>Check Out</span>
              <strong>
                {today?.checkOut
                  ? new Date(
                      today.checkOut
                    ).toLocaleTimeString()
                  : "--:--"}
              </strong>
            </div>

            <div>
              <span>Working Hours</span>
              <strong>
                {today?.workingHours || 0} hrs
              </strong>
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="primary-button"
              onClick={checkIn}
              disabled={loading || today?.checkIn}
            >
              Check In
            </button>

            <button
              className="secondary-button"
              onClick={checkOut}
              disabled={
                loading ||
                !today?.checkIn ||
                today?.checkOut
              }
            >
              Check Out
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Recent Attendance</h2>
          </div>

          {attendance.length === 0 ? (
            <p className="empty-text">
              No attendance records yet.
            </p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Hours</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance
                    .slice(0, 5)
                    .map((item) => (
                      <tr key={item._id}>
                        <td>{item.date}</td>

                        <td>
                          <span className="status-badge">
                            {item.status}
                          </span>
                        </td>

                        <td>
                          {item.workingHours || 0}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;