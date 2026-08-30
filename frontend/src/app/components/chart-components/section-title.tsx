interface SectionTitleProps {
  title: string
}

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="border-b border-[#E2E6EF] pb-1.5 mb-2">
      <h2 className="text-lg font-semibold text-[#101828] font-['Roobert'] tracking-wide">{title}</h2>
    </div>
  )
}
