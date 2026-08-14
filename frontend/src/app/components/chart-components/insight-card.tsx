interface Insight {
  title: string
  description: string
  emoji: string
}

interface InsightCardComponentProps {
  insight: Insight
  type: "bull" | "bear"
}

export function InsightCardComponent({ insight, type }: InsightCardComponentProps) {
  const isBull = type === "bull"
  return (
    <div
      className={`glass-panel p-3.5 border transition-all duration-300 hover:scale-[1.01] group ${
        isBull
          ? "border-l-4 border-l-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_4px_20px_rgba(16,185,129,0.1)] hover:border-emerald-500/40"
          : "border-l-4 border-l-rose-500 bg-rose-500/10 border-rose-500/20 shadow-[0_4px_20px_rgba(244,63,94,0.1)] hover:border-rose-500/40"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base shadow-sm border ${
            isBull
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]"
              : "bg-rose-500/15 border-rose-500/30 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
          }`}
        >
          {insight.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-[#f5f5f7] font-['Roobert'] mb-1 tracking-wide">{insight.title}</h3>
          <p className="text-xs text-[#a1a1aa] font-['Plus_Jakarta_Sans'] leading-relaxed">{insight.description}</p>
        </div>
      </div>
    </div>
  )
}

