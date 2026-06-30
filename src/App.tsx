import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Upload } from "./pages/Upload";
import { Candidates } from "./pages/Candidates";
import { PipelineView } from "./pages/PipelineView";
import { SourceComparison } from "./pages/SourceComparison";
import { MergeDecisions } from "./pages/MergeDecisions";
import { CanonicalProfile } from "./pages/CanonicalProfile";
import { ConfidenceView } from "./pages/ConfidenceView";
import { ProvenanceView } from "./pages/ProvenanceView";
import { PipelineLogs } from "./pages/PipelineLogs";
import { AnalyticsView } from "./pages/AnalyticsView";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="pipeline" element={<PipelineView />} />
          <Route path="comparison" element={<SourceComparison />} />
          <Route path="merge" element={<MergeDecisions />} />
          <Route path="canonical" element={<CanonicalProfile />} />
          <Route path="confidence" element={<ConfidenceView />} />
          <Route path="provenance" element={<ProvenanceView />} />
          <Route path="logs" element={<PipelineLogs />} />
          <Route path="analytics" element={<AnalyticsView />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
