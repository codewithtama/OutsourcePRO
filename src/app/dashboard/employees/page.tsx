"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Employee, PaginatedResponse } from "@/lib/types";
import { Button } from "@/components/Button";
import { Input, Select } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/Badge";
import { TableSkeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";

const EMPTY_FORM = {
  employee_id: "", nik: "", full_name: "", email: "", phone: "",
  gender: "", dob: "", address: "", join_date: "", position: "",
  department: "", site: "", status: "Active",
};

const GENDER_OPTIONS = [
  { value: "", label: "Select" },
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
];

const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Terminated", label: "Terminated" },
  { value: "Resigned", label: "Resigned" },
];

export default function EmployeeDirectory() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [from, setFrom] = useState<number | null>(null);
  const [to, setTo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEmployees = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse<Employee>>(`/employees?page=${page}`);
      setEmployees(res.data ?? []);
      setTotal(res.total ?? 0);
      setCurrentPage(res.current_page ?? 1);
      setLastPage(res.last_page ?? 1);
      setFrom(res.from ?? null);
      setTo(res.to ?? null);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const filtered = employees.filter(
    (e) =>
      e.full_name.toLowerCase().includes(search.toLowerCase()) ||
      e.employee_id.toLowerCase().includes(search.toLowerCase()) ||
      (e.department ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (e.site ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingEmployee(null);
    setForm({ ...EMPTY_FORM });
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setForm({
      employee_id: emp.employee_id, nik: emp.nik, full_name: emp.full_name,
      email: emp.email, phone: emp.phone ?? "", gender: emp.gender ?? "",
      dob: emp.dob ?? "", address: emp.address ?? "", join_date: emp.join_date ?? "",
      position: emp.position ?? "", department: emp.department ?? "",
      site: emp.site ?? "", status: emp.status,
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, form);
      } else {
        await api.post("/employees", form);
      }
      setShowModal(false);
      await fetchEmployees(currentPage);
    } catch (err: unknown) {
      const e = err as { message?: string; errors?: Record<string, string[]> };
      setFormError(e.errors ? Object.values(e.errors).flat().join(" ") : e.message ?? "Failed to save employee");
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/employees/${deleteTarget.id}`);
      setDeleteTarget(null);
      await fetchEmployees(currentPage);
    } catch { /* ignore */ }
    setDeleting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">Employee Directory</h1>
          <p className="text-brand-muted text-sm mt-1 font-semibold">{total} registered team members</p>
        </div>
        <Button onClick={openAddModal} className="text-xs font-bold shadow-md shadow-brand-primary/10">
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </Button>
      </div>

      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted/70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, ID, department..."
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
                {["Employee ID", "Name", "Position", "Department", "Site", "Status", ""].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-xs font-bold text-brand-muted uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <TableSkeleton />
              ) : filtered.length === 0 ? (
                <EmptyState message="No employees found" search={search} />
              ) : (
                filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-[#fafbfc] transition-all duration-200 cursor-pointer"
                    onClick={() => router.push(`/dashboard/employees/${emp.id}`)}
                  >
                    <td className="px-6 py-4 text-sm font-mono text-brand-primary font-bold">{emp.employee_id}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-brand-dark leading-tight">{emp.full_name}</p>
                      <p className="text-xs text-brand-muted font-medium mt-0.5">{emp.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-dark font-medium">{emp.position ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-brand-dark font-medium">{emp.department ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-brand-dark font-medium">{emp.site ?? "—"}</td>
                    <td className="px-6 py-4"><Badge status={emp.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openEditModal(emp)}
                          className="text-brand-muted hover:text-brand-primary transition-all p-2 rounded-lg hover:bg-brand-primary-light"
                          title="Edit employee"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(emp)}
                          className="text-brand-muted hover:text-google-red transition-all p-2 rounded-lg hover:bg-rose-50"
                          title="Delete employee"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} lastPage={lastPage} total={total} from={from} to={to} onPageChange={(p) => fetchEmployees(p)} />
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingEmployee ? "Edit Employee" : "Add New Employee"} size="lg">
        {formError && (
          <div className="mx-6 mt-4 px-4 py-3 bg-rose-50 border border-rose-200/50 text-google-red text-xs font-semibold rounded-lg">{formError}</div>
        )}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Employee ID *" id="emp-id" value={form.employee_id} onChange={(v) => setForm((f) => ({ ...f, employee_id: v }))} placeholder="EMP-006" required />
            <Input label="NIK (16 digits) *" id="emp-nik" value={form.nik} onChange={(v) => setForm((f) => ({ ...f, nik: v }))} placeholder="3273012345678906" required />
            <Input label="Full Name *" id="emp-name" value={form.full_name} onChange={(v) => setForm((f) => ({ ...f, full_name: v }))} placeholder="Budi Santoso" required className="sm:col-span-2" />
            <Input label="Email *" id="emp-email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} placeholder="budi@outsourcepro.com" required />
            <Input label="Phone" id="emp-phone" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="081234567895" />
            <Select label="Gender" id="emp-gender" value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))} options={GENDER_OPTIONS} />
            <Input label="Date of Birth" id="emp-dob" type="date" value={form.dob} onChange={(v) => setForm((f) => ({ ...f, dob: v }))} />
            <Input label="Join Date" id="emp-joindate" type="date" value={form.join_date} onChange={(v) => setForm((f) => ({ ...f, join_date: v }))} />
            <Input label="Position" id="emp-position" value={form.position} onChange={(v) => setForm((f) => ({ ...f, position: v }))} placeholder="Software Engineer" />
            <Input label="Department" id="emp-dept" value={form.department} onChange={(v) => setForm((f) => ({ ...f, department: v }))} placeholder="Engineering" />
            <Input label="Site" id="emp-site" value={form.site} onChange={(v) => setForm((f) => ({ ...f, site: v }))} placeholder="HQ Jakarta" />
            <Select label="Status *" id="emp-status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} options={STATUS_OPTIONS} />
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5" htmlFor="emp-address">Address</label>
              <textarea
                id="emp-address"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                rows={2}
                placeholder="Jl. Contoh No. 1, Jakarta"
                className="w-full px-4 py-2.5 border border-brand-border text-brand-dark text-sm rounded-lg outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all duration-200 resize-none placeholder-brand-muted/40"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-brand-border">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={submitting} className="flex-1">Save Employee</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Employee" size="sm">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-google-red" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <p className="text-brand-dark text-sm font-bold">Remove Employee</p>
          <p className="text-brand-muted text-xs font-semibold mt-1.5 leading-relaxed">
            Are you sure you want to delete <span className="text-brand-dark">{deleteTarget?.full_name}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3 mt-6">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} className="flex-1 text-xs">Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete} className="flex-1 text-xs">Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

