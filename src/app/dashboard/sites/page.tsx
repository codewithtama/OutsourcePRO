"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";

interface SiteData {
  id: number;
  code: string;
  name: string;
  address: string;
  city: string;
  contact_person: string;
  contact_phone: string;
  status: string;
  active_placements_count?: number;
}

export default function SitesPage() {
  const [sites, setSites] = useState<SiteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSites = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: SiteData[] }>("/sites");
      setSites(res.data ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const filtered = sites.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.address ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (s.contact_person ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">Site Management</h1>
          <p className="text-brand-muted text-sm mt-1 font-semibold">Monitor active sites placement & site headcount targets</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="text-xs">
            Transfer Request
          </Button>
          <Button className="text-xs">
            Add New Site
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Total Active Sites</p>
            <p className="text-3xl font-extrabold text-brand-dark tracking-tight mt-1">
              {loading ? "—" : sites.length}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-brand-primary-light text-brand-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Total Target Placements</p>
            <p className="text-3xl font-extrabold text-brand-dark tracking-tight mt-1">
              {loading ? "—" : sites.length * 30}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-google-green">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Active Placements</p>
            <p className="text-3xl font-extrabold text-brand-dark tracking-tight mt-1">
              {loading ? "—" : sites.reduce((acc, curr) => acc + (curr.active_placements_count || 0), 0)}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted/70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search sites, coordinators..."
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
                {["Site Name", "Location", "Active Placements", "Coordinator", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-xs font-bold text-brand-muted uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-brand-muted text-sm font-semibold">
                    Loading site directories...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-brand-muted text-sm font-semibold">
                    No active sites found matching search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((site) => {
                  return (
                    <tr key={site.id} className="hover:bg-[#fafbfc] transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-brand-dark">{site.name}</p>
                        <p className="text-xs text-brand-muted font-semibold mt-0.5">{site.code}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-brand-muted font-medium">{site.address || "—"}, {site.city || "—"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-brand-dark">
                          {site.active_placements_count || 0}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-brand-dark font-medium">{site.contact_person || "—"}</p>
                        <p className="text-xs text-brand-muted font-semibold mt-0.5">{site.contact_phone || "—"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={site.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

