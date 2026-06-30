import { create } from "zustand";

interface Candidate {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  overall_confidence: number;
  created_at: string;
  canonical_profile?: any;
  confidence?: any;
  provenance?: any[];
  merge_decisions?: any[];
  raw_sources?: any;
}

interface PipelineRun {
  id: string;
  candidate_id: string;
  status: string;
  stages: any[];
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
}

interface AppState {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  pipelineRuns: PipelineRun[];
  logs: any[];
  analytics: any;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  setCandidates: (c: Candidate[]) => void;
  setSelectedCandidate: (c: Candidate | null) => void;
  setPipelineRuns: (r: PipelineRun[]) => void;
  setLogs: (l: any[]) => void;
  setAnalytics: (a: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  candidates: [],
  selectedCandidate: null,
  pipelineRuns: [],
  logs: [],
  analytics: null,
  sidebarOpen: true,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  setCandidates: (c) => set({ candidates: c }),
  setSelectedCandidate: (c) => set({ selectedCandidate: c }),
  setPipelineRuns: (r) => set({ pipelineRuns: r }),
  setLogs: (l) => set({ logs: l }),
  setAnalytics: (a) => set({ analytics: a }),
}));
