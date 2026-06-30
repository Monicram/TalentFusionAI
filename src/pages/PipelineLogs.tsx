import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Check, X, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/stores/appStore";
import { api } from "@/lib/api";

export function PipelineLogs() {
  const [candidateId, setCandidateId] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const candidates = useAppStore((s) => s.candidates);

  useEffect(() => {
    if (candidateId) {
      api.getLogs(candidateId).then((data) => setLogs(data));
    } else {
      api.getLogs("").then((data) => setLogs(data));
    }
  }, [candidateId]);

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "success":
        return <Check className="h-4 w-4 text-emerald-600" />;
      case "failed":
      case "error":
        return <X className="h-4 w-4 text-rose-600" />;
      case "running":
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pipeline Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Structured execution logs from all pipeline stages</p>
      </div>

      <div className="flex gap-2">
        <select
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value="">All candidates</option>
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>{c.name || "Unnamed"} ({c.id.slice(0, 8)})</option>
          ))}
        </select>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-slate-600" />
            Execution Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {logs.map((log, i) => (
              <motion.div
                key={log.id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="shrink-0">{statusIcon(log.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900">{log.agent}</span>
                    <span className="text-xs text-slate-500">{log.action}</span>
                    <span className="text-xs text-slate-400">{log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}</span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{log.message}</p>
                </div>
                <div className="shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    log.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                    log.status === "failed" ? "bg-rose-100 text-rose-700" :
                    log.status === "running" ? "bg-blue-100 text-blue-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {log.status}
                  </span>
                </div>
              </motion.div>
            ))}
            {logs.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No logs available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
