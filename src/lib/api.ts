const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

async function fetchJson(path: string, opts?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, opts);
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  return res.json();
}

export const api = {
  getCandidates: () => fetchJson("/candidates/"),
  getCandidate: (id: string) => fetchJson(`/candidates/${id}`),
  createCandidate: (data: any) =>
    fetchJson("/candidates/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
  updateCandidate: (id: string, data: any) =>
    fetchJson(`/candidates/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
  runPipeline: (id: string) => fetchJson(`/candidates/${id}/pipeline`, { method: "POST" }),
  getLogs: (id: string) => fetchJson(`/candidates/${id}/logs`),
  getAnalytics: () => fetchJson("/analytics/summary"),
  uploadResume: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetchJson("/candidates/upload/resume", { method: "POST", body: fd });
  },
  uploadCsv: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetchJson("/candidates/upload/csv", { method: "POST", body: fd });
  },
  uploadJson: (data: any) =>
    fetchJson("/candidates/upload/json", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
  healthCheck: () => fetchJson("/health"),
};
