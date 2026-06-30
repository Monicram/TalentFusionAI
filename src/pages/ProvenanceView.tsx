import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScrollText, Clock, ArrowRight, GitCommit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/stores/appStore";
import { api } from "@/lib/api";

export function ProvenanceView() {
  const [candidateId, setCandidateId] = useState("");
  const [candidate, setCandidate] = useState<any>(null);
  const candidates = useAppStore((s) => s.candidates);

  useEffect(() => {
    if (candidateId) {
      api.getCandidate(candidateId).then(setCandidate);
    }
  }, [candidateId]);

  const provenance = candidate?.provenance || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Provenance Tracker</h1>
        <p className="text-sm text-slate-500 mt-1">Full audit trail of every transformation and decision</p>
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

      {candidate && provenance.length > 0 && (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-6">
              {provenance.map((entry: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative flex items-start gap-4"
                >
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 z-10 shrink-0">
                    <GitCommit className="h-5 w-5" />
                  </div>
                  <Card className="flex-1 border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 capitalize">{entry.field}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "—"}</span>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                          {(entry.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Original Value</p>
                          <p className="text-sm text-slate-700 font-mono">
                            {entry.original_value === null || entry.original_value === undefined ? (
                              <span className="italic text-slate-400">null</span>
                            ) : typeof entry.original_value === "object" ? (
                              JSON.stringify(entry.original_value)
                            ) : (
                              String(entry.original_value)
                            )}
                          </p>
                        </div>

                        <div className="flex items-center justify-center">
                          <ArrowRight className="h-5 w-5 text-slate-400" />
                        </div>

                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Normalized Value</p>
                          <p className="text-sm text-emerald-900 font-mono">
                            {entry.normalized_value === null || entry.normalized_value === undefined ? (
                              <span className="italic text-emerald-400">null</span>
                            ) : typeof entry.normalized_value === "object" ? (
                              JSON.stringify(entry.normalized_value)
                            ) : (
                              String(entry.normalized_value)
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Source:</span>
                          <span className="text-xs font-semibold text-slate-700 capitalize">{entry.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Method:</span>
                          <span className="text-xs font-semibold text-slate-700">{entry.transformation_method}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {candidate && provenance.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <ScrollText className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No provenance entries available for this candidate</p>
        </div>
      )}

      {!candidate && (
        <div className="text-center py-16 text-slate-400">
          <ScrollText className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select a candidate to view provenance</p>
        </div>
      )}
    </div>
  );
}
