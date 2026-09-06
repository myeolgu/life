import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAllEvents, domainMeta } from "../allEvents";
import EventStatusBadge, { getEventStatus } from "./EventStatusBadge";
import ErrorBoundary from "./ErrorBoundary";
import Modal from "./Modal";

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

function HomeCalendarInner({ onNavigate }) {
  const allEvents = useAllEvents();
  const [selectedId, setSelectedId] = useState(null);
  const selected = allEvents.find((e) => e.id === selectedId);

  return (
    <section className="home-calendar">
      <h2>전체 일정</h2>
      <p className="muted">모든 카테고리의 일정을 한눈에 봅니다. 날짜를 클릭하면 상세 내용이 팝업으로 나옵니다.</p>
      <div className="calendar-legend">
        {Object.entries(domainMeta).map(([key, meta]) => (
          <span key={key} className="legend-item">
            <span className="legend-dot" style={{ background: meta.color }} />
            {meta.label}
          </span>
        ))}
      </div>
      <div className="calendar-wrap">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          height="auto"
          headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
          events={allEvents}
          eventClick={(info) => setSelectedId(info.event.id)}
          eventContent={(arg) => {
            const ev = allEvents.find((e) => e.id === arg.event.id);
            const meta = domainMeta[ev.domain];
            return (
              <div className="cal-event home-cal-event">
                <span className="legend-dot" style={{ background: meta.color }} />
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
