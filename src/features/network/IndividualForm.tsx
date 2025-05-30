import React, { useState } from 'react';

interface IndividualFormProps {
  onSave: (person: { name: string; email?: string; phone?: string; notes?: string }) => void;
  onCancel: () => void;
  initial?: { name: string; email?: string; phone?: string; notes?: string };
}

export default function IndividualForm({ onSave, onCancel, initial }: IndividualFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [notes, setNotes] = useState(initial?.notes || '');

  return (
    <form
      className="bg-blue-950 text-blue-100 rounded-xl shadow-2xl border border-blue-500/20 p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
      onSubmit={e => {
        e.preventDefault();
        onSave({ name, email, phone, notes });
      }}
    >
      <h3 className="text-lg font-semibold mb-4">{initial ? 'Edit Individual' : 'Add Individual'}</h3>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">Name</label>
        <input className="input input-bordered w-full text-black" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">Email</label>
        <input className="input input-bordered w-full text-black" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">Phone</label>
        <input className="input input-bordered w-full text-black" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1 text-black">Notes</label>
        <textarea className="textarea textarea-bordered w-full text-black" value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}
