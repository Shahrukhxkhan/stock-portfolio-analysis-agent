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
      className={`p-3.5 border rounded-2xl transition-all duration-300 hover:scale-[1.01] group bg-[#FFFFFF] shadow-xs ${
        isBull
          ? "border-l-4 border-l-[#1E8E5A] border-[#E2E6EF] hover:border-[#1E8E5A]/50"
          : "border-l-4 border-l-[#D64545] border-[#E2E6EF] hover:border-[#D64545]/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base shadow-xs border ${
            isBull
              ? "bg-[#E8F5EE] border-[#1E8E5A]/30 text-[#1E8E5A]"
              : "bg-[#FCEBEB] border-[#D64545]/30 text-[#D64545]"
          }`}
        >
          {insight.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-[#101828] font-['Roobert'] mb-1 tracking-wide">{insight.title}</h3>
          <p className="text-xs text-[#6B7A99] font-['Plus_Jakarta_Sans'] leading-relaxed">{insight.description}</p>
        </div>
      </div>
    </div>
  )
}
