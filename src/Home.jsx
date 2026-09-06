import HomeCalendar from "./components/HomeCalendar";
import ProgressRing from "./components/ProgressRing";
import { useChecklist } from "./hooks/useChecklist";
import { useContentItems } from "./hooks/useContentItems";
import { useAllEvents, domainMeta } from "./allEvents";
import { getEventStatus } from "./components/EventStatusBadge";
import { progress as interiorProgressSeed } from "./domains/interior/data";
import { progress as loanProgressSeed } from "./domains/loan/data";
import { categories as budgetCategoriesSeed } from "./domains/budget/data";

const CATEGORIES = [
  {
    key: "interior",
    icon: `${import.meta.env.BASE_URL}icons/pixel/house.png`,
    title: "인테리어",
    desc: "부개주공1단지 107동 1001호",
    formatProgress: (done, total) => `${done}/${total} 완료`,
  },
  {
    key: "loan",
    icon: `${import.meta.env.BASE_URL}icons/pixel/heart.png`,
    title: "대출 / 혼인신고",
    desc: "신혼부부 디딤돌대출 & 혼인신고",
    formatProgress: (done, total) => `${done}/${total} 완료`,
  },
  {
    key: "budget",
    icon: `${import.meta.env.BASE_URL}icons/pixel/coin.png`,
    title: "예산 관리",
    desc: "결혼/인테리어 지출 및 예산 추적",
    formatProgress: (spent, planned) => `${spent.toLocaleString()}/${planned.toLocaleString()}만원 지출`,
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

function CategoryCard({ category, doneCount, total, events, onSelect }) {
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
        <span className="category-progress-label">{pct}% · {category.formatProgress(doneCount, total)}</span>
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

function ProgressSummary({ domainStats, events }) {
  const avgPct = Math.round(domainStats.reduce((sum, d) => sum + d.pct, 0) / domainStats.length);

  const upcoming = events
    .filter((e) => getEventStatus(e) !== "end")
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, 3);

  const recentDone = domainStats
    .flatMap((d) => d.items.filter((i) => i.done && i.updatedAt).map((i) => ({ ...i, domain: d.key })))
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
    .slice(0, 3);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const soon = events.filter((e) => {
    if (getEventStatus(e) === "end") return false;
    const start = new Date(`${e.start}T00:00:00`);
    const diffDays = Math.round((start - today) / 86400000);
    return diffDays >= 0 && diffDays <= 7;
  });

  return (
    <section className="progress-summary">
      <h2>한눈에 보는 진행 현황</h2>
      <div className="progress-summary-grid">
        <div className="summary-card summary-card-donut">
          <ProgressRing pct={avgPct} size={84} stroke={9} />
          <span className="muted" style={{ margin: 0 }}>전체 평균 진행률</span>
        </div>

        <div className="summary-card">
          <h4>다음 마일스톤</h4>
          {upcoming.length === 0 && <p className="muted" style={{ margin: 0 }}>예정된 일정이 없습니다.</p>}
          <ul className="summary-list">
            {upcoming.map((e) => (
              <li key={e.id}>
                <span className="summary-dot" style={{ background: domainMeta[e.domain]?.color }} />
                <span className="nowrap">{formatShortDate(e.start)}</span> {e.title}
                <span className="muted"> · {domainMeta[e.domain]?.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="summary-card">
          <h4>최근 업데이트</h4>
          {recentDone.length === 0 && <p className="muted" style={{ margin: 0 }}>아직 완료 항목이 없습니다.</p>}
          <ul className="summary-list">
            {recentDone.map((i) => (
              <li key={i.id}>✓ {i.label} <span className="muted">({formatShortDate(i.updatedAt.slice(0, 10))})</span></li>
            ))}
          </ul>
        </div>

        <div className="summary-card">
          <h4>주의 사항 <span className="muted">(7일 이내)</span></h4>
          {soon.length === 0 && <p className="muted" style={{ margin: 0 }}>임박한 일정이 없습니다.</p>}
          <ul className="summary-list">
            {soon.map((e) => (
              <li key={e.id}>
                <span className="status-badge" style={{ background: "#e0524b" }}>D-{Math.round((new Date(`${e.start}T00:00:00`) - today) / 86400000)}</span>{" "}
                {formatShortDate(e.start)} {e.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function budgetPct(categories) {
  const planned = categories.reduce((sum, c) => sum + c.planned, 0);
  const spent = categories.reduce((sum, c) => sum + c.spent, 0);
  return { planned, spent, pct: planned === 0 ? 0 : Math.round((spent / planned) * 100) };
}

export default function Home({ onSelect }) {
  const { events } = useAllEvents();
  const interior = useChecklist("interior_progress", interiorProgressSeed);
  const loan = useChecklist("loan_progress", loanProgressSeed);
  const { items: budgetCategories } = useContentItems("budget", "categories", budgetCategoriesSeed);

  // "전체 평균 진행률"은 체크리스트 기반 프로젝트(인테리어/대출)만 평균낸다 — 예산 소진율은
  // 다른 종류의 지표라 같이 평균 내면 의미가 섞인다. 예산은 카드 자체 진행바로만 보여준다.
  const taskDomainStats = [
    { key: "interior", items: interior.items, pct: interior.items.length === 0 ? 0 : Math.round((interior.items.filter((i) => i.done).length / interior.items.length) * 100) },
    { key: "loan", items: loan.items, pct: loan.items.length === 0 ? 0 : Math.round((loan.items.filter((i) => i.done).length / loan.items.length) * 100) },
  ];
  const budget = budgetPct(budgetCategories);

  return (
    <div className="home">
      <h1>삶 관리</h1>
      <p className="muted">관리할 카테고리를 선택하세요.</p>

      <ProgressSummary domainStats={taskDomainStats} events={events} />

      <div className="category-grid">
        {CATEGORIES.map((category) => {
          if (category.key === "budget") {
            return (
              <CategoryCard
                key={category.key}
                category={category}
                doneCount={budget.spent}
                total={budget.planned}
                events={events}
                onSelect={onSelect}
              />
            );
          }
          const stats = taskDomainStats.find((d) => d.key === category.key);
          const doneCount = stats.items.filter((i) => i.done).length;
          return (
            <CategoryCard
              key={category.key}
              category={category}
              doneCount={doneCount}
              total={stats.items.length}
              events={events}
              onSelect={onSelect}
            />
          );
        })}
      </div>

      <HomeCalendar onNavigate={onSelect} />
    </div>
  );
}
