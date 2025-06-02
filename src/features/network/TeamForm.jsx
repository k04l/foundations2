// src/features/network/TeamForm.jsx

import React, { useState } from 'react';

export default function TeamForm({ onSave, onCancel, initial }) {
  const [formData, setFormData] = useState(initial || { name: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-950 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{initial ? 'Edit Team' : 'Add Team'}</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-blue-300">Team Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-blue-300">Team Type</label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}