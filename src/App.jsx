import React, { useMemo, useState } from 'react';
import SummaryCards from './components/SummaryCards';
import StudentManager from './components/StudentManager';
import AttendanceManager from './components/AttendanceManager';
import AgendaAndGrades from './components/AgendaAndGrades';
import { School } from 'lucide-react';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function App() {
  // In this initial build, data is kept in component state for demo.
  // Backend endpoints can be wired later to persist this data.
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]); // { studentId, date, status }
  const [agendas, setAgendas] = useState([]); // { id, title, date }

  // CRUD Students
  const addStudent = (data) => {
    setStudents((prev) => [...prev, { id: uid(), name: data.name, className: data.className, grades: [] }]);
  };
  const updateStudent = (id, data) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };
  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setAttendance((prev) => prev.filter((a) => a.studentId !== id));
  };

  // Attendance
  const markAttendance = ({ studentId, date, status }) => {
    setAttendance((prev) => {
      const exists = prev.find((r) => r.studentId === studentId && r.date === date);
      if (exists) {
        return prev.map((r) => (r.studentId === studentId && r.date === date ? { ...r, status } : r));
      }
      return [...prev, { studentId, date, status }];
    });
  };

  // Agenda CRUD
  const addAgenda = (data) => setAgendas((p) => [...p, { id: uid(), ...data }]);
  const updateAgenda = (id, data) => setAgendas((p) => p.map((a) => (a.id === id ? { ...a, ...data } : a)));
  const deleteAgenda = (id) => setAgendas((p) => p.filter((a) => a.id !== id));

  // Grades
  const addGrade = (studentId, grade) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, grades: [...(s.grades || []), grade] } : s)));
  };
  const deleteGrade = (studentId, index) => {
    setStudents((prev) => prev.map((s) => {
      if (s.id !== studentId) return s;
      const newGrades = (s.grades || []).slice();
      newGrades.splice(index, 1);
      return { ...s, grades: newGrades };
    }))
  };

  const attendanceByDate = useMemo(() => attendance, [attendance]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white"><School size={18}/></span>
            <h1 className="font-semibold text-gray-900">Dashboard Absensi SD</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <SummaryCards students={students} attendance={attendanceByDate} agendas={agendas} />

        <StudentManager
          students={students}
          onAdd={addStudent}
          onUpdate={updateStudent}
          onDelete={deleteStudent}
        />

        <AttendanceManager
          students={students}
          attendance={attendanceByDate}
          onMark={markAttendance}
        />

        <AgendaAndGrades
          students={students}
          agendas={agendas}
          onAddAgenda={addAgenda}
          onUpdateAgenda={updateAgenda}
          onDeleteAgenda={deleteAgenda}
          onAddGrade={addGrade}
          onDeleteGrade={deleteGrade}
        />
      </main>

      <footer className="py-8 text-center text-xs text-gray-500">
        Dibuat untuk kebutuhan demo administrasi guru SD — data belum tersimpan permanen.
      </footer>
    </div>
  );
}
