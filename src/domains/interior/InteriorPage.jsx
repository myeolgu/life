import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { property, scope, events, contractChecklist, progress } from "./data";
import { useChecklist } from "../../hooks/useChecklist";
import EventStatusBadge, { getEventStatus } from "../../components/EventStatusBadge";

const TABS = [
  { key: "progress", label: "진행 상황" },
  { key: "property", label: "매물 정보" },
  { key: "scope", label: "시공 범위" },
  { key: "timeline", label: "공사 진행 순서" },
  { key: "checklist", label: "계약/견적 체크리스트" },
];

function Progress() {
  const { items, toggle, persistent } = useChecklist("interior_progress", progress);
  const doneCount = items.filter((p) => p.done).length;
  return (
    <section>
      <h2>인테리어 진행 상황</h2>
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

function formatDate(iso) {
  return iso.replaceAll("-", ".");
}

function formatRange(ev) {
  if (!ev.end) return formatDate(ev.start);
  const end = new Date(`${ev.end}T00:00:00`);
  end.setDate(end.getDate() - 1);
  const endIso = end.toISOString().slice(0, 10);
  return endIso === ev.start ? formatDate(ev.start) : `${formatDate(ev.start)} ~ ${formatDate(endIso)}`;
}

function Timeline() {
  const [selectedId, setSelectedId] = useState(events[0].id);
  const selected = events.find((e) => e.id === selectedId);

  return (
    <section>
      <h2>공사 진행 순서</h2>
      <p className="muted">
        착공 예정일 2026.09.20 기준으로 정리했습니다. 실제 착공일이 달라지면 이 캘린더를 다시 갱신합니다. 날짜(일정)를 클릭하면 아래에 상세 내용이 나옵니다.
      </p>
      <div className="calendar-wrap">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate="2026-09-20"
          locale="ko"
          height="auto"
          headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
          events={events}
          eventClick={(info) => setSelectedId(info.event.id)}
          eventContent={(arg) => {
            const ev = events.find((e) => e.id === arg.event.id);
            const status = getEventStatus(ev);
            return (
              <div className={`cal-event status-${status}`}>
                <EventStatusBadge status={status} />
                <span className="cal-event-title">{arg.event.title}</span>
              </div>
            );
          }}
        />
      </div>
      {selected && (
        <div className="event-detail">
          <div className="event-detail-top">
            <EventStatusBadge status={getEventStatus(selected)} />
            <span className="event-detail-date">{formatRange(selected)}</span>
          </div>
          <h3>{selected.title}</h3>
          <p>{selected.description}</p>
        </div>
      )}
      <ul className="notes">
        <li>총 소요기간: 약 18일 작업일 기준 (주말·양생 여유 포함 시 실질 3~4주)</li>
        <li>방수 양생 기간과 도배 건조 기간이 전체 일정의 변수 — 여유 있게 잡을 것</li>
      </ul>
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

export default function InteriorPage({ onBack }) {
  const [tab, setTab] = useState("progress");

  return (
    <div className="app">
      <header className="app-header">
        <button className="back-link" onClick={onBack}>← 홈으로</button>
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
        {tab === "progress" && <Progress />}
        {tab === "property" && <PropertyInfo />}
        {tab === "scope" && <Scope />}
        {tab === "timeline" && <Timeline />}
        {tab === "checklist" && <ContractChecklist />}
      </main>
    </div>
  );
}
