"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";

interface AttendanceRecord {
  id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  note: string | null;
  employee: {
    full_name: string;
  };
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: AttendanceRecord[] }>("/attendances");
      setAttendance(res.data ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const filtered = attendance.filter((a) =>
    (a.employee?.full_name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">Attendance & Shifts</h1>
          <p className="text-brand-muted text-sm mt-1 font-semibold">Monitor staff check-in/out records, roster shifts, and daily statuses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="text-xs">
            Export Timesheet
          </Button>
          <Button className="text-xs">
            Import Logs
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Hadir (H)</span>
          <span className="text-2xl font-extrabold text-google-green mt-2">
            {loading ? "—" : attendance.filter(a => a.status === "H").length}
          </span>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Izin (I)</span>
          <span className="text-2xl font-extrabold text-google-yellow mt-2">
            {loading ? "—" : attendance.filter(a => a.status === "I").length}
          </span>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Sakit (S)</span>
          <span className="text-2xl font-extrabold text-blue-500 mt-2">
            {loading ? "—" : attendance.filter(a => a.status === "S").length}
          </span>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Alpha (A)</span>
          <span className="text-2xl font-extrabold text-google-red mt-2">
            {loading ? "—" : attendance.filter(a => a.status === "A").length}
          </span>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Day Off (OFF)</span>
          <span className="text-2xl font-extrabold text-brand-muted mt-2">
            {loading ? "—" : attendance.filter(a => a.status === "OFF").length}
          </span>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted/70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-brand-border text-brand-dark text-sm rounded-lg placeholder-brand-muted/60 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all duration-200"
        />
      </div>

      <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-border bg-[#fafbfc]">
                {["Employee Name", "Current Date", "Check-In", "Check-Out", "Status", "Note"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-xs font-bold text-brand-muted uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-brand-muted text-sm font-semibold">
                    Loading daily logs...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-brand-muted text-sm font-semibold">
                    No attendance records found matching search query.
                  </td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-[#fafbfc] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-brand-dark">{record.employee?.full_name || "Unknown"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-brand-muted font-medium">{record.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-brand-dark font-medium">{record.check_in || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-brand-dark font-medium">{record.check_out || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={record.status} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-brand-muted font-medium">{record.note || "—"}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

