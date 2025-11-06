import React, { useMemo, useState } from 'react';
import SummaryCards from './components/SummaryCards';
import StudentManager from './components/StudentManager';
import AttendanceManager from './components/AttendanceManager';
import AgendaManager from './components/AgendaManager';
import GradesManager from './components/GradesManager';
import { School, Home, Users, CheckCircle2, Calendar, GraduationCap } from 'lucide-react';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const MENUS = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'students', label: 'Siswa', icon: Users },
  { key: 'attendance', label: 'Absensi', icon: CheckCircle2 },
  { key: 'agenda', label: 'Agenda', icon: Calendar },
  { key: 'grades', label: 'Nilai', icon: GraduationCap },
];

export default function App() {
  // Data demo (belum persisten). Backend bisa ditambahkan untuk simpan permanen.
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]); // { studentId, date, status }
  const [agendas, setAgendas] = useState([]); // { id, title, date }
  const [activeMenu, setActiveMenu] = useState('dashboard');

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
    }));
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
          <nav className="hidden md:flex items-center gap-1">
            {MENUS.map((m) => (
              <button
                key={m.key}
                onClick={() => setActiveMenu(m.key)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition border ${activeMenu === m.key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <m.icon size={16} /> {m.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="md:hidden sticky top-[56px] z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-2 grid grid-cols-5 gap-2">
          {MENUS.map((m) => (
            <button
              key={m.key}
              onClick={() => setActiveMenu(m.key)}
              className={`inline-flex items-center justify-center gap-1 px-2 py-2 rounded-md text-xs border ${activeMenu === m.key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700'}`}
              title={m.label}
            >
              <m.icon size={16} />
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {activeMenu === 'dashboard' && (
          <>
            <SummaryCards students={students} attendance={attendanceByDate} agendas={agendas} />
            <div className="rounded-xl border bg-white/70 backdrop-blur p-6">
              <h2 className="text-lg font-semibold mb-2">Selamat datang</h2>
              <p className="text-sm text-gray-600">Gunakan menu di atas untuk mengelola Siswa, Absensi, Agenda, dan Nilai. Ringkasan utama tampil di sini.</p>
            </div>
          </>
        )}

        {activeMenu === 'students' && (
          <StudentManager
            students={students}
            onAdd={addStudent}
            onUpdate={updateStudent}
            onDelete={deleteStudent}
          />
        )}

        {activeMenu === 'attendance' && (
          <AttendanceManager
            students={students}
            attendance={attendanceByDate}
            onMark={markAttendance}
          />
        )}

        {activeMenu === 'agenda' && (
          <AgendaManager
            agendas={agendas}
            onAddAgenda={addAgenda}
            onUpdateAgenda={updateAgenda}
            onDeleteAgenda={deleteAgenda}
          />
        )}

        {activeMenu === 'grades' && (
          <GradesManager
            students={students}
            onAddGrade={addGrade}
            onDeleteGrade={deleteGrade}
          />
        )}
      </main>

      <footer className="py-8 text-center text-xs text-gray-500">
        Dibuat untuk kebutuhan demo administrasi guru SD — data belum tersimpan permanen.
      </footer>
    </div>
  );
}
