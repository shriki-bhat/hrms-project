import React, { useState } from "react";

const EmployeeForm = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState(
    initial || { first_name: "", last_name: "", email: "", phone: "", position: "" }
  );

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required /><br/>
      <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required /><br/>
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} /><br/>
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} /><br/>
      <input name="position" placeholder="Position" value={form.position} onChange={handleChange} /><br/>
      <button type="submit">Save</button>
      {onCancel && <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>Cancel</button>}
    </form>
  );
};

export default EmployeeForm;
