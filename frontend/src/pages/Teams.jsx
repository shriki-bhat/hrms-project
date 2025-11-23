// src/pages/Teams.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [manageTeam, setManageTeam] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await api.getTeams();
      setTeams(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    const res = await api.getEmployees();
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchTeams();
    fetchEmployees();
  }, []);

  const handleAdd = () => {
    setSelected(null);
    setForm({ name: "", description: "" });
    setShowModal(true);
    setManageTeam(null);
  };

  const handleEdit = team => {
    setSelected(team);
    setForm(team);
    setShowModal(true);
    setManageTeam(null);
  };

  const handleDelete = async id => {
    if (window.confirm("Delete this team?")) {
      await api.deleteTeam(id);
      fetchTeams();
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (selected) {
      await api.updateTeam(selected.id, form);
    } else {
      await api.createTeam(form);
    }
    setShowModal(false);
    fetchTeams();
  };

  const handleManage = async teamId => {
    const res = await api.getTeam(teamId);
    setManageTeam(res.data);
    setShowModal(false);
  };

  const handleAssign = async (teamId, empId) => {
    await api.assignEmployee(teamId, empId);
    await handleManage(teamId);
    fetchTeams();
  };

  const handleUnassign = async (teamId, empId) => {
    await api.unassignEmployee(teamId, empId);
    await handleManage(teamId);
    fetchTeams();
  };

  const availableEmployees = manageTeam
    ? employees.filter(e => !manageTeam.employees?.find(te => te.id === e.id))
    : [];

  // Filter teams by search query
  const filteredTeams = teams.filter(team => {
    const teamName = team.name.toLowerCase();
    const description = (team.description || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return teamName.includes(query) || description.includes(query);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Search */}
        <div className="bg-gradient-to-br from-gray-950 to-black rounded-lg shadow-2xl p-8 mb-8 border border-amber-600/10">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 mb-2" style={{fontFamily: 'Playfair Display, serif'}}>
                Team Management
              </h1>
              <p className="text-gray-400 tracking-widest uppercase text-sm">Organize and Manage Your Teams</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search teams..."
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
                Add Team
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-amber-500 mx-auto"></div>
            <p className="mt-6 text-gray-400 tracking-wider uppercase text-sm">Loading teams...</p>
          </div>
        ) : (
          <>
            {searchQuery && (
              <div className="mb-4 text-gray-400 text-sm">
                Found {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map(team => (
                <div key={team.id} className="bg-gradient-to-br from-gray-950 to-black rounded-lg shadow-xl border border-amber-600/10 hover:border-amber-500/20 p-6 transition">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-2" style={{fontFamily: 'Playfair Display, serif'}}>
                      {team.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{team.description || "No description"}</p>
                  </div>
                  
                  <div className="bg-gray-900/30 rounded-lg p-4 mb-4 border border-amber-600/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Team Members</span>
                      <span className="bg-amber-600/20 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
                        {team.employee_count || 0}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs mt-2">{team.employee_names || "No members assigned"}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleEdit(team)}
                      className="bg-gray-800 hover:bg-amber-600 text-white hover:text-black py-2 rounded-lg text-xs font-semibold transition uppercase tracking-wider"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(team.id)}
                      className="bg-red-900/30 hover:bg-red-700 text-red-300 hover:text-white py-2 rounded-lg text-xs font-semibold transition border border-red-800/50 uppercase tracking-wider"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleManage(team.id)}
                      className="bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-black py-2 rounded-lg text-xs font-semibold transition border border-amber-600/30 uppercase tracking-wider"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Team Form Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-950 to-black rounded-lg shadow-2xl p-8 w-full max-w-md border border-amber-600/20">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 mb-6" style={{fontFamily: 'Playfair Display, serif'}}>
                {selected ? "Edit Team" : "Add New Team"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  placeholder="Team Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-white placeholder-gray-600"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none h-24 resize-none text-white placeholder-gray-600"
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

        {/* Manage Team Modal */}
        {manageTeam && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gradient-to-br from-gray-950 to-black rounded-lg shadow-2xl p-8 w-full max-w-2xl my-8 border border-amber-600/20">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 mb-6" style={{fontFamily: 'Playfair Display, serif'}}>
                Manage: {manageTeam.name}
              </h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-amber-400 mb-3 uppercase tracking-widest text-sm">Assign Employee</h3>
                <select
                  onChange={e => e.target.value && handleAssign(manageTeam.id, e.target.value)}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-white"
                >
                  <option value="">Select employee...</option>
                  {availableEmployees.map(emp => (
                    <option key={emp.id} value={emp.id} className="bg-gray-900">
                      {emp.first_name} {emp.last_name} - {emp.position || "No position"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="text-lg font-bold text-amber-400 mb-3 uppercase tracking-widest text-sm">
                  Current Members ({manageTeam.employees?.length || 0})
                </h3>
                {manageTeam.employees?.length === 0 ? (
                  <div className="text-center py-12 bg-gray-900/30 rounded-lg border border-gray-800">
                    <p className="text-gray-500 text-lg">No members in this team</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {manageTeam.employees?.map(emp => (
                      <div key={emp.id} className="flex justify-between items-center bg-gray-900/50 p-4 rounded-lg border border-amber-600/10 hover:border-amber-600/20 transition">
                        <div>
                          <p className="font-bold text-white">{emp.first_name} {emp.last_name}</p>
                          <p className="text-sm text-amber-500">{emp.position || "No position"}</p>
                        </div>
                        <button
                          onClick={() => handleUnassign(manageTeam.id, emp.id)}
                          className="bg-red-900/30 hover:bg-red-700 text-red-300 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition border border-red-800/50 uppercase tracking-wider"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setManageTeam(null)}
                className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition uppercase tracking-widest"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {filteredTeams.length === 0 && !loading && (
          <div className="bg-gradient-to-br from-gray-950 to-black rounded-lg shadow-xl p-16 text-center border border-amber-600/10">
            <h3 className="text-2xl font-bold text-gray-300 mb-2" style={{fontFamily: 'Playfair Display, serif'}}>
              {searchQuery ? "No Teams Found" : "No Teams Yet"}
            </h3>
            <p className="text-gray-500">
              {searchQuery ? `No results for "${searchQuery}"` : "Click 'Add Team' to create your first team"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
