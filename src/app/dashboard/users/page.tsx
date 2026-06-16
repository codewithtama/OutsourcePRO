"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";
import { User, Role, PaginatedResponse } from "@/lib/types";
import { Button } from "@/components/Button";
import { Input, Select } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/Badge";
import { TableSkeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "",
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Deterministic avatar color from name
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
];
function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [from, setFrom] = useState<number | null>(null);
  const [to, setTo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse<User>>(`/users?page=${page}`);
      setUsers(res.data ?? []);
      setTotal(res.total ?? 0);
      setCurrentPage(res.current_page ?? 1);
      setLastPage(res.last_page ?? 1);
      setFrom(res.from ?? null);
      setTo(res.to ?? null);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await api.get<{ data?: Role[] } | Role[]>("/roles");
      const data = Array.isArray(res) ? res : (res.data ?? []);
      setRoles(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "ALL" || u.roles.some((r) => r.name === filterRole);
    return matchSearch && matchRole;
  });

  // ── Handlers ──
  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.roles[0]?.name ?? "",
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
        // Omit password if blank (no change)
        const payload: Record<string, string> = {
          name: form.name,
          email: form.email,
          role: form.role,
        };
        if (form.password) payload.password = form.password;
        await api.put(`/users/${editing.id}`, payload);
      } else {
        await api.post("/users", form);
      }
      setShowForm(false);
      await fetchUsers(currentPage);
    } catch (err: unknown) {
      const e = err as { message?: string; errors?: Record<string, string[]> };
      setFormError(e.errors ? Object.values(e.errors).flat().join(" ") : e.message ?? "Failed to save user");
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/users/${deleteTarget.id}`);
      setDeleteTarget(null);
      await fetchUsers(currentPage);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setFormError(e.message ?? "Failed to delete user");
    }
    setDeleting(false);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">User Management</h1>
          <p className="text-brand-muted text-sm mt-1 font-semibold">
            Manage system accounts and their assigned roles
          </p>
        </div>
        <Button onClick={openAdd} className="text-xs font-bold shadow-md shadow-brand-primary/10">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </Button>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted/70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-brand-border text-brand-dark text-sm rounded-lg placeholder-brand-muted/60 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all duration-200"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["ALL", ...roles.map((r) => r.name)].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                filterRole === r
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/15"
                  : "bg-white border border-brand-border text-brand-muted hover:bg-[#fafbfc]"
              }`}
            >
              {r === "ALL" ? "All Roles" : r}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-border bg-[#fafbfc]">
                {["User", "Email", "Role", "Created", ""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-xs font-bold text-brand-muted uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <TableSkeleton />
              ) : filtered.length === 0 ? (
                <EmptyState message="No users found" search={search} />
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-[#fafbfc] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${avatarColor(user.name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                          {initials(user.name)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brand-dark leading-tight">{user.name}</p>
                          <p className="text-xs text-brand-muted font-medium mt-0.5">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-brand-dark font-medium">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles.length > 0 ? (
                          user.roles.map((r) => <Badge key={r.id} status={r.name} />)
                        ) : (
                          <span className="text-xs text-brand-muted font-semibold">No role</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-brand-muted font-medium">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(user)}
                          className="text-brand-muted hover:text-brand-primary transition-all p-2 rounded-lg hover:bg-brand-primary-light"
                          title="Edit user"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="text-brand-muted hover:text-google-red transition-all p-2 rounded-lg hover:bg-rose-50"
                          title="Delete user"
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
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          total={total}
          from={from}
          to={to}
          onPageChange={(p) => fetchUsers(p)}
        />
      </div>

      {/* ── Add/Edit Modal ── */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit User" : "Add New User"}
        size="md"
      >
        {formError && (
          <div className="mx-6 mt-4 px-4 py-3 bg-rose-50 border border-rose-200/50 text-google-red text-xs font-semibold rounded-lg">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <Input
            label="Full Name *"
            id="user-name"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            placeholder="John Doe"
            required
          />
          <Input
            label="Email *"
            id="user-email"
            type="email"
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            placeholder="john@outsourcepro.com"
            required
          />
          <Input
            label={editing ? "New Password (leave blank to keep)" : "Password *"}
            id="user-password"
            type="password"
            value={form.password}
            onChange={(v) => setForm((f) => ({ ...f, password: v }))}
            placeholder="••••••••"
            required={!editing}
          />
          <Select
            label="Role *"
            id="user-role"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            options={[
              { value: "", label: "Select role" },
              ...roles.map((r) => ({ value: r.name, label: r.name })),
            ]}
          />
          <div className="flex gap-3 pt-4 border-t border-brand-border">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={submitting} className="flex-1">
              {editing ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Modal ── */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete User" size="sm">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-google-red" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <p className="text-brand-dark text-sm font-bold">Remove User</p>
          <p className="text-brand-muted text-xs font-semibold mt-1.5 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="text-brand-dark font-bold">{deleteTarget?.name}</span>? This action cannot be undone.
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
