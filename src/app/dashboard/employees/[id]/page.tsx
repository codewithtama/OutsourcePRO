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
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-brand-primary-light rounded-lg" />
        <div className="h-8 w-64 bg-brand-primary-light rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 bg-brand-primary-light rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!emp) {
    return (
      <div className="text-center py-16">
        <p className="text-brand-muted text-lg font-bold">Employee not found</p>
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
        <button onClick={() => router.back()} className="text-brand-muted hover:text-brand-primary text-xs font-bold mb-2 flex items-center gap-1 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Directory
        </button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">{emp.full_name}</h1>
          <p className="text-brand-muted text-sm font-semibold mt-1">{emp.position} &middot; {emp.department}</p>
        </div>
        <Badge status={emp.status} />
      </div>

      <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-premium">
        <h2 className="text-base font-bold text-brand-dark tracking-tight mb-5">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.label} className="p-4 bg-[#fafbfc] border border-brand-border rounded-xl">
              <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">{f.label}</p>
              <p className="text-sm font-bold text-brand-dark mt-1.5">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => router.back()} className="text-xs">Back to Directory</Button>
      </div>
    </div>
  );
}

