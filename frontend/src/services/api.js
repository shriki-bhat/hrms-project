// frontend/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const api = {
    // Auth
    // Auth
register: (data) => axios.post(`${API_URL}/api/auth/register`, data),
login: (data) => axios.post(`${API_URL}/api/auth/login`, data),


    // Employees
    getEmployees: () => axios.get(`${API_URL}/api/employees`, getAuthHeader()),
    createEmployee: (data) => axios.post(`${API_URL}/api/employees`, data, getAuthHeader()),
    updateEmployee: (id, data) => axios.put(`${API_URL}/api/employees/${id}`, data, getAuthHeader()),
    deleteEmployee: (id) => axios.delete(`${API_URL}/api/employees/${id}`, getAuthHeader()),

    // Teams
    getTeams: () => axios.get(`${API_URL}/api/teams`, getAuthHeader()),
    getTeam: (id) => axios.get(`${API_URL}/api/teams/${id}`, getAuthHeader()),
    createTeam: (data) => axios.post(`${API_URL}/api/teams`, data, getAuthHeader()),
    updateTeam: (id, data) => axios.put(`${API_URL}/api/teams/${id}`, data, getAuthHeader()),
    deleteTeam: (id) => axios.delete(`${API_URL}/api/teams/${id}`, getAuthHeader()),

    // Assign employee to team
    assignEmployee: (teamId, employeeId) =>
        axios.post(
            `${API_URL}/api/teams/${teamId}/assign`,
            { employee_id: employeeId },
            getAuthHeader()
        ),

    unassignEmployee: (teamId, employeeId) =>
        axios.post(
            `${API_URL}/api/teams/${teamId}/unassign`,
            { employee_id: employeeId },
            getAuthHeader()
        ),

    // Analytics
    getAnalytics: () => axios.get(`${API_URL}/api/analytics`, getAuthHeader()),
};

export default api;
