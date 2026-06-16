"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { Contract, Employee, PaginatedResponse } from "@/lib/types";
import { Button } from "@/components/Button";
import { Input, Select } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { TableSkeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";

// ── Helpers ──

function remainingDays(endDate: string | null): number | null {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.ceil(diff / 86_400_000);
}

function riskLevel(days: number | null, type: string): "urgent" | "review" | "safe" {
  if (days === null || type === "PKWTT") return "safe";
  if (days <= 14) return "urgent";
  if (days <= 30) return "review";
  return "safe";
}

function riskColor(level: "urgent" | "review" | "safe") {
  if (level === "urgent") return { bg: "bg-rose-50", border: "border-rose-500", text: "text-rose-700", pill: "bg-rose-50 text-rose-700 border-rose-200/50" };
  if (level === "review") return { bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-700", pill: "bg-amber-50 text-amber-700 border-amber-200/50" };
  return { bg: "bg-emerald-50", border: "border-emerald-500", text: "text-emerald-700", pill: "bg-emerald-50 text-emerald-700 border-emerald-200/50" };
}

function dotColor(level: "urgent" | "review" | "safe") {
  if (level === "urgent") return "bg-rose-500 animate-pulse";
  if (level === "review") return "bg-amber-500";
  return "bg-emerald-500";
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// ── Options ──

const CONTRACT_TYPES = ["PKWT", "PKWTT", "Internship", "Probation"];
const TYPE_OPTIONS = [{ value: "", label: "Select type" }, ...CONTRACT_TYPES.map((t) => ({ value: t, label: t }))];

const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Expired", label: "Expired" },
  { value: "Terminated", label: "Terminated" },
];

const EMPTY_FORM = {
  employee_id: "",
  contract_number: "",
  contract_type: "",
  start_date: "",
  end_date: "",
  status: "Active",
};

// ── Page ──

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("ALL");

  // CRUD modals
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Contract | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Contract | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Employee select
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const params = filterType !== "ALL" ? `?type=${filterType}` : "";
      const res = await api.get<PaginatedResponse<Contract>>(`/contracts${params}`);
      setContracts(res.data ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  }, [filterType]);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await api.get<PaginatedResponse<Employee>>("/employees?per_page=100");
      setEmployees(res.data ?? []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  useEffect(() => {
    if (showForm) fetchEmployees();
  }, [showForm, fetchEmployees]);

  // ── Computed: risk cards ──
  const riskCounts = useMemo(() => {
    let urgent = 0;
    let review = 0;
    let safe = 0;
    for (const c of contracts) {
      if (c.status !== "Active") continue;
      const days = remainingDays(c.end_date);
      const level = riskLevel(days, c.contract_type);
      if (level === "urgent") urgent++;
      else if (level === "review") review++;
      else safe++;
    }
    return { urgent, review, safe };
  }, [contracts]);

  // ── Handlers ──
  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (c: Contract) => {
    setEditing(c);
    setForm({
      employee_id: String(c.employee_id),
      contract_number: c.contract_number,
      contract_type: c.contract_type,
      start_date: c.start_date,
      end_date: c.end_date ?? "",
      status: c.status,
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (editing) {
        await api.put(`/contracts/${editing.id}`, form);
      } else {
        if (!form.employee_id) {
          setFormError("Please select an employee.");
          setSubmitting(false);
          return;
        }
        await api.post(`/employees/${form.employee_id}/contracts`, form);
      }
      setShowForm(false);
      await fetchContracts();
    } catch (err: unknown) {
      const e = err as { message?: string; errors?: Record<string, string[]> };
      setFormError(e.errors ? Object.values(e.errors).flat().join(" ") : e.message ?? "Failed to save contract");
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/contracts/${deleteTarget.id}`);
      setDeleteTarget(null);
      await fetchContracts();
    } catch { /* ignore */ }
    setDeleting(false);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">Contract Management</h1>
          <p className="text-brand-muted text-sm mt-1 font-semibold">
            Monitor employee contracts, alert levels, and status compliance
          </p>
        </div>
        <Button onClick={openAdd} className="text-xs font-bold shadow-md shadow-brand-primary/10">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Contract
        </Button>
      </div>

      {/* ── Risk Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {([
          { level: "urgent" as const, label: "Urgent Action (< 14 Days)", count: riskCounts.urgent, tag: "High Risk" },
          { level: "review" as const, label: "Review Needed (14–30 Days)", count: riskCounts.review, tag: "Medium Risk" },
          { level: "safe" as const, label: "Safe (> 30 Days / PKWTT)", count: riskCounts.safe, tag: "Compliant" },
        ]).map((card) => {
          const c = riskColor(card.level);
          return (
            <Card key={card.level} className={`p-5 border-l-4 ${c.border} flex items-center justify-between`}>
              <div>
                <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-extrabold text-brand-dark tracking-tight mt-1">
                  {loading ? "—" : `${card.count} ${card.count === 1 ? "Employee" : "Employees"}`}
                </p>
              </div>
              <span className={`px-2.5 py-1 text-xs font-bold ${c.pill} rounded-lg border`}>{card.tag}</span>
            </Card>
          );
        })}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "PKWT", "PKWTT", "Internship", "Probation"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filterType === type
                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/15"
                : "bg-white border border-brand-border text-brand-muted hover:bg-[#fafbfc]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-border bg-[#fafbfc]">
                {["Employee", "Type", "Contract #", "Start Date", "End Date", "Remaining", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-xs font-bold text-brand-muted uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <TableSkeleton />
              ) : contracts.length === 0 ? (
                <EmptyState message="No contracts found" />
              ) : (
                contracts.map((contract) => {
                  const days = remainingDays(contract.end_date);
                  const level = riskLevel(days, contract.contract_type);
                  const rc = riskColor(level);
                  return (
                    <tr key={contract.id} className="hover:bg-[#fafbfc] transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-brand-dark leading-tight">
                          {contract.employee?.full_name ?? "—"}
                        </p>
                        <p className="text-xs text-brand-muted font-medium mt-0.5">
                          {contract.employee?.position ?? ""}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge status={contract.contract_type} />
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-mono text-brand-primary font-medium">{contract.contract_number}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-brand-dark font-medium">{fmtDate(contract.start_date)}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-brand-muted font-medium">
                          {contract.end_date ? fmtDate(contract.end_date) : "Permanent"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        {days === null ? (
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-md ${rc.pill} border`}>PKWTT</span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor(level)}`} />
                            <p className={`text-sm font-bold ${rc.text}`}>
                              {days > 0 ? `${days} days left` : days === 0 ? "Expires today" : `${Math.abs(days)}d overdue`}
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <Badge status={contract.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(contract)}
                            className="text-brand-muted hover:text-brand-primary transition-all p-2 rounded-lg hover:bg-brand-primary-light"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(contract)}
                            className="text-brand-muted hover:text-google-red transition-all p-2 rounded-lg hover:bg-rose-50"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Contract" : "Add New Contract"}
        size="lg"
      >
        {formError && (
          <div className="mx-6 mt-4 px-4 py-3 bg-rose-50 border border-rose-200/50 text-google-red text-xs font-semibold rounded-lg">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!editing && (
              <Select
                label="Employee *"
                id="ct-employee"
                value={form.employee_id}
                onChange={(e) => setForm((f) => ({ ...f, employee_id: e.target.value }))}
                options={[
                  { value: "", label: "Select employee" },
                  ...employees.map((e) => ({ value: String(e.id), label: `${e.employee_id} — ${e.full_name}` })),
                ]}
                error={!form.employee_id && formError ? "Required" : undefined}
              />
            )}
            {editing && (
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5">Employee</p>
                <p className="text-sm font-bold text-brand-dark">
                  {editing.employee?.full_name ?? "—"}{" "}
                  <span className="font-normal text-brand-muted">({editing.employee?.employee_id})</span>
                </p>
              </div>
            )}

            <Input
              label="Contract Number *"
              id="ct-number"
              value={form.contract_number}
              onChange={(v) => setForm((f) => ({ ...f, contract_number: v }))}
              placeholder="CON/2026/001"
              required
            />
            <Select
              label="Contract Type *"
              id="ct-type"
              value={form.contract_type}
              onChange={(e) => setForm((f) => ({ ...f, contract_type: e.target.value }))}
              options={TYPE_OPTIONS}
            />
            <Input
              label="Start Date *"
              id="ct-start"
              type="date"
              value={form.start_date}
              onChange={(v) => setForm((f) => ({ ...f, start_date: v }))}
              required
            />
            <Input
              label="End Date"
              id="ct-end"
              type="date"
              value={form.end_date}
              onChange={(v) => setForm((f) => ({ ...f, end_date: v }))}
              placeholder="Leave empty for PKWTT / permanent"
            />
            <Select
              label="Status *"
              id="ct-status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              options={STATUS_OPTIONS}
            />
          </div>
          <div className="flex gap-3 pt-4 border-t border-brand-border">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={submitting} className="flex-1">
              {editing ? "Update Contract" : "Create Contract"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Modal ── */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Contract" size="sm">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-google-red" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <p className="text-brand-dark text-sm font-bold">Remove Contract</p>
          <p className="text-brand-muted text-xs font-semibold mt-1.5 leading-relaxed">
            Are you sure you want to delete contract{" "}
            <span className="text-brand-dark font-bold">{deleteTarget?.contract_number}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3 mt-6">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} className="flex-1 text-xs">
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete} className="flex-1 text-xs">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
