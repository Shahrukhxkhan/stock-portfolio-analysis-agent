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
  const getTypeStyles = () => {
    switch (type) {
      case "bull":
        return "border-l-4 border-l-emerald-400 bg-emerald-500/10"
      case "bear":
        return "border-l-4 border-l-rose-500 bg-rose-500/10"
      default:
        return "border-l-4 border-l-white/20"
    }
  }

  return (
    <div className={`glass-panel p-3.5 ${getTypeStyles()}`}>
      <div className="flex items-start gap-2.5">
        <span className="text-lg">{insight.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#f5f5f7] font-['Roobert'] mb-1">{insight.title}</h3>
          <p className="text-xs text-[#a1a1aa] font-['Plus_Jakarta_Sans'] leading-relaxed">{insight.description}</p>
        </div>
      </div>
    </div>
  )
}
