import React, { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Clock, Activity } from 'lucide-react';

function formatDateISO(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

const STATUSES = [
  { key: 'Hadir', color: 'bg-green-500', icon: CheckCircle2 },
  { key: 'Alfa', color: 'bg-red-500', icon: XCircle },
  { key: 'Izin', color: 'bg-yellow-500', icon: Clock },
  { key: 'Sakit', color: 'bg-orange-500', icon: Activity },
];

export default function AttendanceManager({ students, attendance, onMark }) {
  const [date, setDate] = useState(formatDateISO());
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  }, [students, search]);

  const getStatus = (studentId) => {
    const r = attendance.find(a => a.studentId === studentId && a.date === date);
    return r?.status || '-';
  };

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold">Absensi Harian</h2>
        <div className="flex gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <input
            placeholder="Cari nama siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2 pr-4">Nama</th>
              <th className="py-2 pr-4">Kelas</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="py-2 pr-4">{s.name}</td>
                <td className="py-2 pr-4">{s.className}</td>
                <td className="py-2 pr-4">
                  <span className="inline-flex items-center gap-2">
                    {STATUSES.map((st) => (
                      <span key={st.key} className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full text-white ${getStatus(s.id) === st.key ? st.color : 'bg-gray-300'}`}>
                        <st.icon size={12} /> {st.key}
                      </span>
                    ))}
                  </span>
                </td>
                <td className="py-2 pr-4">
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((st) => (
                      <button
                        key={st.key}
                        className={`px-3 py-1 rounded text-white text-xs ${st.color} hover:opacity-90`}
                        onClick={() => onMark({ studentId: s.id, date, status: st.key })}
                      >
                        {st.key}
                      </button>
                    ))}
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
