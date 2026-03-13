export function LegionLogo({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Legion L-shaped mark inspired by their branding */}
      <rect x="10" y="10" width="20" height="80" fill="currentColor" />
      <rect x="10" y="70" width="80" height="20" fill="currentColor" />
      {/* Inner accent */}
      <rect x="30" y="70" width="40" height="10" fill="#c8ff00" />
    </svg>
  )
}

export function LegionWordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LegionLogo size={28} />
      <span className="text-xl font-bold tracking-tight">LEGION</span>
    </div>
  )
}
