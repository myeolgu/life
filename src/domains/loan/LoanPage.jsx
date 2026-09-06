import { useState } from "react";
import { finance, progress } from "./data";
import { useChecklist } from "../../hooks/useChecklist";
import { useContentItems } from "../../hooks/useContentItems";
import ErrorBoundary from "../../components/ErrorBoundary";

const TABS = [
  { key: "progress", label: "진행 상황" },
  { key: "finance", label: "자금 계획" },
];

function Progress() {
  const { items, toggle, persistent } = useChecklist("loan_progress", progress);
  const doneCount = items.filter((p) => p.done).length;
  return (
    <section>
      <h2>대출/혼인신고 진행 상황</h2>
      <p className="muted">
        {doneCount} / {items.length} 완료
        {!persistent && " — Supabase 미설정: 새로고침하면 초기화됩니다"}
      </p>
      <ul className="progress-list">
        {items.map((p) => (
          <li key={p.id} className={p.done ? "done" : ""}>
            <label className="checkline">
              <input type="checkbox" checked={p.done} onChange={() => toggle(p.id)} />
              {p.label}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Finance() {
  const { items, toggle, persistent } = useChecklist("loan_documents", finance.documents);
  const { items: financeEvents } = useContentItems("loan", "finance_events", finance.events);
  const { items: loanSummary } = useContentItems("loan", "loan_summary", finance.loanSummary);
  return (
    <section>
      <h2>자금 계획 — 혼인신고 & 디딤돌대출</h2>
      <table className="data-table">
        <thead>
          <tr><th>일자</th><th>내용</th></tr>
        </thead>
        <tbody>
          {financeEvents.map((e, i) => (
            <tr key={i}>
              <td className="nowrap">{e.date}</td>
              <td>{e.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>2026년 신혼부부 디딤돌대출 요약</h3>
      <p className="muted">검증 필요 — 정책 변동 가능성 있음. 신청 전 최신 정보 재확인.</p>
      <ul className="notes">
        {loanSummary.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>

      <h3>
        필요 서류 체크리스트
        {!persistent && <span className="muted"> (Supabase 미설정: 저장 안 됨)</span>}
      </h3>
      <ul className="checklist">
        {items.map((d) => (
          <li key={d.id}>
            <label>
              <input type="checkbox" checked={d.done} onChange={() => toggle(d.id)} /> {d.label}
            </label>
          </li>
        ))}
      </ul>
      <p className="callout">
        정확한 금리/한도/서류/절차는 한국주택금융공사 기금e든든 또는 실제 취급 은행을 통해 최종 확인 필요.
      </p>
    </section>
  );
}

export default function LoanPage({ onBack }) {
  const [tab, setTab] = useState("progress");

  return (
    <div className="app">
      <header className="app-header">
        <button className="back-link" onClick={onBack}>← 홈으로</button>
        <h1>디딤돌 대출 & 혼인신고</h1>
        <p className="muted">신혼부부 디딤돌대출 신청 진행 상황과 자금 계획</p>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={tab === t.key ? "active" : ""}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="content">
        <ErrorBoundary key={tab}>
          {tab === "progress" && <Progress />}
          {tab === "finance" && <Finance />}
        </ErrorBoundary>
      </main>
    </div>
  );
}
