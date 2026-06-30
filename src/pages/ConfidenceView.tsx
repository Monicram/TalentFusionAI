import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Gauge, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/stores/appStore";
import { api } from "@/lib/api";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#64748b"];

export function ConfidenceView() {
  const [candidateId, setCandidateId] = useState("");
  const [candidate, setCandidate] = useState<any>(null);
  const candidates = useAppStore((s) => s.candidates);

  useEffect(() => {
    if (candidateId) {
      api.getCandidate(candidateId).then(setCandidate);
    }
  }, [candidateId]);

  const confidenceScores = candidate?.confidence || {};
  const overall = candidate?.overall_confidence || 0;

  const fieldData = Object.entries(confidenceScores).map(([field, score]: [string, any]) => ({
    field,
    score: (score.score || 0) * 100,
    source_reliability: (score.source_reliability || 0) * 100,
    validation_success: (score.validation_success || 0) * 100,
    agreement: (score.agreement || 0) * 100,
    normalization_success: (score.normalization_success || 0) * 100,
    merge_quality: (score.merge_quality || 0) * 100,
  }));

  const pieData = [
    { name: "Source Reliability", value: 25 },
    { name: "Validation", value: 20 },
    { name: "Agreement", value: 20 },
    { name: "Normalization", value: 15 },
    { name: "Merge Quality", value: 20 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Confidence Scores</h1>
        <p className="text-sm text-slate-500 mt-1">Field-level confidence breakdown and overall scoring</p>
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-emerald-600" />
                  Overall Confidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <div className="relative h-40 w-40">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${overall * 283} 283`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-900">{(overall * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-slate-500">Based on {Object.keys(confidenceScores).length} fields</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 lg:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Confidence Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {pieData.map((entry, i) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-sm text-slate-600">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Field-Level Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fieldData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="field" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} name="Overall Score" />
                    <Bar dataKey="source_reliability" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Source Reliability" />
                    <Bar dataKey="validation_success" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Validation" />
                    <Bar dataKey="agreement" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Agreement" />
                    <Bar dataKey="merge_quality" fill="#64748b" radius={[4, 4, 0, 0]} name="Merge Quality" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fieldData.map((field, i) => (
              <motion.div
                key={field.field}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-slate-900 capitalize">{field.field}</span>
                      <span className="text-sm font-bold text-emerald-600">{field.score.toFixed(0)}%</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: "Source Reliability", value: field.source_reliability, color: "bg-blue-500" },
                        { label: "Validation", value: field.validation_success, color: "bg-amber-500" },
                        { label: "Agreement", value: field.agreement, color: "bg-violet-500" },
                        { label: "Merge Quality", value: field.merge_quality, color: "bg-slate-500" },
                      ].map((item) => (
                        <div key={item.label} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">{item.label}</span>
                            <span className="text-slate-700 font-medium">{item.value.toFixed(0)}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {!candidate && (
        <div className="text-center py-16 text-slate-400">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select a candidate to view confidence scores</p>
        </div>
      )}
    </div>
  );
}
