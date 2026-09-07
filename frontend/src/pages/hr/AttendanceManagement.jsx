import { useEffect, useState } from "react";
import api from "../../services/api";

const AttendanceManagement = () => {
  const [records, setRecords] = useState([]);

  const loadAttendance = async () => {
    try {
      const response = await api.get("/attendance/all");
      setRecords(response.data.records);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Attendance Management</h1>
          <p>View employee attendance records.</p>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-cell">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record._id}>
                    <td>{record.date}</td>

                    <td>
                      {record.employee?.employeeId}
                    </td>

                    <td>
                      {record.employee?.name}
                    </td>

                    <td>
                      {record.employee?.department}
                    </td>

                    <td>
                      {record.checkIn
                        ? new Date(
                            record.checkIn
                          ).toLocaleTimeString()
                        : "-"}
                    </td>

                    <td>
                      {record.checkOut
                        ? new Date(
                            record.checkOut
                          ).toLocaleTimeString()
                        : "-"}
                    </td>

                    <td>
                      {record.workingHours || 0}
                    </td>

                    <td>
                      <span className="status-badge">
                        {record.status}
                      </span>
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

export default AttendanceManagement;