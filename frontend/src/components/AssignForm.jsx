// src/components/AssignForm.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

// Usage: <AssignForm teamId={id} onAssigned={() => ...} />
const AssignForm = ({ teamId, onAssigned }) => {
  const [employees, setEmployees] = useState([]);
  const [teamInfo, setTeamInfo] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all employees and team details
  useEffect(() => {
    const load = async () => {
      const [empRes, teamRes] = await Promise.all([
        api.getEmployees(),
        api.getTeam(teamId),
      ]);
      setEmployees(empRes.data);
      setTeamInfo(teamRes.data);
    };
    load();
  }, [teamId]);

  // Get employees not in this team
  const availableEmployees = employees.filter(
    e => !teamInfo?.employees?.find(te => te.id === e.id)
  );

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    await api.assignEmployee(teamId, selectedEmployee);
    setMessage("Assigned successfully.");
    setSelectedEmployee("");
    if (onAssigned) onAssigned();
  };

  const handleUnassign = async (eid) => {
    await api.unassignEmployee(teamId, eid);
    setMessage("Removed from team.");
    if (onAssigned) onAssigned();
  };

  return (
    <div style={{ margin: "16px 0" }}>
      <h4>Assign Employees</h4>
      <form onSubmit={handleAssign}>
        <select
          value={selectedEmployee}
          onChange={e => setSelectedEmployee(e.target.value)}
        >
          <option value="">Select employee...</option>
          {availableEmployees.map(emp =>
            <option key={emp.id} value={emp.id}>
              {emp.first_name} {emp.last_name}
            </option>
          )}
        </select>
        <button type="submit" disabled={!selectedEmployee}>Assign to Team</button>
      </form>
      <h5>Already on this Team</h5>
      <ul>
        {teamInfo?.employees?.length === 0 && <li>None</li>}
        {teamInfo?.employees?.map(emp =>
          <li key={emp.id}>
            {emp.first_name} {emp.last_name}
            <button style={{ marginLeft: 8 }} onClick={() => handleUnassign(emp.id)}>
              Remove
            </button>
          </li>
        )}
      </ul>
      {message && <div style={{ color: "green", marginTop: 8 }}>{message}</div>}
    </div>
  );
};

export default AssignForm;
