import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Leave = () => {
  const { user, getCurrentUser } = useAuth();

  const [leaves, setLeaves] = useState([]);

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    type: "Casual"
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadLeaves = async () => {
    try {
      const response = await api.get("/leaves/my");
      setLeaves(response.data.leaves);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submitLeave = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await api.post("/leaves", form);

      setMessage("Leave application submitted.");

      setForm({
        startDate: "",
        endDate: "",
        reason: "",
        type: "Casual"
      });

      loadLeaves();
      getCurrentUser();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to submit leave"
      );
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Leave Management</h1>
          <p>Apply for leave and track your requests.</p>
        </div>

        <div className="balance-card">
          Leave Balance: <strong>{user?.leaveBalance}</strong>
        </div>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="dashboard-grid">
        <div className="card">
          <h2>Apply for Leave</h2>

          <form onSubmit={submitLeave}>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>

                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date</label>

                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Leave Type</label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="Casual">Casual</option>
                <option value="Sick">Sick</option>
                <option value="Earned">Earned</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>

            <div className="form-group">
              <label>Reason</label>

              <textarea
                name="reason"
                placeholder="Enter reason for leave"
                value={form.reason}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <button className="primary-button">
              Submit Application
            </button>
          </form>
        </div>

        <div className="card">
          <h2>My Leave Requests</h2>

          <div className="leave-list">
            {leaves.length === 0 ? (
              <p className="empty-text">
                No leave requests found.
              </p>
            ) : (
              leaves.map((leave) => (
                <div
                  className="leave-item"
                  key={leave._id}
                >
                  <div>
                    <strong>{leave.type} Leave</strong>

                    <p>
                      {leave.startDate} → {leave.endDate}
                    </p>

                    <small>{leave.reason}</small>
                  </div>

                  <div>
                    <span className="status-badge">
                      {leave.status}
                    </span>

                    <p>
                      {leave.days} day
                      {leave.days > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leave;