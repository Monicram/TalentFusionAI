import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, Copy, FileJson, FileSpreadsheet, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/appStore";
import { api } from "@/lib/api";

export function CanonicalProfile() {
  const [candidateId, setCandidateId] = useState("");
  const [candidate, setCandidate] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const candidates = useAppStore((s) => s.candidates);

  useEffect(() => {
    if (candidateId) {
      api.getCandidate(candidateId).then(setCandidate);
    }
  }, [candidateId]);

  const profile = candidate?.canonical_profile || {};
  const confidence = candidate?.confidence || {};

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(profile, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `candidate-${candidate?.id?.slice(0, 8)}-profile.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const fields = [
      ["Field", "Value"],
      ["Name", profile.personal?.name || ""],
      ["Email", profile.personal?.email || ""],
      ["Phone", profile.personal?.phone || ""],
      ["LinkedIn", profile.contact?.linkedin_url || ""],
      ["GitHub", profile.contact?.github_url || ""],
      ["Skills", (profile.skills || []).join(", ")],
      ["Experience Count", (profile.experience || []).length.toString()],
      ["Education Count", (profile.education || []).length.toString()],
      ["Certifications", (profile.certifications || []).join(", ")],
      ["Overall Confidence", ((candidate?.overall_confidence || 0) * 100).toFixed(0) + "%"],
    ];
    const csv = fields.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `candidate-${candidate?.id?.slice(0, 8)}-profile.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Canonical Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Final merged and validated candidate profile</p>
      </div>

      <div className="flex items-center gap-3">
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
        {candidate && (
          <>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy JSON"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadJson} className="gap-2">
              <FileJson className="h-4 w-4" /> Download JSON
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadCsv} className="gap-2">
              <FileSpreadsheet className="h-4 w-4" /> Download CSV
            </Button>
          </>
        )}
      </div>

      {candidate && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Personal Information</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-sm text-slate-500">Name</span><span className="text-sm font-medium text-slate-900">{profile.personal?.name || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-sm text-slate-500">Email</span><span className="text-sm font-medium text-slate-900">{profile.personal?.email || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-sm text-slate-500">Phone</span><span className="text-sm font-medium text-slate-900">{profile.personal?.phone || "—"}</span></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Contact Links</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-sm text-slate-500">LinkedIn</span><span className="text-sm font-medium text-slate-900">{profile.contact?.linkedin_url ? "Available" : "—"}</span></div>
                    <div className="flex justify-between"><span className="text-sm text-slate-500">GitHub</span><span className="text-sm font-medium text-slate-900">{profile.contact?.github_url ? "Available" : "—"}</span></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Confidence</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-sm text-slate-500">Overall</span><span className="text-sm font-bold text-emerald-600">{((candidate.overall_confidence || 0) * 100).toFixed(0)}%</span></div>
                    <div className="flex justify-between"><span className="text-sm text-slate-500">Fields Scored</span><span className="text-sm font-medium text-slate-900">{Object.keys(confidence).length}</span></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(profile.skills || []).map((skill: string, i: number) => (
                    <span key={i} className="text-sm px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {skill}
                    </span>
                  ))}
                  {!(profile.skills || []).length && <span className="text-sm text-slate-400 italic">No skills extracted</span>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(profile.certifications || []).map((cert: string, i: number) => (
                    <span key={i} className="text-sm px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full font-medium">
                      {cert}
                    </span>
                  ))}
                  {!(profile.certifications || []).length && <span className="text-sm text-slate-400 italic">No certifications extracted</span>}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(profile.experience || []).map((exp: any, i: number) => (
                  <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">{exp.title || "Untitled"}</span>
                      <span className="text-xs text-slate-500">{exp.company || ""}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{exp.duration || ""}</p>
                  </div>
                ))}
                {!(profile.experience || []).length && <span className="text-sm text-slate-400 italic">No experience entries</span>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(profile.education || []).map((edu: any, i: number) => (
                  <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">{edu.degree || "Untitled"}</span>
                      <span className="text-xs text-slate-500">{edu.institution || ""}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{edu.year || ""}</p>
                  </div>
                ))}
                {!(profile.education || []).length && <span className="text-sm text-slate-400 italic">No education entries</span>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!candidate && (
        <div className="text-center py-16 text-slate-400">
          <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select a candidate to view canonical profile</p>
        </div>
      )}
    </div>
  );
}
