import { useEffect, useState } from "react";
import api from "../../services/api";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);

  const loadLeaves = async () => {
    try {
      const response = await api.get("/leaves/all");
      setLeaves(response.data.leaves);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/leaves/${id}/status`, {
        status
      });

      loadLeaves();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update leave"
      );
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Leave Management</h1>
          <p>Review and manage employee leave requests.</p>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-cell">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>
                      {leave.employee?.name}
                    </td>

                    <td>
                      {leave.employee?.employeeId}
                    </td>

                    <td>{leave.type}</td>

                    <td>
                      {leave.startDate}
                      <br />
                      →
                      <br />
                      {leave.endDate}
                    </td>

                    <td>{leave.days}</td>

                    <td>{leave.reason}</td>

                    <td>
                      <span className="status-badge">
                        {leave.status}
                      </span>
                    </td>

                    <td>
                      {leave.status === "Pending" && (
                        <div className="action-buttons-small">
                          <button
                            className="approve-button"
                            onClick={() =>
                              updateStatus(
                                leave._id,
                                "Approved"
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="reject-button"
                            onClick={() =>
                              updateStatus(
                                leave._id,
                                "Rejected"
                              )
                            }
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;