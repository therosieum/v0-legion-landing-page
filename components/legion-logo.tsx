// Legion.cc brand — sword icon mark + wordmark
// Colors from brand book: #09090B background, #C8FF00 accent, #FAFAFA white

export function LegionMark({
  size = 32,
  className = "",
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Legion"
    >
      {/* Sword blade — vertical */}
      <rect x="18.5" y="2" width="3" height="24" rx="1" fill="currentColor" />
      {/* Crossguard */}
      <rect x="10" y="19" width="20" height="3" rx="1" fill="currentColor" />
      {/* Handle */}
      <rect x="18.5" y="25" width="3" height="9" rx="1" fill="#C8FF00" />
      {/* Pommel */}
      <rect x="16" y="33" width="8" height="3" rx="1.5" fill="#C8FF00" />
      {/* Blade tip accent */}
      <polygon points="20,2 22.5,8 17.5,8" fill="#C8FF00" />
    </svg>
  )
}

export function LegionWordmark({
  className = "",
  size = "md",
}: {
  className?: string
  size?: "sm" | "md" | "lg"
}) {
  const textClass =
    size === "sm"
      ? "text-base tracking-[0.2em]"
      : size === "lg"
        ? "text-2xl tracking-[0.25em]"
        : "text-lg tracking-[0.22em]"

  const markSize = size === "sm" ? 22 : size === "lg" ? 36 : 28

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LegionMark size={markSize} />
      <span className={`font-black uppercase ${textClass} leading-none`}>
        LEGION
      </span>
    </div>
  )
}
