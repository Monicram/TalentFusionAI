import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, ToggleLeft, ToggleRight, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Settings() {
  const [showConfidence, setShowConfidence] = useState(true);
  const [showProvenance, setShowProvenance] = useState(true);
  const [missingValueBehavior, setMissingValueBehavior] = useState("null");
  const [outputFields, setOutputFields] = useState([
    { name: "name", enabled: true },
    { name: "email", enabled: true },
    { name: "phone", enabled: true },
    { name: "skills", enabled: true },
    { name: "experience", enabled: true },
    { name: "education", enabled: true },
    { name: "certifications", enabled: true },
  ]);

  const toggleField = (index: number) => {
    setOutputFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, enabled: !f.enabled } : f))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure pipeline behavior and output preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-slate-600" />
                Pipeline Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Enable Confidence Scoring</p>
                  <p className="text-sm text-slate-500">Calculate confidence scores for each field</p>
                </div>
                <button
                  onClick={() => setShowConfidence(!showConfidence)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfidence ? (
                    <ToggleRight className="h-8 w-8 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="h-8 w-8 text-slate-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Enable Provenance Tracking</p>
                  <p className="text-sm text-slate-500">Track all transformations and decisions</p>
                </div>
                <button
                  onClick={() => setShowProvenance(!showProvenance)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showProvenance ? (
                    <ToggleRight className="h-8 w-8 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="h-8 w-8 text-slate-400" />
                  )}
                </button>
              </div>

              <div>
                <p className="font-medium text-slate-900 mb-2">Missing Value Behavior</p>
                <div className="flex gap-2">
                  {["null", "empty", "skip"].map((option) => (
                    <button
                      key={option}
                      onClick={() => setMissingValueBehavior(option)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        missingValueBehavior === option
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {option === "null" ? "Set to null" : option === "empty" ? "Empty string" : "Skip field"}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-slate-600" />
                Output Fields
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {outputFields.map((field, index) => (
                  <div
                    key={field.name}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-900 capitalize">{field.name}</span>
                    </div>
                    <button
                      onClick={() => toggleField(index)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {field.enabled ? (
                        <ToggleRight className="h-6 w-6 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-slate-400" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Save className="h-4 w-4" /> Save Settings
        </Button>
      </div>
    </div>
  );
}
