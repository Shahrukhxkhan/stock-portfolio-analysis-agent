"use client"

import { Check } from "lucide-react"
import React, { useEffect } from "react"

interface ToolLog {
  id: string | number
  message: string
  status: "processing" | "completed"
}

interface ToolLogsProps {
  logs: ToolLog[]
}

export function ToolLogs({ logs }: ToolLogsProps) {
    useEffect(() => {
        console.log(logs, "logs")
    }, [])
  return (
    <div className="flex flex-col gap-2 p-2">
      {logs.map((log) => (
        <div
          key={log.id}
          className={`flex items-center gap-3 rounded-xl px-3 py-2 border text-sm font-medium font-['Roobert'] shadow-sm transition-colors backdrop-blur-md
            ${
              log.status === "processing"
                ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
            }
          `}
        >
          {log.status === "processing" ? (
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-400"></span>
            </span>
          ) : (
            <Check size={18} className="text-emerald-400" />
          )}
          <span className="text-xs font-semibold font-['Plus_Jakarta_Sans']">{log.message}</span>
        </div>
      ))}
    </div>
  )
}

// Example usage (remove in production):
// const sampleLogs = [
//   { id: 1, message: "Fetching stock data...", status: "processing" },
//   { id: 2, message: "Analysis complete!", status: "completed" },
// ]
// <ToolLogs logs={sampleLogs} />
