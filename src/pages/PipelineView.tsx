import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Check, X, Loader2, Clock, ArrowDown } from "lucide-react";

const pipelineStages = [
  { id: "1", label: "Upload Sources", type: "input" },
  { id: "2", label: "Source Detection", type: "process" },
  { id: "3", label: "Resume Parser", type: "process" },
  { id: "4", label: "CSV Parser", type: "process" },
  { id: "5", label: "GitHub Parser", type: "process" },
  { id: "6", label: "LinkedIn Parser", type: "process" },
  { id: "7", label: "Canonical Mapper", type: "process" },
  { id: "8", label: "Normalizer", type: "process" },
  { id: "9", label: "Validator", type: "process" },
  { id: "10", label: "Merge Engine", type: "process" },
  { id: "11", label: "Confidence Engine", type: "process" },
  { id: "12", label: "Provenance Tracker", type: "process" },
  { id: "13", label: "Projection Engine", type: "process" },
  { id: "14", label: "Schema Validator", type: "process" },
  { id: "15", label: "Final Profile", type: "output" },
];

type StageStatus = "pending" | "running" | "completed" | "failed";

interface StageState {
  status: StageStatus;
  duration?: number;
}

export function PipelineView() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [stageStates, setStageStates] = useState<Record<string, StageState>>({});

  const updateStage = useCallback((stageId: string, status: StageStatus, duration?: number) => {
    setStageStates((prev) => ({ ...prev, [stageId]: { status, duration } }));
  }, []);

  const runPipeline = useCallback(async () => {
    setIsRunning(true);
    setCurrentStage(0);
    setStageStates({});

    for (let i = 0; i < pipelineStages.length; i++) {
      const stage = pipelineStages[i];
      setCurrentStage(i);
      updateStage(stage.id, "running");

      const duration = Math.floor(Math.random() * 500) + 200;
      await new Promise((resolve) => setTimeout(resolve, duration));

      const success = Math.random() > 0.1;
      updateStage(stage.id, success ? "completed" : "failed", duration);

      if (!success) {
        setIsRunning(false);
        return;
      }
    }

    setIsRunning(false);
  }, [updateStage]);

  const statusColors: Record<StageStatus, string> = {
    pending: "border-slate-300 bg-white text-slate-500",
    running: "border-blue-400 bg-blue-50 text-blue-700 ring-2 ring-blue-400/30",
    completed: "border-emerald-400 bg-emerald-50 text-emerald-700",
    failed: "border-rose-400 bg-rose-50 text-rose-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pipeline</h1>
          <p className="text-sm text-slate-500 mt-1">
            Visual pipeline execution with stage-by-stage tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={runPipeline}
            disabled={isRunning}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" /> Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" /> Run Pipeline
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setStageStates({});
              setCurrentStage(0);
            }}
            disabled={isRunning}
          >
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200 overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-3 max-h-[700px] overflow-y-auto">
              {pipelineStages.map((stage, index) => {
                const state = stageStates[stage.id];
                const status = state?.status || "pending";
                const duration = state?.duration;
                const isActive = index === currentStage && isRunning;

                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      isActive ? "shadow-lg scale-[1.02]" : ""
                    } ${statusColors[status]}`}>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                        status === "completed" ? "bg-emerald-500 text-white" :
                        status === "failed" ? "bg-rose-500 text-white" :
                        status === "running" ? "bg-blue-500 text-white" :
                        "bg-slate-200 text-slate-500"
                      }`}>
                        {status === "completed" ? <Check className="h-5 w-5" /> :
                         status === "failed" ? <X className="h-5 w-5" /> :
                         status === "running" ? <Loader2 className="h-5 w-5 animate-spin" /> :
                         <span className="text-sm font-bold">{index + 1}</span>}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{stage.label}</p>
                        {duration && (
                          <p className="text-xs flex items-center gap-1 mt-0.5 opacity-70">
                            <Clock className="h-3 w-3" /> {duration}ms
                          </p>
                        )}
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold capitalize`}>
                        {status}
                      </span>
                    </div>
                    {index < pipelineStages.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowDown className="h-4 w-4 text-slate-300" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Stage Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              <AnimatePresence>
                {pipelineStages.map((stage, index) => {
                  const state = stageStates[stage.id];
                  const status = state?.status || "pending";
                  const duration = state?.duration;
                  const isActive = index === currentStage && isRunning;

                  return (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isActive ? "border-blue-400 bg-blue-50 shadow-sm" :
                        status === "completed" ? "border-emerald-200 bg-emerald-50" :
                        status === "failed" ? "border-rose-200 bg-rose-50" :
                        "border-slate-200 bg-white"
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        status === "completed" ? "bg-emerald-500 text-white" :
                        status === "failed" ? "bg-rose-500 text-white" :
                        status === "running" ? "bg-blue-500 text-white" :
                        "bg-slate-200 text-slate-500"
                      }`}>
                        {status === "completed" ? <Check className="h-4 w-4" /> :
                         status === "failed" ? <X className="h-4 w-4" /> :
                         status === "running" ? <Loader2 className="h-4 w-4 animate-spin" /> :
                         index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{stage.label}</p>
                        {duration && <p className="text-xs text-slate-500">Duration: {duration}ms</p>}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        status === "completed" ? "bg-emerald-100 text-emerald-700" :
                        status === "failed" ? "bg-rose-100 text-rose-700" :
                        status === "running" ? "bg-blue-100 text-blue-700" :
                        "bg-slate-100 text-slate-500"
                      }`}>
                        {status}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
