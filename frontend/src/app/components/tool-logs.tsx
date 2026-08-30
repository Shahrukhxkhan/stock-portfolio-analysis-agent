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
  }, [logs])

  return (
    <div className="flex flex-col gap-2 p-2">
      {logs.map((log) => (
        <div
          key={log.id}
          className={`flex items-center gap-3 rounded-xl px-3 py-2 border text-sm font-medium font-['Roobert'] shadow-xs transition-colors ${
            log.status === "processing"
              ? "bg-[#F4D03F]/20 border-[#F4D03F] text-[#101828]"
              : "bg-[#E8F5EE] border-[#1E8E5A]/30 text-[#1E8E5A]"
          }`}
        >
          {log.status === "processing" ? (
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4D03F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#F4D03F]"></span>
            </span>
          ) : (
            <Check size={18} className="text-[#1E8E5A]" />
          )}
          <span className="text-xs font-semibold font-['Plus_Jakarta_Sans']">{log.message}</span>
        </div>
      ))}
    </div>
  )
}
