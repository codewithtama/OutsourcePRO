"use client";

export default function AttendancePage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Attendance</h1>
          <p className="text-slate-400 text-sm mt-1">Track employee attendance and timesheets</p>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-slate-700 mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-slate-400 font-medium">Attendance Module</p>
        <p className="text-slate-600 text-sm mt-1">This module is coming soon</p>
      </div>
    </div>
  );
}
