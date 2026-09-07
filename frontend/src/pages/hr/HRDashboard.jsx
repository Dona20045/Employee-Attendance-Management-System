import { useEffect, useState } from "react";
import api from "../../services/api";
import StatCard from "../../components/StatCard";

const HRDashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    attendance: 0,
    presentToday: 0,
    pendingLeaves: 0,
    approvedLeaves: 0
  });

  const loadDashboard = async () => {
    try {
      const response = await api.get("/hr/dashboard");
      setStats(response.data.stats);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>HR Dashboard</h1>
          <p>
            Monitor employees, attendance and leave requests.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Active Employees"
          value={stats.employees}
          icon="👥"
        />

        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon="✓"
        />

        <StatCard
          title="Pending Leaves"
          value={stats.pendingLeaves}
          icon="⏳"
        />

        <StatCard
          title="Approved Leaves"
          value={stats.approvedLeaves}
          icon="📅"
        />
      </div>

      <div className="card">
        <h2>Today's Attendance</h2>

        <div className="attendance-summary">
          <div>
            <span>Total Attendance Records</span>
            <strong>{stats.attendance}</strong>
          </div>

          <div>
            <span>Present / Late</span>
            <strong>{stats.presentToday}</strong>
          </div>

          <div>
            <span>Not Marked</span>
            <strong>
              {Math.max(
                stats.employees - stats.presentToday,
                0
              )}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;