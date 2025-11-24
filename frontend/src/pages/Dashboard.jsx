import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Bar, Doughnut } from "react-chartjs-2";
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

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, Title);


const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getAnalytics().then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return <div>Loading dashboard...</div>;

  const barData = {
    labels: data.employeesPerTeam.map((t) => t.teamName),
    datasets: [
      {
        label: "Employees per Team",
        data: data.employeesPerTeam.map((t) => t.employeeCount),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };

  const doughnutData = {
    labels: data.teamDistribution.map((d) => d.size),
    datasets: [
      {
        data: data.teamDistribution.map((d) => d.teamCount),
        backgroundColor: ["#FFD700", "#B8860B", "#DAA520", "#EEE8AA"],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1>Analytics Dashboard</h1>
      <div className="dashboard-summary">
        <strong>Total Employees:</strong> {data.totalEmployees}&nbsp;&nbsp;
        <strong>Total Teams:</strong> {data.totalTeams}&nbsp;&nbsp;
        <strong>Unassigned Employees:</strong> {data.unassignedEmployees}
      </div>
      <div className="dashboard-charts">
        <div className="dashboard-chart">
          <Bar data={barData} />
        </div>
        <div className="dashboard-chart">
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
