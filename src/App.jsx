import { useState } from "react";
import {
  property,
  scope,
  timeline,
  finance,
  contractChecklist,
  progress,
} from "./data";
import "./App.css";

const TABS = [
  { key: "dashboard", label: "진행 상황" },
  { key: "property", label: "매물 정보" },
  { key: "scope", label: "시공 범위" },
  { key: "timeline", label: "공사 진행 순서" },
  { key: "finance", label: "자금 계획" },
  { key: "checklist", label: "계약/견적 체크리스트" },
];

function Dashboard() {
  const doneCount = progress.filter((p) => p.done).length;
  return (
    <section>
      <h2>전체 진행 상황</h2>
      <p className="muted">
        {doneCount} / {progress.length} 완료
      </p>
      <ul className="progress-list">
        {progress.map((p, i) => (
          <li key={i} className={p.done ? "done" : ""}>
            <span className="check">{p.done ? "✅" : "⬜"}</span>
            {p.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

function PropertyInfo() {
  return (
    <section>
      <h2>매물 정보</h2>
      <table className="info-table">
        <tbody>
          <tr><th>아파트명</th><td>{property.name}</td></tr>
          <tr><th>주소</th><td>{property.address}</td></tr>
          <tr><th>동/호수</th><td>{property.unit}</td></tr>
          <tr><th>매매 성공일</th><td>{property.dealDate}</td></tr>
          <tr><th>상태</th><td>{property.status}</td></tr>
          <tr><th>준공연도</th><td>{property.built}</td></tr>
          <tr><th>단지 규모</th><td>{property.complex}</td></tr>
          <tr><th>평형</th><td>{property.pyeong}</td></tr>
          <tr><th>평면도</th><td>{property.floorPlan}</td></tr>
        </tbody>
      </table>
    </section>
  );
}

function Scope() {
  return (
    <section>
      <h2>시공 범위</h2>
      <p className="muted">견적/발주 기준으로 확정한 시공 항목입니다.</p>
      <table className="data-table">
        <thead>
          <tr><th>#</th><th>항목</th><th>세부 내용</th></tr>
        </thead>
        <tbody>
          {scope.map((s) => (
            <tr key={s.no}>
              <td>{s.no}</td>
              <td>{s.item}</td>
              <td>{s.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function Timeline() {
  return (
    <section>
      <h2>공사 진행 순서</h2>
      <p className="muted">
        착공일 기준 D+n으로 정리했습니다. 착공일이 확정되면 실제 날짜로 치환합니다.
      </p>
      <table className="data-table">
        <thead>
          <tr><th>일차</th><th>작업</th></tr>
        </thead>
        <tbody>
          {timeline.map((t, i) => (
            <tr key={i}>
              <td className="nowrap">{t.day}</td>
              <td>{t.task}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="notes">
        <li>총 소요기간: 약 18일 작업일 기준 (주말·양생 여유 포함 시 실질 3~4주)</li>
        <li>방수 양생 기간과 도배 건조 기간이 전체 일정의 변수 — 여유 있게 잡을 것</li>
      </ul>
    </section>
  );
}

function Finance() {
  return (
    <section>
      <h2>자금 계획 — 혼인신고 & 디딤돌대출</h2>
      <table className="data-table">
        <thead>
          <tr><th>일자</th><th>내용</th></tr>
        </thead>
        <tbody>
          {finance.events.map((e, i) => (
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
        {finance.loanSummary.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>

      <h3>필요 서류 체크리스트</h3>
      <ul className="checklist">
        {finance.documents.map((d, i) => (
          <li key={i}>
            <label>
              <input type="checkbox" /> {d}
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

function ContractChecklist() {
  return (
    <section>
      <h2>인테리어 계약/견적 체크리스트 (업체 말장난 주의)</h2>
      <p className="muted">
        참고: 유튜브 "인테리어 견적서에 '이 단어' 보이면 1초도 망설이지 마세요!"
      </p>
      <div className="card-grid">
        {contractChecklist.map((c) => (
          <div className="card" key={c.no}>
            <h3>{c.no}. {c.phrase}</h3>
            <p>{c.explain}</p>
            <p className="action">👉 {c.action}</p>
          </div>
        ))}
      </div>
      <p className="callout">
        핵심: 인테리어의 성패는 디자인이 아니라 계약서에서 90% 이상 결정된다.
      </p>
    </section>
  );
}

function App() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="app">
      <header className="app-header">
        <h1>{property.name} {property.unit} 인테리어</h1>
        <p className="muted">{property.address}</p>
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
        {tab === "dashboard" && <Dashboard />}
        {tab === "property" && <PropertyInfo />}
        {tab === "scope" && <Scope />}
        {tab === "timeline" && <Timeline />}
        {tab === "finance" && <Finance />}
        {tab === "checklist" && <ContractChecklist />}
      </main>
    </div>
  );
}

export default App;
