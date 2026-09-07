import { useEffect, useState } from "react";
import api from "../../services/api";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  const loadEmployees = async () => {
    try {
      const response = await api.get("/hr/employees");
      setEmployees(response.data.employees);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const toggleStatus = async (employee) => {
    try {
      await api.patch(
        `/hr/employees/${employee._id}/status`,
        {
          isActive: !employee.isActive
        }
      );

      loadEmployees();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update employee"
      );
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Employees</h1>
          <p>Manage employee accounts.</p>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>
                    <strong>
                      {employee.employeeId}
                    </strong>
                  </td>

                  <td>{employee.name}</td>

                  <td>{employee.email}</td>

                  <td>{employee.department}</td>

                  <td>{employee.designation}</td>

                  <td>
                    <span className="status-badge">
                      {employee.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <button
                      className={
                        employee.isActive
                          ? "danger-button"
                          : "primary-button small-button"
                      }
                      onClick={() =>
                        toggleStatus(employee)
                      }
                    >
                      {employee.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;