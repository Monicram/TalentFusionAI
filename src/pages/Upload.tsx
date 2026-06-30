import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, Play, Check, Loader2, FilePlus, FileCheck, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAppStore } from "@/stores/appStore";

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: string;
  type: string;
  status: "idle" | "uploading" | "done" | "error";
}

export function Upload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidate, setCandidate] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const setCandidates = useAppStore((s) => s.setCandidates);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    const newFiles: FileItem[] = Array.from(selected).map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      name: file.name,
      size: formatSize(file.size),
      type: file.name.split(".").pop()?.toLowerCase() || "",
      status: "idle",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      let candidateId = "";

      // Upload PDF/DOC files
      for (const fileItem of files) {
        const ext = fileItem.type;
        if (ext === "pdf" || ext === "doc" || ext === "docx") {
          const res = await api.uploadResume(fileItem.file);
          candidateId = res.candidate_id;
        } else if (ext === "csv") {
          const res = await api.uploadCsv(fileItem.file);
          candidateId = res.candidate_id;
        } else if (ext === "json") {
          const text = await fileItem.file.text();
          const parsed = JSON.parse(text);
          const res = await api.uploadJson(parsed);
          candidateId = res.candidate_id;
        }
      }

      // URLs and notes
      if (githubUrl || linkedinUrl || notes) {
        const rawSources: any = {};
        if (githubUrl) rawSources.github_url = githubUrl;
        if (linkedinUrl) rawSources.linkedin_url = linkedinUrl;
        if (notes) rawSources.notes = notes;
        if (Object.keys(rawSources).length > 0) {
          if (candidateId) {
             // Append to existing candidate
             await api.updateCandidate(candidateId, { raw_sources: rawSources });
          } else {
             // Create new candidate if no file was uploaded
             const res = await api.createCandidate({ raw_sources: rawSources });
             candidateId = res.id;
          }
        }
      }

      if (candidateId) {
        await api.runPipeline(candidateId);
        const c = await api.getCandidate(candidateId);
        setCandidate(c);
        const all = await api.getCandidates();
        setCandidates(all);
      }
    } catch (e: any) {
      setError(e.message || "Failed to process candidate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#0f172a]">Upload Candidates</h1>
        <p className="text-[13px] text-[#64748b] mt-0.5">Upload resumes, profiles, or notes to process</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Upload */}
        <div className="space-y-4">
          {/* File Drop Zone */}
          <Card className="border-[#e2e8f0] shadow-none">
            <CardContent className="p-5">
              <div
                className="border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] hover:border-[#2563eb] transition-all cursor-pointer p-8 text-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-[#2563eb] flex items-center justify-center">
                    <FilePlus className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-[13px] font-medium text-[#334155]">Drag & drop files here</p>
                  <p className="text-[11px] text-[#94a3b8]">
                    Supports PDF, DOC, DOCX, CSV, JSON
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.csv,.json"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* File List */}
              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-2"
                  >
                    {files.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3 p-3 rounded-lg border border-[#e2e8f0] bg-white"
                      >
                        <div className="h-8 w-8 rounded bg-[#f1f5f9] flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-[#2563eb]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-[#334155] truncate">{file.name}</p>
                          <p className="text-[11px] text-[#94a3b8]">{file.size}</p>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 rounded hover:bg-[#f1f5f9] text-[#94a3b8] transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* External Links */}
          <Card className="border-[#e2e8f0] shadow-none">
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="text-[13px] font-medium text-[#334155] mb-1.5 block">GitHub Profile</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[13px] text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-[#334155] mb-1.5 block">LinkedIn Profile</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[13px] text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-[#334155] mb-1.5 block">Recruiter Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about the candidate..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[13px] text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSubmit}
            disabled={loading || files.length === 0}
            className="w-full h-10 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-[13px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" /> Run Pipeline
              </>
            )}
          </Button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#ef4444] text-[13px] flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </motion.div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div>
          <Card className="border-[#e2e8f0] shadow-none h-full">
            <CardContent className="p-5">
              <h3 className="text-[13px] font-semibold text-[#334155] mb-4">Candidate Summary</h3>
              <AnimatePresence mode="wait">
                {candidate ? (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#2563eb] flex items-center justify-center text-white font-bold text-sm">
                        {candidate.name?.[0] || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0f172a] text-[13px]">{candidate.name || "Unnamed"}</p>
                        <p className="text-[11px] text-[#64748b]">{candidate.email || "No email"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                        <p className="text-[11px] text-[#64748b] mb-0.5">Phone</p>
                        <p className="text-[13px] font-medium text-[#334155]">{candidate.phone || "—"}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                        <p className="text-[11px] text-[#64748b] mb-0.5">Confidence</p>
                        <p className="text-[13px] font-medium text-[#2563eb]">{(candidate.overall_confidence * 100).toFixed(0)}%</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                      <p className="text-[11px] text-[#64748b] mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(candidate.canonical_profile?.skills || []).map((skill: string, i: number) => (
                          <span key={i} className="text-[11px] px-2 py-1 bg-[#eff6ff] text-[#2563eb] rounded-full font-medium">
                            {skill}
                          </span>
                        ))}
                        {!(candidate.canonical_profile?.skills || []).length && (
                          <span className="text-[11px] text-[#94a3b8]">No skills extracted</span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                      <p className="text-[11px] text-[#64748b] mb-1">Experience</p>
                      <p className="text-[13px] text-[#334155]">{(candidate.canonical_profile?.experience || []).length} entries</p>
                    </div>

                    <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                      <p className="text-[11px] text-[#64748b] mb-1">Education</p>
                      <p className="text-[13px] text-[#334155]">{(candidate.canonical_profile?.education || []).length} entries</p>
                    </div>

                    <div className="flex items-center gap-2 text-[13px] text-[#2563eb]">
                      <Check className="h-4 w-4" />
                      <span className="font-medium">Pipeline completed successfully</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 text-[#94a3b8]"
                  >
                    <FileCheck className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="text-[13px]">Upload candidate files and run the pipeline to see the summary</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
