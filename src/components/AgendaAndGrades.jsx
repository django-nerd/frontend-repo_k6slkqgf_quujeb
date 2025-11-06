import React, { useMemo, useState } from 'react';
import { CalendarPlus, Pencil, Trash2, GraduationCap } from 'lucide-react';

export default function AgendaAndGrades({ students, agendas, onAddAgenda, onUpdateAgenda, onDeleteAgenda, onAddGrade, onDeleteGrade }) {
  // Agenda state
  const [agendaForm, setAgendaForm] = useState({ title: '', date: '' });
  const [editingAgendaId, setEditingAgendaId] = useState(null);

  // Grade state
  const [selectedStudent, setSelectedStudent] = useState('');
  const [gradeForm, setGradeForm] = useState({ subject: '', score: '' });

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

  const classAvg = useMemo(() => {
    const scores = students.flatMap(s => (s.grades || []).map(g => Number(g.score))).filter(n => !Number.isNaN(n));
    if (scores.length === 0) return 0;
    return Number((scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(2));
  }, [students]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Agenda */}
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

      {/* Grades */}
      <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Penilaian</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Pilih Siswa</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input
            placeholder="Mata Pelajaran"
            value={gradeForm.subject}
            onChange={(e) => setGradeForm({ ...gradeForm, subject: e.target.value })}
            className="border rounded-lg px-3 py-2"
          />
          <input
            placeholder="Nilai"
            type="number"
            value={gradeForm.score}
            onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
            className="border rounded-lg px-3 py-2"
          />
          <button
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2"
            onClick={() => {
              if (!selectedStudent || !gradeForm.subject || gradeForm.score === '') return;
              onAddGrade(selectedStudent, { ...gradeForm, score: Number(gradeForm.score) });
              setGradeForm({ subject: '', score: '' });
            }}
          >
            <GraduationCap size={16}/> Tambah Nilai
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-2">Rata-rata nilai kelas: <span className="font-semibold">{classAvg}</span></p>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">Siswa</th>
                <th className="py-2 pr-4">Mata Pelajaran</th>
                <th className="py-2 pr-4">Nilai</th>
                <th className="py-2 pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {students.flatMap((s) => (s.grades || []).map((g, idx) => ({...g, student: s, idx}))).map((row, i) => (
                <tr key={`${row.student.id}-${i}`} className="border-t">
                  <td className="py-2 pr-4">{row.student.name}</td>
                  <td className="py-2 pr-4">{row.subject}</td>
                  <td className="py-2 pr-4">{row.score}</td>
                  <td className="py-2 pr-4">
                    <button onClick={() => onDeleteGrade(row.student.id, row.idx)} className="px-3 py-1 rounded bg-rose-600 text-white hover:bg-rose-700 inline-flex items-center gap-1"><Trash2 size={14}/> Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
