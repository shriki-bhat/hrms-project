import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);


const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getAnalytics().then(res => setData(res.data));
  }, []);

  if (!data) return <div>Loading dashboard...</div>;

  const barData = {
    labels: data.employeesPerTeam.map(t => t.team_name),
    datasets: [
      {
        label: 'Employees per Team',
        data: data.employeesPerTeam.map(t => t.employee_count),
        backgroundColor: "rgba(54, 162, 235, 0.7)"
      }
    ]
  };

  const doughnutData = {
    labels: data.teamDistribution.map(d => d.size),
    datasets: [
      {
        data: data.teamDistribution.map(d => d.team_count),
        backgroundColor: [
          '#FFD700', '#B8860B', '#DAA520', '#EEE8AA'
        ],
      }
    ]
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Analytics Dashboard</h1>
      <div>
        <strong>Total Employees:</strong> {data.totalEmployees}
        &nbsp; | &nbsp;
        <strong>Total Teams:</strong> {data.totalTeams}
        &nbsp; | &nbsp;
        <strong>Unassigned Employees:</strong> {data.unassignedEmployees}
      </div>
      <div style={{ display: 'flex', gap: 20, marginTop: 48 }}>
        <div style={{ flex: 1 }}>
          <Bar data={barData} />
        </div>
        <div style={{ flex: 1 }}>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
