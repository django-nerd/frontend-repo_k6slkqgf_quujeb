import React, { useEffect, useMemo, useState } from 'react';
import SummaryCards from './components/SummaryCards';
import StudentManager from './components/StudentManager';
import AttendanceManager from './components/AttendanceManager';
import AgendaManager from './components/AgendaManager';
import GradesManager from './components/GradesManager';
import { School, Home, Users, CheckCircle2, Calendar, GraduationCap, LogIn } from 'lucide-react';

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
  const apiBase = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

  // Local demo state (frontend). Backend integration buttons are available in header.
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]); // { studentId, date, status }
  const [agendas, setAgendas] = useState([]); // { id, title, date }
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Backend status + simple login
  const [backendStatus, setBackendStatus] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!apiBase) return;
    fetch(`${apiBase}/test`).then(r => r.json()).then(setBackendStatus).catch(() => setBackendStatus(''));
  }, [apiBase]);

  const doLogin = async () => {
    if (!apiBase) return;
    const res = await fetch(`${apiBase}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    });
    const data = await res.json();
    if (data?.token) setToken(data.token);
  };

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
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
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
          <div className="hidden md:flex items-center gap-2">
            <input
              className="border rounded px-2 py-1 text-sm"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e)=>setLoginForm({...loginForm, username: e.target.value})}
            />
            <input
              className="border rounded px-2 py-1 text-sm"
              placeholder="Password"
              type="password"
              value={loginForm.password}
              onChange={(e)=>setLoginForm({...loginForm, password: e.target.value})}
            />
            <button onClick={doLogin} className="inline-flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded text-sm"><LogIn size={14}/> Login</button>
            {token && <span className="text-xs text-emerald-700">Token aktif</span>}
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 pb-3">
          {apiBase ? (
            <p className="text-xs text-gray-500">Backend: {typeof backendStatus === 'object' ? backendStatus.database : 'cek...' } • {apiBase}</p>
          ) : (
            <p className="text-xs text-red-600">VITE_BACKEND_URL belum di-set</p>
          )}
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
            apiBase={apiBase}
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
        Dibuat untuk kebutuhan demo administrasi guru SD — data belum tersimpan permanen. Sudah tersedia API untuk simpan permanen.
      </footer>
    </div>
  );
}
