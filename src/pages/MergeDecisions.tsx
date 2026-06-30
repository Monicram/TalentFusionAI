import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitMerge, Trophy, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/stores/appStore";
import { api } from "@/lib/api";

export function MergeDecisions() {
  const [candidateId, setCandidateId] = useState("");
  const [candidate, setCandidate] = useState<any>(null);
  const candidates = useAppStore((s) => s.candidates);

  useEffect(() => {
    if (candidateId) {
      api.getCandidate(candidateId).then(setCandidate);
    }
  }, [candidateId]);

  const decisions = candidate?.merge_decisions || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Merge Decisions</h1>
        <p className="text-sm text-slate-500 mt-1">Understand why each value was selected over alternatives</p>
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

      {candidate && decisions.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {decisions.map((decision: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                      {decision.field?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">{decision.field}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${decision.validation_result === "valid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {decision.validation_result}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Values from Sources</p>
                          <div className="space-y-1">
                            {Object.entries(decision.values || {}).map(([source, value]: [string, any]) => (
                              <div key={source} className={`flex items-center justify-between p-2 rounded-lg text-sm ${source === decision.priority ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50 border border-slate-100"}`}>
                                <span className="font-medium capitalize text-slate-700">{source}</span>
                                <span className="text-slate-600">
                                  {value === null || value === undefined || value === "" ? (
                                    <span className="italic text-slate-400">null</span>
                                  ) : typeof value === "object" ? (
                                    <span className="font-mono text-xs">{JSON.stringify(value).slice(0, 30)}</span>
                                  ) : (
                                    String(value)
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Trophy className="h-4 w-4 text-emerald-600" />
                              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Winning Value</p>
                            </div>
                            <p className="text-sm font-medium text-emerald-900">
                              {decision.winning_value === null || decision.winning_value === undefined ? (
                                <span className="italic text-emerald-400">null</span>
                              ) : typeof decision.winning_value === "object" ? (
                                <span className="font-mono text-xs">{JSON.stringify(decision.winning_value)}</span>
                              ) : (
                                String(decision.winning_value)
                              )}
                            </p>
                          </div>

                          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Reason</p>
                            <p className="text-sm text-slate-700">{decision.reason}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                              <p className="text-xs text-slate-500 mb-1">Confidence</p>
                              <p className="text-sm font-semibold text-slate-900">{(decision.confidence * 100).toFixed(0)}%</p>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                              <p className="text-xs text-slate-500 mb-1">Priority Used</p>
                              <p className="text-sm font-semibold text-slate-900 capitalize">{decision.priority}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {candidate && decisions.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No merge decisions available for this candidate</p>
        </div>
      )}

      {!candidate && (
        <div className="text-center py-16 text-slate-400">
          <GitMerge className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select a candidate to view merge decisions</p>
        </div>
      )}
    </div>
  );
}
