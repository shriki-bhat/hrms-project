// frontend/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const api = {
  // Auth
  register: (data) => axios.post(`${API_URL}/auth/register`, data),
  login: (data) => axios.post(`${API_URL}/auth/login`, data),

  // Employees
  getEmployees: () => axios.get(`${API_URL}/employees`, getAuthHeader()),
  createEmployee: (data) => axios.post(`${API_URL}/employees`, data, getAuthHeader()),
  updateEmployee: (id, data) => axios.put(`${API_URL}/employees/${id}`, data, getAuthHeader()),
  deleteEmployee: (id) => axios.delete(`${API_URL}/employees/${id}`, getAuthHeader()),

  // Teams
  getTeams: () => axios.get(`${API_URL}/teams`, getAuthHeader()),
  getTeam: (id) => axios.get(`${API_URL}/teams/${id}`, getAuthHeader()),
  createTeam: (data) => axios.post(`${API_URL}/teams`, data, getAuthHeader()),
  updateTeam: (id, data) => axios.put(`${API_URL}/teams/${id}`, data, getAuthHeader()),
  deleteTeam: (id) => axios.delete(`${API_URL}/teams/${id}`, getAuthHeader()),
  // frontend/src/services/api.js
assignEmployee: (teamId, employeeId) => 
  axios.post(
    `${API_URL}/teams/${teamId}/assign`, 
    { employee_id: employeeId }, 
    getAuthHeader()
  ),

unassignEmployee: (teamId, employeeId) => 
  axios.post(
    `${API_URL}/teams/${teamId}/unassign`, 
    { employee_id: employeeId }, 
    getAuthHeader()
  ),


  // Analytics (NEW)
  getAnalytics: () => axios.get(`${API_URL}/analytics`, getAuthHeader()),

};

export default api;
