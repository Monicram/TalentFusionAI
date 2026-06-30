import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useAppStore } from "@/stores/appStore";

export function Candidates() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const candidates = useAppStore((s) => s.candidates);
  const setCandidates = useAppStore((s) => s.setCandidates);
  const setSelected = useAppStore((s) => s.setSelectedCandidate);

  useEffect(() => {
    api.getCandidates().then(setCandidates).catch(console.error);
  }, [setCandidates]);

  const filtered = candidates
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        (c.name || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const aVal = (a as any)[sortField] || "";
      const bVal = (b as any)[sortField] || "";
      if (sortDir === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and view all candidate profiles</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Users className="h-4 w-4" />
          <span>{candidates.length} total</span>
        </div>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidates..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-500">
                    <button className="flex items-center gap-1" onClick={() => { setSortField("name"); setSortDir(d => d === "asc" ? "desc" : "asc"); }}>
                      Name <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Confidence</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">
                    <button className="flex items-center gap-1" onClick={() => { setSortField("created_at"); setSortDir(d => d === "asc" ? "desc" : "asc"); }}>
                      Created <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelected(c)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                          {c.name?.[0] || "?"}
                        </div>
                        <span className="font-medium text-slate-900">{c.name || "Unnamed"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{c.email || "—"}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(c.overall_confidence || 0) * 100}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{((c.overall_confidence || 0) * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm">No candidates found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
