import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitCompare, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/stores/appStore";
import { api } from "@/lib/api";

export function SourceComparison() {
  const [candidateId, setCandidateId] = useState("");
  const [candidate, setCandidate] = useState<any>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);

  const candidates = useAppStore((s) => s.candidates);

  useEffect(() => {
    if (candidateId) {
      api.getCandidate(candidateId).then((c) => {
        setCandidate(c);
        const raw = c.raw_sources || {};
        const srcs = Object.keys(raw);
        setSources(srcs);
        const allFields = new Set<string>();
        srcs.forEach((s) => {
          const data = raw[s];
          if (data && typeof data === "object") {
            Object.keys(data).forEach((k) => allFields.add(k));
          }
        });
        setFields(Array.from(allFields));
      });
    }
  }, [candidateId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Source Comparison</h1>
        <p className="text-sm text-slate-500 mt-1">Compare values across all sources for each field</p>
      </div>

      <div className="flex gap-2">
        <select
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value="">Select candidate</option>
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>{c.name || "Unnamed"} ({c.id.slice(0, 8)})</option>
          ))}
        </select>
      </div>

      {candidate && (
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-blue-600" />
              Field Comparison: {candidate.name || "Unnamed"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Field</th>
                    {sources.map((s) => (
                      <th key={s} className="text-left py-3 px-4 font-semibold text-slate-700 capitalize">{s}</th>
                    ))}
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, i) => {
                    const values = sources.map((s) => {
                      const raw = candidate.raw_sources?.[s];
                      if (raw && typeof raw === "object" && !Array.isArray(raw)) {
                        return raw[field];
                      }
                      return null;
                    });
                    const nonNull = values.filter((v) => v !== null && v !== undefined && v !== "");
                    const allSame = nonNull.length > 1 && nonNull.every((v) => JSON.stringify(v) === JSON.stringify(nonNull[0]));
                    const hasConflict = nonNull.length > 1 && !allSame;
                    const hasMissing = nonNull.length < sources.length;

                    return (
                      <motion.tr
                        key={field}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-slate-900">{field}</td>
                        {values.map((v, idx) => (
                          <td key={idx} className="py-3 px-4 text-slate-600">
                            {v === null || v === undefined || v === "" ? (
                              <span className="text-slate-300 italic">—</span>
                            ) : typeof v === "object" ? (
                              <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{JSON.stringify(v).slice(0, 40)}</span>
                            ) : (
                              <span>{String(v)}</span>
                            )}
                          </td>
                        ))}
                        <td className="py-3 px-4">
                          {hasConflict ? (
                            <span className="flex items-center gap-1 text-xs text-rose-600 font-medium">
                              <AlertCircle className="h-3 w-3" /> Conflict
                            </span>
                          ) : hasMissing ? (
                            <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                              <AlertCircle className="h-3 w-3" /> Missing
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                              <CheckCircle2 className="h-3 w-3" /> Match
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {!candidate && (
        <div className="text-center py-16 text-slate-400">
          <GitCompare className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select a candidate to compare sources</p>
        </div>
      )}
    </div>
  );
}
