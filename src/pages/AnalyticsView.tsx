import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Clock, GitBranch, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/stores/appStore";
import { api } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#64748b"];

export function AnalyticsView() {
  const [analytics, setAnalytics] = useState<any>(null);
  const setStoreAnalytics = useAppStore((s) => s.setAnalytics);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getAnalytics();
        setAnalytics(data);
        setStoreAnalytics(data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [setStoreAnalytics]);

  const candidateData = [
    { name: "Mon", count: 12 },
    { name: "Tue", count: 19 },
    { name: "Wed", count: 15 },
    { name: "Thu", count: 22 },
    { name: "Fri", count: 18 },
    { name: "Sat", count: 8 },
    { name: "Sun", count: 5 },
  ];

  const confidenceDist = [
    { name: "90-100%", value: 25 },
    { name: "80-89%", value: 35 },
    { name: "70-79%", value: 20 },
    { name: "60-69%", value: 12 },
    { name: "50-59%", value: 8 },
  ];

  const sourceUsage = [
    { name: "Resume", value: 45 },
    { name: "CSV", value: 30 },
    { name: "JSON", value: 15 },
    { name: "GitHub", value: 8 },
    { name: "LinkedIn", value: 7 },
    { name: "Notes", value: 5 },
  ];

  const pipelinePerf = [
    { name: "Source Detection", time: 120 },
    { name: "Parsing", time: 450 },
    { name: "Mapping", time: 180 },
    { name: "Normalization", time: 200 },
    { name: "Validation", time: 150 },
    { name: "Merge", time: 220 },
    { name: "Confidence", time: 180 },
    { name: "Projection", time: 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Performance metrics and processing insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Candidates</p>
                  <p className="text-2xl font-bold text-slate-900">{analytics?.total_candidates || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Success Rate</p>
                  <p className="text-2xl font-bold text-slate-900">{analytics?.pipeline_success_rate || 0}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Avg Confidence</p>
                  <p className="text-2xl font-bold text-slate-900">{((analytics?.average_confidence || 0) * 100).toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Avg Process Time</p>
                  <p className="text-2xl font-bold text-slate-900">{analytics?.average_processing_time || 0}s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Candidate Processing (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={candidateData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-emerald-600" />
              Pipeline Stage Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelinePerf} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="time" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              Confidence Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={confidenceDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                    {confidenceDist.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {confidenceDist.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-sm text-slate-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-600" />
              Source Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourceUsage} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label>
                    {sourceUsage.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {sourceUsage.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-sm text-slate-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
