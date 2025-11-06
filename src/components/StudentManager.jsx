import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function StudentManager({ students, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState({ name: '', className: '' });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      onUpdate(editingId, form);
      setEditingId(null);
    } else {
      onAdd(form);
    }
    setForm({ name: '', className: '' });
  };

  const startEdit = (student) => {
    setEditingId(student.id);
    setForm({ name: student.name, className: student.className || '' });
  };

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Kelola Siswa/Siswi</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <input
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nama Lengkap"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Kelas (mis. 5A)"
          value={form.className}
          onChange={(e) => setForm({ ...form, className: e.target.value })}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition"
        >
          {editingId ? <><Pencil size={16}/> Simpan</> : <><Plus size={16}/> Tambah</>}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2 pr-4">Nama</th>
              <th className="py-2 pr-4">Kelas</th>
              <th className="py-2 pr-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="py-2 pr-4">{s.name}</td>
                <td className="py-2 pr-4">{s.className}</td>
                <td className="py-2 pr-4">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(s)} className="px-3 py-1 rounded bg-amber-500 text-white hover:bg-amber-600 inline-flex items-center gap-1"><Pencil size={14}/> Edit</button>
                    <button onClick={() => onDelete(s.id)} className="px-3 py-1 rounded bg-rose-600 text-white hover:bg-rose-700 inline-flex items-center gap-1"><Trash2 size={14}/> Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
