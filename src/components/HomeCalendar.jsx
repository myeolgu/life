import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAllEvents, domainMeta } from "../allEvents";
import EventStatusBadge, { getEventStatus } from "./EventStatusBadge";
import ErrorBoundary from "./ErrorBoundary";
import Modal from "./Modal";
import AddEventForm from "./AddEventForm";

const DOMAIN_OPTIONS = Object.entries(domainMeta).map(([key, meta]) => ({ key, label: meta.label }));

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

// 사용자가 입력한 "포함" 종료일을 FullCalendar/DB 규칙인 "미포함" 다음날로 변환한다.
function toExclusiveEnd(inclusiveEnd) {
  if (!inclusiveEnd) return undefined;
  const d = new Date(`${inclusiveEnd}T00:00:00`);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function HomeCalendarInner({ onNavigate }) {
  const { events: allEvents, addEvent } = useAllEvents();
  const [selectedId, setSelectedId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const selected = allEvents.find((e) => e.id === selectedId);

  function handleAddEvent(domain, event) {
    addEvent(domain, { ...event, end: toExclusiveEnd(event.end) });
    setShowAddForm(false);
  }

  return (
    <section className="home-calendar">
      <h2>전체 일정</h2>
      <p className="muted">
        모든 카테고리의 일정을 한눈에 봅니다. 색은 진행 상태(종료/진행중/예정) 기준이고, 작은 점은 카테고리입니다.
        날짜를 클릭하면 상세 내용이 팝업으로 나옵니다.
      </p>
      <div className="calendar-legend">
        {DOMAIN_OPTIONS.map((d) => (
          <span key={d.key} className="legend-item">
            <span className="legend-dot" style={{ background: domainMeta[d.key].color }} />
            {d.label}
          </span>
        ))}
      </div>
      <div className="calendar-wrap">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          height="auto"
          headerToolbar={{ left: "prev,next today", center: "title", right: "addEvent" }}
          customButtons={{
            addEvent: { text: "+ 일정 추가", click: () => setShowAddForm(true) },
          }}
          events={allEvents}
          eventClick={(info) => setSelectedId(info.event.id)}
          eventContent={(arg) => {
            const ev = allEvents.find((e) => e.id === arg.event.id);
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
              <span className="legend-dot" style={{ background: domainMeta[selected.domain].color }} />
              <span className="event-detail-domain">{domainMeta[selected.domain].label}</span>
              <EventStatusBadge status={getEventStatus(selected)} />
              <span className="event-detail-date">{formatRange(selected)}</span>
            </div>
            <h3>{selected.title}</h3>
            <p>{selected.description}</p>
            {onNavigate && (
              <button className="event-detail-link" onClick={() => onNavigate(selected.domain)}>
                {domainMeta[selected.domain].label} 바로가기 →
              </button>
            )}
          </div>
        )}
      </Modal>

      <Modal open={showAddForm} onClose={() => setShowAddForm(false)}>
        <AddEventForm domains={DOMAIN_OPTIONS} onSubmit={handleAddEvent} onCancel={() => setShowAddForm(false)} />
      </Modal>
    </section>
  );
}

export default function HomeCalendar(props) {
  return (
    <ErrorBoundary>
      <HomeCalendarInner {...props} />
    </ErrorBoundary>
  );
}
