"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Employee } from "@/lib/types";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [emp, setEmp] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Employee>(`/employees/${id}`)
      .then(setEmp)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-[#f1f3f4] rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#f1f3f4] rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!emp) {
    return (
      <div className="text-center py-12">
        <p className="text-[#5f6368]">Employee not found</p>
        <Button variant="secondary" onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const fields = [
    { label: "Employee ID", value: emp.employee_id },
    { label: "NIK", value: emp.nik },
    { label: "Full Name", value: emp.full_name },
    { label: "Email", value: emp.email },
    { label: "Phone", value: emp.phone || "—" },
    { label: "Gender", value: emp.gender === "M" ? "Male" : emp.gender === "F" ? "Female" : "—" },
    { label: "Date of Birth", value: emp.dob ? new Date(emp.dob).toLocaleDateString("id-ID") : "—" },
    { label: "Join Date", value: emp.join_date ? new Date(emp.join_date).toLocaleDateString("id-ID") : "—" },
    { label: "Position", value: emp.position || "—" },
    { label: "Department", value: emp.department || "—" },
    { label: "Site", value: emp.site || "—" },
    { label: "Address", value: emp.address || "—" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => router.back()} className="text-[#5f6368] hover:text-[#1a73e8] text-sm mb-2 flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to directory
        </button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-normal text-[#202124] tracking-tight">{emp.full_name}</h1>
          <p className="text-[#5f6368] text-sm mt-1">{emp.position} &middot; {emp.department}</p>
        </div>
        <Badge status={emp.status} />
      </div>

      <div className="bg-white border border-[#dadce0] rounded-xl p-6 shadow-google-card">
        <h2 className="text-base font-medium text-[#202124] mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.label} className="p-3 bg-[#f8f9fa] rounded-lg">
              <p className="text-xs font-medium text-[#5f6368] uppercase tracking-wider">{f.label}</p>
              <p className="text-sm text-[#202124] mt-1">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => router.back()}>Back to Directory</Button>
      </div>
    </div>
  );
}
