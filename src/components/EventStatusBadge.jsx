import "./EventStatusBadge.css";

// Figma "삼성물산 시니어 리빙 솔루션" 캘린더 컴포넌트(BadgeCalendar24)의 라벨/색상 체계를 따른다.
const STATUS_META = {
  end: { label: "종료", bg: "#888888" },
  progress: { label: "진행중", bg: "#7b53ea" },
  upcoming: { label: "예정", bg: "#ff863b" },
};

/**
 * 오늘 날짜를 기준으로 일정의 상태(종료/진행중/예정)를 계산한다.
 * event.end는 FullCalendar 규칙대로 "포함하지 않는" 다음 날짜다.
 */
export function getEventStatus(event, today = new Date()) {
  const start = new Date(`${event.start}T00:00:00`);
  const end = event.end ? new Date(`${event.end}T00:00:00`) : new Date(start.getTime() + 86400000);
  if (today >= end) return "end";
  if (today >= start) return "progress";
  return "upcoming";
}

export default function EventStatusBadge({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META.upcoming;
  return (
    <span className="status-badge" style={{ background: meta.bg }}>
      {meta.label}
    </span>
  );
}
