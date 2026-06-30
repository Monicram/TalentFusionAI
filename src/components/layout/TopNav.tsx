import { Search, Bell, Settings } from "lucide-react";
import { useAppStore } from "@/stores/appStore";

export function TopNav() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  return (
    <header
      className={`h-14 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 sticky top-0 z-40 transition-all duration-300 ${
        sidebarOpen ? "ml-60" : "ml-16"
      }`}
    >
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search candidates, profiles..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[13px] text-[#334155] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-[#f1f5f9] transition-colors text-[#64748b]">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#ef4444] rounded-full border border-white" />
        </button>
        <button className="p-2 rounded-lg hover:bg-[#f1f5f9] transition-colors text-[#64748b]">
          <Settings className="h-4 w-4" />
        </button>
        <div className="h-7 w-7 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-[10px] font-bold">
          R
        </div>
      </div>
    </header>
  );
}
