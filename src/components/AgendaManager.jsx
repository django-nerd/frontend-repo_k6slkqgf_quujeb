import React, { useState } from 'react';
import { CalendarPlus, Pencil, Trash2 } from 'lucide-react';

export default function AgendaManager({ agendas, onAddAgenda, onUpdateAgenda, onDeleteAgenda }) {
  const [agendaForm, setAgendaForm] = useState({ title: '', date: '' });
  const [editingAgendaId, setEditingAgendaId] = useState(null);

  const submitAgenda = (e) => {
    e.preventDefault();
    if (!agendaForm.title || !agendaForm.date) return;
    if (editingAgendaId) {
      onUpdateAgenda(editingAgendaId, agendaForm);
      setEditingAgendaId(null);
    } else {
      onAddAgenda(agendaForm);
    }
    setAgendaForm({ title: '', date: '' });
  };

  const startEditAgenda = (ag) => {
    setEditingAgendaId(ag.id);
    setAgendaForm({ title: ag.title, date: ag.date });
  };

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Agenda</h2>
      </div>

      <form onSubmit={submitAgenda} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Judul Agenda"
          value={agendaForm.title}
          onChange={(e) => setAgendaForm({ ...agendaForm, title: e.target.value })}
        />
        <input
          type="date"
          className="border rounded-lg px-3 py-2"
          value={agendaForm.date}
          onChange={(e) => setAgendaForm({ ...agendaForm, date: e.target.value })}
        />
        <button type="submit" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2">
          <CalendarPlus size={16}/> {editingAgendaId ? 'Simpan' : 'Tambah'}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2 pr-4">Tanggal</th>
              <th className="py-2 pr-4">Judul</th>
              <th className="py-2 pr-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {agendas
              .slice()
              .sort((a,b) => a.date.localeCompare(b.date))
              .map((ag) => (
              <tr key={ag.id} className="border-t">
                <td className="py-2 pr-4">{ag.date}</td>
                <td className="py-2 pr-4">{ag.title}</td>
                <td className="py-2 pr-4">
                  <div className="flex gap-2">
                    <button onClick={() => startEditAgenda(ag)} className="px-3 py-1 rounded bg-amber-500 text-white hover:bg-amber-600 inline-flex items-center gap-1"><Pencil size={14}/> Edit</button>
                    <button onClick={() => onDeleteAgenda(ag.id)} className="px-3 py-1 rounded bg-rose-600 text-white hover:bg-rose-700 inline-flex items-center gap-1"><Trash2 size={14}/> Hapus</button>
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
