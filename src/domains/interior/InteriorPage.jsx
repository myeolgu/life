import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  property as propertySeed,
  scope as scopeSeed,
  events as eventsSeed,
  contractChecklist as contractChecklistSeed,
  contractors as contractorsSeed,
  progress,
} from "./data";
import { useChecklist } from "../../hooks/useChecklist";
import { useContentItems } from "../../hooks/useContentItems";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";
import EventStatusBadge, { getEventStatus } from "../../components/EventStatusBadge";
import ErrorBoundary from "../../components/ErrorBoundary";
import Modal from "../../components/Modal";
import Accordion from "../../components/Accordion";
import { PixelArrowIcon } from "../../components/PixelIcons";

const TABS = [
  { key: "progress", label: "진행 상황" },
  { key: "property", label: "매물 정보" },
  { key: "scope", label: "시공 범위" },
  { key: "timeline", label: "공사 진행 순서" },
  { key: "contractors", label: "시공업체" },
  { key: "checklist", label: "계약/견적 체크리스트" },
];

function Progress() {
  const { items, toggle, persistent } = useChecklist("interior_progress", progress);
  const doneCount = items.filter((p) => p.done).length;
  return (
    <section>
      <h2>인테리어 진행 상황</h2>
      <Accordion title={`체크리스트 (${doneCount}/${items.length} 완료)`} defaultOpen>
        {!persistent && <p className="muted">Supabase 미설정: 새로고침하면 초기화됩니다</p>}
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
      </Accordion>
      <h3>공사 일정</h3>
      <p className="muted">뭘 해야 할지 한눈에 보려고 캘린더도 같이 둡니다. 날짜를 클릭하면 상세 내용이 팝업으로 나옵니다.</p>
      <ConstructionCalendar />
    </section>
  );
}

function PropertyInfo() {
  const { items } = useContentItems("interior", "property", [propertySeed]);
  const property = items[0] ?? propertySeed;
  return (
    <section>
      <h2>매물 정보</h2>
      <table className="info-table">
        <tbody>
          <tr><th>아파트명</th><td>{property.name}</td></tr>
          <tr><th>주소</th><td>{property.address}</td></tr>
          <tr><th>동/호수</th><td>{property.unit}</td></tr>
          <tr><th>상태</th><td>{property.status}</td></tr>
          <tr><th>잔금(입주)일</th><td>{property.closingDate}</td></tr>
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
  const { items: scope } = useContentItems("interior", "scope", scopeSeed);
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

function ConstructionCalendar() {
  const { events } = useCalendarEvents("interior", eventsSeed);
  const [selectedId, setSelectedId] = useState(null);
  const selected = events.find((e) => e.id === selectedId);

  return (
    <>
      <div className="calendar-wrap">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate="2026-12-12"
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
      <Modal open={!!selected} onClose={() => setSelectedId(null)}>
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
      </Modal>
    </>
  );
}

function Timeline() {
  return (
    <section>
      <h2>공사 진행 순서</h2>
      <p className="muted">
        잔금(입주)일 2026.12.10 이후, 착공 예정일 2026.12.12 기준으로 정리했습니다. 실제 착공일이 달라지면 이 캘린더를 다시 갱신합니다. 날짜(일정)를 클릭하면 상세 내용이 팝업으로 나옵니다.
      </p>
      <ConstructionCalendar />
      <ul className="notes">
        <li>총 소요기간: 약 18일 작업일 기준 (주말·양생 여유 포함 시 실질 3~4주)</li>
        <li>방수 양생 기간과 도배 건조 기간이 전체 일정의 변수 — 여유 있게 잡을 것</li>
      </ul>
    </section>
  );
}

function Contractors() {
  const { items: contractors } = useContentItems("interior", "contractors", contractorsSeed);
  return (
    <section>
      <h2>시공업체 후보</h2>
      <p className="muted">
        아직 전부 상담 전입니다. 부개주공1단지(인천 부평구 부개동) 기준 위치/거리를 정리했습니다 — "확인 안 됨"인 항목은 상담 전 직접 재확인이 필요합니다.
      </p>
      <div className="card-grid">
        {contractors.map((c) => (
          <div className="card" key={c.no}>
            <h3>
              {c.no}. {c.name}{" "}
              {c.verified ? (
                <span className="verify-badge verified">확인됨</span>
              ) : (
                <span className="verify-badge unverified">확인 필요</span>
              )}
            </h3>
            <p><b>위치</b> {c.address}</p>
            <p><b>거리</b> {c.distance}</p>
            <p><b>연락처</b> {c.contact}</p>
            <p className="action">{c.note}</p>
            {c.portfolioUrl && (
              <a className="event-detail-link" href={c.portfolioUrl} target="_blank" rel="noreferrer">
                오늘의집 포트폴리오 보기 →
              </a>
            )}
          </div>
        ))}
      </div>
      <p className="callout">
        상담 전에 계약/견적 체크리스트 탭의 "업체 말장난 TOP5"를 다시 한 번 확인할 것.
      </p>
    </section>
  );
}

function ContractChecklist() {
  const { items: contractChecklist } = useContentItems("interior", "contract_checklist", contractChecklistSeed);
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
            <p className="action">
              <PixelArrowIcon size={14} /> {c.action}
            </p>
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
  // 시공업체를 아직 못 골라서, 인테리어 도메인에 들어오면 일단 이 탭부터 보이게 한다.
  const [tab, setTab] = useState("contractors");
  const { items: propertyItems } = useContentItems("interior", "property", [propertySeed]);
  const property = propertyItems[0] ?? propertySeed;

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
        <ErrorBoundary key={tab}>
          {tab === "progress" && <Progress />}
          {tab === "property" && <PropertyInfo />}
          {tab === "scope" && <Scope />}
          {tab === "timeline" && <Timeline />}
          {tab === "contractors" && <Contractors />}
          {tab === "checklist" && <ContractChecklist />}
        </ErrorBoundary>
      </main>
    </div>
  );
}
