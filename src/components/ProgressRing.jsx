// 도트/원형 컨셉의 공용 원형 진행률 표시. 공사 단계 카드(InteriorPage)와 홈 진행 요약에서 같이 쓴다.
export default function ProgressRing({ pct, size = 56, stroke = 6, color = "var(--accent)", label, className = "" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = c - (clamped / 100) * c;
  const center = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={`progress-ring ${className}`} aria-label={`${clamped}% 진행`}>
      <circle cx={center} cy={center} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
      />
      <text x={center} y={center + 4} textAnchor="middle" fontSize={size * 0.22} fontWeight="700" fill="var(--text)">
        {label ?? `${clamped}%`}
      </text>
    </svg>
  );
}
