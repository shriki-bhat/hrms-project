import React, { useState } from "react";

const TeamForm = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState(
    initial || { name: "", description: "" }
  );

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Team Name" value={form.name} onChange={handleChange} required /><br/>
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} /><br/>
      <button type="submit">Save</button>
      {onCancel && <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>Cancel</button>}
    </form>
  );
};

export default TeamForm;
