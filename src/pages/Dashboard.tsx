import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, GitBranch, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { api } from "@/lib/api";
import { useAppStore } from "@/stores/appStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Card className="glass hover-lift border-white/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            <div className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span>{Math.abs(change)}%</span>
              <span className="text-slate-400 font-normal">vs last week</span>
            </div>
          </div>
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export function Dashboard() {
  const [_loading, setLoading] = useState(true);
  const analytics = useAppStore((s) => s.analytics);
  const setAnalytics = useAppStore((s) => s.setAnalytics);
  const setCandidates = useAppStore((s) => s.setCandidates);

  useEffect(() => {
    async function load() {
      try {
        const [analyticsData, candidatesData] = await Promise.all([api.getAnalytics(), api.getCandidates()]);
        setAnalytics(analyticsData);
        setCandidates(candidatesData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [setAnalytics, setCandidates]);

  const stats = [
    { title: "Total Candidates", value: analytics?.total_candidates || 0, change: 12, icon: Users, color: "bg-blue-600" },
    { title: "Pipeline Success", value: `${analytics?.pipeline_success_rate || 0}%`, change: 5, icon: GitBranch, color: "bg-emerald-600" },
    { title: "Avg Confidence", value: analytics?.average_confidence || 0, change: 3, icon: TrendingUp, color: "bg-amber-500" },
    { title: "Avg Process Time", value: `${analytics?.average_processing_time || 0}s`, change: -8, icon: Clock, color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of candidate processing and pipeline performance</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Activity className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-white/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Recent Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(analytics?.recent_candidates || []).length === 0 && (
                <p className="text-sm text-slate-500 text-center py-8">No recent candidates</p>
              )}
              {(analytics?.recent_candidates || []).map((c: any, i: number) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {c.name?.[0] || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{c.name || "Unnamed"}</p>
                      <p className="text-xs text-slate-500">{c.email || "No email"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {c.status}
                    </span>
                    <span className="text-xs text-slate-500">{(c.overall_confidence * 100).toFixed(0)}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Recent Pipeline Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(analytics?.recent_pipeline_runs || []).length === 0 && (
                <p className="text-sm text-slate-500 text-center py-8">No recent pipeline runs</p>
              )}
              {(analytics?.recent_pipeline_runs || []).map((run: any, i: number) => (
                <motion.div
                  key={run.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">Pipeline Run</p>
                    <p className="text-xs text-slate-500">Candidate: {run.candidate_id?.slice(0, 8)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${run.status === "completed" ? "bg-emerald-100 text-emerald-700" : run.status === "failed" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                      {run.status}
                    </span>
                    <span className="text-xs text-slate-500">{run.duration_seconds ? `${run.duration_seconds.toFixed(1)}s` : "—"}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
