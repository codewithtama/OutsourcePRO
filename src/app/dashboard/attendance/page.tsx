"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";

const MOCK_ATTENDANCE = [
  { id: 1, name: "John Doe", shift: "Morning Shift (08:00 - 17:00)", checkIn: "07:54", checkOut: "17:05", status: "H" },
  { id: 2, name: "Jane Smith", shift: "Morning Shift (08:00 - 17:00)", checkIn: "08:15", checkOut: "17:00", status: "I" },
  { id: 3, name: "Michael Johnson", shift: "Middle Shift (12:00 - 21:00)", checkIn: "11:58", checkOut: "21:02", status: "H" },
  { id: 4, name: "Sarah Connor", shift: "Morning Shift (08:00 - 17:00)", checkIn: null, checkOut: null, status: "A" },
  { id: 5, name: "David Miller", shift: "Night Shift (22:00 - 06:00)", checkIn: null, checkOut: null, status: "OFF" },
];

export default function AttendancePage() {
  const [attendance] = useState(MOCK_ATTENDANCE);
  const [search, setSearch] = useState("");

  const filtered = attendance.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
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
          <span className="text-2xl font-extrabold text-google-green mt-2">2</span>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Izin (I)</span>
          <span className="text-2xl font-extrabold text-google-yellow mt-2">1</span>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Sakit (S)</span>
          <span className="text-2xl font-extrabold text-blue-500 mt-2">0</span>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Alpha (A)</span>
          <span className="text-2xl font-extrabold text-google-red mt-2">1</span>
        </Card>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Day Off (OFF)</span>
          <span className="text-2xl font-extrabold text-brand-muted mt-2">1</span>
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
                {["Employee Name", "Current Shift", "Check-In", "Check-Out", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-xs font-bold text-brand-muted uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-[#fafbfc] transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-brand-dark">{record.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-brand-muted font-medium">{record.shift}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-brand-dark font-medium">{record.checkIn || "—"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-brand-dark font-medium">{record.checkOut || "—"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={record.status} />
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
