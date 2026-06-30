import { NavLink, useLocation } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import {
  LayoutDashboard,
  Upload,
  Users,
  GitBranch,
  GitCompare,
  GitMerge,
  UserCheck,
  TrendingUp,
  ClipboardList,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
  Briefcase,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/upload", icon: Upload, label: "Upload" },
  { to: "/candidates", icon: Users, label: "Candidates" },
  { to: "/pipeline", icon: GitBranch, label: "Pipeline" },
  { to: "/comparison", icon: GitCompare, label: "Comparison" },
  { to: "/merge", icon: GitMerge, label: "Merge" },
  { to: "/canonical", icon: UserCheck, label: "Profile" },
  { to: "/confidence", icon: TrendingUp, label: "Confidence" },
  { to: "/provenance", icon: FileText, label: "Provenance" },
  { to: "/logs", icon: ClipboardList, label: "Logs" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#0f172a] text-white z-50 transition-all duration-300 flex flex-col border-r border-[#1e293b] ${
        sidebarOpen ? "w-60" : "w-16"
      }`}
    >
      <div className="flex items-center h-14 px-4 border-b border-[#1e293b]">
        {sidebarOpen && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex items-center justify-center h-7 w-7 rounded bg-[#2563eb]">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-[#e2e8f0] whitespace-nowrap">TalentFusion</span>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="ml-auto p-1 rounded hover:bg-[#1e293b] transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4 text-[#94a3b8]" /> : <ChevronRight className="h-4 w-4 text-[#94a3b8]" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-md transition-all duration-150 text-[13px] font-medium ${
                isActive
                  ? "bg-[#2563eb] text-white"
                  : "text-[#94a3b8] hover:bg-[#1e293b] hover:text-[#e2e8f0]"
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#1e293b]">
        {sidebarOpen && (
          <div className="flex items-center gap-2 px-2">
            <div className="h-6 w-6 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-[10px] font-bold">
              R
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-medium text-[#e2e8f0] truncate">Recruiter</p>
              <p className="text-[10px] text-[#64748b] truncate">Admin</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
