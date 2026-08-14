interface SectionTitleProps {
  title: string
}

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="border-b border-white/10 pb-1.5 mb-2">
      <h2 className="text-lg font-semibold text-[#f5f5f7] font-['Roobert'] tracking-wide">{title}</h2>
    </div>
  )
}
