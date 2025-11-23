// src/pages/Employees.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", position: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.getEmployees();
      setEmployees(res.data);
    } catch (err) {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await api.getTeams();
      setTeams(res.data);
    } catch (err) {
      console.error("Failed to load teams");
    }
  };

  useEffect(() => { 
    fetchEmployees(); 
    fetchTeams();
  }, []);

  const handleAdd = () => {
    setSelected(null);
    setForm({ first_name: "", last_name: "", email: "", phone: "", position: "" });
    setShowModal(true);
  };

  const handleEdit = emp => {
    setSelected(emp);
    setForm(emp);
    setShowModal(true);
  };

  const handleDelete = async id => {
    if (window.confirm("Delete this employee?")) {
      await api.deleteEmployee(id);
      fetchEmployees();
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (selected) {
      await api.updateEmployee(selected.id, form);
    } else {
      await api.createEmployee(form);
    }
    setShowModal(false);
    fetchEmployees();
  };

  const handleTeamAssignment = async (empId, teamId, currentTeamIds, empName) => {
  const teamIdArray = currentTeamIds ? currentTeamIds.split(',') : [];
  const team = teams.find(t => t.id === parseInt(teamId));
  
  console.log('=== FRONTEND ASSIGNMENT ===');
  console.log('Employee ID:', empId);
  console.log('Team ID:', teamId);
  console.log('Team Name:', team?.name);
  
  try {
    if (teamIdArray.includes(teamId.toString())) {
      // Unassign
      await api.unassignEmployee(teamId, empId);
      setSuccessMessage(`${empName} has been removed from ${team.name} Team`);
    } else {
      // Assign
      await api.assignEmployee(teamId, empId);
      setSuccessMessage(`${empName} has been assigned to ${team.name} Team`);
    }
    
    // Show popup
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
    
    fetchEmployees();
  } catch (error) {
    console.error('Assignment error:', error);
    console.error('Error response:', error.response?.data);
    alert(`Failed to assign employee: ${error.response?.data?.error || error.message}`);
  }
};


  // Filter employees by search query
  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
    const position = (emp.position || "").toLowerCase();
    const email = (emp.email || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || position.includes(query) || email.includes(query);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className="bg-gradient-to-r from-green-900 to-green-800 border border-green-500/50 text-white px-6 py-4 rounded-lg shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header with Search */}
        <div className="bg-gradient-to-br from-gray-950 to-black rounded-lg shadow-2xl p-8 mb-8 border border-amber-600/10">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 mb-2" style={{fontFamily: 'Playfair Display, serif'}}>
                Employee Management
              </h1>
              <p className="text-gray-400 tracking-widest uppercase text-sm">Manage Your Organisation's Workforce</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 px-4 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-white placeholder-gray-500 text-sm"
                />
                <svg 
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <button
                onClick={handleAdd}
                className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-sm transition whitespace-nowrap"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-amber-500 mx-auto"></div>
            <p className="mt-6 text-gray-400 tracking-wider uppercase text-sm">Loading employees...</p>
          </div>
        ) : (
          <>
            {searchQuery && (
              <div className="mb-4 text-gray-400 text-sm">
                Found {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map(emp => (
                <div key={emp.id} className="bg-gradient-to-br from-gray-950 to-black rounded-lg shadow-xl border border-amber-600/10 hover:border-amber-500/20 p-6 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white" style={{fontFamily: 'Playfair Display, serif'}}>
                        {emp.first_name} {emp.last_name}
                      </h3>
                      <p className="text-amber-500 font-semibold text-sm">{emp.position || "N/A"}</p>
                    </div>
                    <span className="bg-amber-600/20 text-amber-400 px-3 py-1 rounded-full text-xs font-bold border border-amber-600/30">
                      #{emp.id}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-400 mb-4 border-t border-gray-800 pt-4">
                    <p><span className="text-gray-500">Email:</span> {emp.email || "No email"}</p>
                    <p><span className="text-gray-500">Phone:</span> {emp.phone || "No phone"}</p>
                    <p><span className="text-gray-500">Teams:</span> {emp.team_names ? emp.team_names : "NONE"}
</p>
                  </div>

                  {/* Team Assignment Dropdown */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 mb-2 tracking-widest uppercase">
                      Assign to Team
                    </label>
                    <select
                      onChange={(e) => handleTeamAssignment(
                        emp.id, 
                        e.target.value, 
                        emp.team_ids,
                        `${emp.first_name} ${emp.last_name}`
                      )}
                      className="w-full p-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-white text-sm"
                      value=""
                    >
                      <option value="">Select team...</option>
                      {teams.map(team => {
                        const isAssigned = emp.team_ids?.split(',').includes(team.id.toString());
                        return (
                          <option key={team.id} value={team.id} className="bg-gray-900">
                            {isAssigned ? `✓ ${team.name} (Assigned)` : team.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="flex-1 bg-gray-800 hover:bg-amber-600 text-white hover:text-black py-2 rounded-lg font-semibold transition text-sm uppercase tracking-wider"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="flex-1 bg-red-900/30 hover:bg-red-700 text-red-300 hover:text-white py-2 rounded-lg font-semibold transition border border-red-800/50 text-sm uppercase tracking-wider"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {filteredEmployees.length === 0 && !loading && (
          <div className="bg-gradient-to-br from-gray-950 to-black rounded-lg shadow-xl p-16 text-center border border-amber-600/10">
            <h3 className="text-2xl font-bold text-gray-300 mb-2" style={{fontFamily: 'Playfair Display, serif'}}>
              {searchQuery ? "No Employees Found" : "No Employees Yet"}
            </h3>
            <p className="text-gray-500">
              {searchQuery ? `No results for "${searchQuery}"` : "Click 'Add Employee' to get started"}
            </p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-950 to-black rounded-lg shadow-2xl p-8 w-full max-w-md border border-amber-600/20">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 mb-6" style={{fontFamily: 'Playfair Display, serif'}}>
                {selected ? "Edit Employee" : "Add New Employee"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  placeholder="First Name"
                  value={form.first_name}
                  onChange={e => setForm({ ...form, first_name: e.target.value })}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-white placeholder-gray-600"
                  required
                />
                <input
                  placeholder="Last Name"
                  value={form.last_name}
                  onChange={e => setForm({ ...form, last_name: e.target.value })}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-white placeholder-gray-600"
                  required
                />
                <input
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-white placeholder-gray-600"
                />
                <input
                  placeholder="Phone"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-white placeholder-gray-600"
                />
                <input
                  placeholder="Position"
                  value={form.position}
                  onChange={e => setForm({ ...form, position: e.target.value })}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-white placeholder-gray-600"
                />
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black py-3 rounded-lg font-bold transition uppercase tracking-wider"
                  >
                    {selected ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Employees;
