// src/pages/Logs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const LOG_API = "http://localhost:5000/api/logs"; // You need to implement this route in backend!

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(LOG_API, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(data);
      } catch (err) {
        setError("Failed to load logs or endpoint not implemented.");
      }
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <h2>Operation Logs / Audit Trail</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 && (
            <tr><td colSpan={4}>No log entries.</td></tr>
          )}
          {logs.map(log => (
            <tr key={log.id}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.user_name || log.user_id}</td>
              <td>{log.action}</td>
              <td>{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Logs;
