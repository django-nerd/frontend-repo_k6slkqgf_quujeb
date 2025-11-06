import React, { useMemo } from 'react';
import { Users, CalendarCheck, CalendarClock, BarChart } from 'lucide-react';

function formatDateISO(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export default function SummaryCards({ students = [], attendance = [], agendas = [] }) {
  const today = formatDateISO();

  const { totalStudents, attendanceToday, avgClassScore, upcomingAgendas } = useMemo(() => {
    const totalStudentsCalc = students.length;

    // Attendance recap for today
    const todayRecords = attendance.filter((r) => r.date === today);
    const statusCounts = todayRecords.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      },
      { Hadir: 0, Alfa: 0, Izin: 0, Sakit: 0 }
    );

    // Average score recap across all students
    const allScores = students.flatMap((s) => (s.grades || []).map((g) => Number(g.score))).filter((n) => !Number.isNaN(n));
    const avg = allScores.length ? (allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

    // Upcoming agendas (next 7 days)
    const nowISO = today;
    const upcoming = agendas
      .filter(a => a.date >= nowISO)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3);

    return {
      totalStudents: totalStudentsCalc,
      attendanceToday: statusCounts,
      avgClassScore: Number(avg.toFixed(2)),
      upcomingAgendas: upcoming,
    };
  }, [students, attendance, agendas, today]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Jumlah Siswa/Siswi</p>
            <p className="text-3xl font-semibold text-gray-900 mt-1">{totalStudents}</p>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Users size={24} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Rekapan Absensi (Hari Ini)</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <span className="inline-flex items-center gap-2 text-green-700"><span className="w-2 h-2 rounded-full bg-green-500"></span>Hadir: {attendanceToday.Hadir || 0}</span>
              <span className="inline-flex items-center gap-2 text-red-700"><span className="w-2 h-2 rounded-full bg-red-500"></span>Alfa: {attendanceToday.Alfa || 0}</span>
              <span className="inline-flex items-center gap-2 text-yellow-700"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Izin: {attendanceToday.Izin || 0}</span>
              <span className="inline-flex items-center gap-2 text-orange-700"><span className="w-2 h-2 rounded-full bg-orange-500"></span>Sakit: {attendanceToday.Sakit || 0}</span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <CalendarCheck size={24} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Rata-rata Nilai Kelas</p>
            <p className="text-3xl font-semibold text-gray-900 mt-1">{avgClassScore}</p>
          </div>
          <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
            <BarChart size={24} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <p className="text-sm text-gray-500">Agenda Terdekat</p>
            <ul className="mt-2 space-y-1">
              {upcomingAgendas.length === 0 && (
                <li className="text-sm text-gray-600">Belum ada agenda</li>
              )}
              {upcomingAgendas.map((a) => (
                <li key={a.id} className="text-sm text-gray-800 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-indigo-50 text-indigo-600"><CalendarClock size={14} /></span>
                  <span className="font-medium">{a.title}</span>
                  <span className="text-gray-500">• {a.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
