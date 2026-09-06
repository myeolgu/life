import HomeCalendar from "./components/HomeCalendar";
import { useChecklist } from "./hooks/useChecklist";
import { useAllEvents, domainMeta } from "./allEvents";
import { getEventStatus } from "./components/EventStatusBadge";
import { progress as interiorProgressSeed } from "./domains/interior/data";
import { progress as loanProgressSeed } from "./domains/loan/data";

const CATEGORIES = [
  {
    key: "interior",
    icon: `${import.meta.env.BASE_URL}icons/pixel/house.png`,
    title: "인테리어",
    desc: "부개주공1단지 107동 1001호",
    progressDomain: "interior_progress",
    progressSeed: interiorProgressSeed,
  },
  {
    key: "loan",
    icon: `${import.meta.env.BASE_URL}icons/pixel/heart.png`,
    title: "대출 / 혼인신고",
    desc: "신혼부부 디딤돌대출 & 혼인신고",
    progressDomain: "loan_progress",
    progressSeed: loanProgressSeed,
  },
];

// 프로젝트 전체 상태는 일정 상태(EventStatusBadge)와 다른 축이라 별도로 계산한다:
// 체크리스트를 하나도 안 건드렸으면 예정, 다 끝났으면 완료, 그 사이면 진행중.
// 색상은 EventStatusBadge와 동일한 팔레트를 재사용해 사이트 전체에서 같은 의미로 보이게 한다.
function projectStatus(doneCount, total) {
  if (total === 0 || doneCount === 0) return { label: "예정", bg: "#ff863b" };
  if (doneCount >= total) return { label: "완료", bg: "#888888" };
  return { label: "진행중", bg: "#7b53ea" };
}

function nextMilestone(events, domainKey) {
  return events
    .filter((e) => e.domain === domainKey && getEventStatus(e) !== "end")
    .sort((a, b) => a.start.localeCompare(b.start))[0] ?? null;
}

function formatShortDate(iso) {
  const [, m, d] = iso.split("-");
  return `${parseInt(m, 10)}/${parseInt(d, 10)}`;
}

function CategoryCard({ category, events, onSelect }) {
  const { items } = useChecklist(category.progressDomain, category.progressSeed);
  const doneCount = items.filter((i) => i.done).length;
  const total = items.length;
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  const status = projectStatus(doneCount, total);
  const milestone = nextMilestone(events, category.key);
  const accent = domainMeta[category.key]?.color ?? "var(--accent)";

  return (
    <button className="category-card" onClick={() => onSelect(category.key)}>
      <div className="category-card-top">
        <img src={category.icon} alt="" width={40} height={40} className="category-icon" />
        <span className="status-badge" style={{ background: status.bg }}>{status.label}</span>
      </div>
      <span className="category-title">{category.title}</span>
      <span className="category-desc">{category.desc}</span>

      <div className="category-progress">
        <div className="category-progress-bar">
          <div className="category-progress-fill" style={{ width: `${pct}%`, background: accent }} />
        </div>
        <span className="category-progress-label">{pct}% · {doneCount}/{total} 완료</span>
      </div>

      {milestone && (
        <div className="category-milestone">
          <span className="category-milestone-dot" style={{ background: accent }} />
          다음 · {formatShortDate(milestone.start)} {milestone.title}
        </div>
      )}
    </button>
  );
}

export default function Home({ onSelect }) {
  const { events } = useAllEvents();

  return (
    <div className="home">
      <h1>삶 관리</h1>
      <p className="muted">관리할 카테고리를 선택하세요.</p>
      <div className="category-grid">
        {CATEGORIES.map((c) => (
          <CategoryCard key={c.key} category={c} events={events} onSelect={onSelect} />
        ))}
      </div>

      <HomeCalendar onNavigate={onSelect} />
    </div>
  );
}
