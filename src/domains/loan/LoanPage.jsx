import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { finance, progress, tips, events as eventsSeed } from "./data";
import { useChecklist } from "../../hooks/useChecklist";
import { useContentItems } from "../../hooks/useContentItems";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";
import EventStatusBadge, { getEventStatus } from "../../components/EventStatusBadge";
import ErrorBoundary from "../../components/ErrorBoundary";
import Modal from "../../components/Modal";

const TABS = [
  { key: "progress", label: "진행 상황" },
  { key: "finance", label: "자금 계획" },
  { key: "tips", label: "후기 & 꿀팁" },
];

const TIP_TYPE_CLASS = {
  후기: "type-review",
  기사: "type-news",
  유튜브: "type-youtube",
  정보: "type-info",
};

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

function LoanCalendar() {
  const { events } = useCalendarEvents("loan", eventsSeed);
  const [selectedId, setSelectedId] = useState(null);
  const selected = events.find((e) => e.id === selectedId);

  return (
    <>
      <div className="calendar-wrap">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate="2026-09-01"
          locale="ko"
          height="auto"
          headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
          events={events}
          eventClick={(info) => setSelectedId(info.event.id)}
          eventContent={(arg) => {
            // 이벤트를 배열에서 다시 찾지 않고 FullCalendar가 들고 있는 값을 바로 쓴다 —
            // 배열 룩업이 어긋나면 크래시 나는 걸 홈 캘린더에서 겪어서(2026-09-06) 여기도 같은 방식으로.
            const status = getEventStatus({ start: arg.event.startStr, end: arg.event.endStr || undefined });
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

      <h3>일정 캘린더</h3>
      <p className="muted">날짜(일정)를 클릭하면 상세 내용이 팝업으로 나옵니다.</p>
      <LoanCalendar />
    </section>
  );
}

const GROUP_ORDER = ["공통", "남편", "아내"];

function groupItems(items) {
  const groups = {};
  items.forEach((item) => {
    const key = item.group ?? "기타";
    (groups[key] ??= []).push(item);
  });
  const orderedKeys = [...GROUP_ORDER.filter((k) => groups[k]), ...Object.keys(groups).filter((k) => !GROUP_ORDER.includes(k))];
  return orderedKeys.map((key) => ({ key, items: groups[key] }));
}

function Finance() {
  const { items, toggle, persistent } = useChecklist("loan_documents", finance.documents);
  const { items: financeEvents } = useContentItems("loan", "finance_events", finance.events);
  const { items: loanSummary } = useContentItems("loan", "loan_summary", finance.loanSummary);
  const { items: documentGuide } = useContentItems("loan", "document_guide", finance.documentGuide);
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

      <h3>일정 캘린더</h3>
      <p className="muted">날짜(일정)를 클릭하면 상세 내용이 팝업으로 나옵니다.</p>
      <LoanCalendar />

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
      <p className="muted">매매계약서 사본은 부부 공동 1부만 있으면 되어 "공통"으로 뺐고, 나머지는 각자 1부씩 준비합니다. 괄호 안은 발급 유효기간/권장 발급 시점입니다.</p>
      {groupItems(items).map(({ key, items: groupList }) => {
        const doneCount = groupList.filter((d) => d.done).length;
        return (
          <div className="checklist-group" key={key}>
            <h4>
              {key} <span className="muted">({doneCount}/{groupList.length})</span>
            </h4>
            <ul className="checklist">
              {groupList.map((d) => (
                <li key={d.id}>
                  <label>
                    <input type="checkbox" checked={d.done} onChange={() => toggle(d.id)} /> {d.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <h3>서류별 발급처 & 유효기간</h3>
      <p className="muted">
        한국주택금융공사·기금e든든 공식 페이지에는 서류별 유효기간을 명시한 표가 없어서, "은행 관행상 통상 N개월"이라고 적은 항목은 디딤돌대출 특화 규정이 아니라 부동산담보대출 업계 전반의 관행입니다 — 신청 전 담당 은행/기금e든든에 재확인하세요.
      </p>
      <table className="data-table">
        <thead>
          <tr><th>서류</th><th>발급처</th><th>유효기간</th><th>출처</th></tr>
        </thead>
        <tbody>
          {documentGuide.map((g, i) => (
            <tr key={i}>
              <td>{g.doc}</td>
              <td>{g.office}</td>
              <td>{g.validity}</td>
              <td>
                <a href={g.url} target="_blank" rel="noopener noreferrer">{g.source}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="callout">
        정확한 금리/한도/서류/절차는 한국주택금융공사 기금e든든 또는 실제 취급 은행을 통해 최종 확인 필요.
      </p>
    </section>
  );
}

function Tips() {
  const { items } = useContentItems("loan", "tips", tips);
  const [selected, setSelected] = useState(null);
  const selectedItem = selected !== null ? items[selected] : null;

  return (
    <section>
      <h2>후기 & 꿀팁</h2>
      <p className="muted">
        실제 이용자 후기·커뮤니티 질문답변·뉴스기사·유튜브 영상에서 모은 실전 팁입니다. 공식 조건/일정은 "자금 계획" 탭을 참고하세요. 항목을 누르면 전체 내용을 볼 수 있습니다.
      </p>
      <ul className="notice-list">
        {items.map((t, i) => (
          <li key={i}>
            <button className="notice-row" onClick={() => setSelected(i)}>
              <span className={`tag-badge ${TIP_TYPE_CLASS[t.type] ?? ""}`}>{t.type}</span>
              <span className="notice-title">{t.title}</span>
              <span className="muted nowrap">{t.source}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="callout">
        후기·기사·영상은 개인/매체별 경험이나 시점에 따라 다를 수 있습니다. 실제 신청 전에는 항상 기금e든든 또는 취급 은행에서 최신 정보를 재확인하세요.
      </p>

      <Modal open={selectedItem !== null} onClose={() => setSelected(null)}>
        {selectedItem && (
          <div>
            <span className={`tag-badge ${TIP_TYPE_CLASS[selectedItem.type] ?? ""}`}>{selectedItem.type}</span>
            <h3 style={{ marginTop: 12 }}>{selectedItem.title}</h3>
            <p>{selectedItem.summary}</p>
            <p className="muted" style={{ marginBottom: 0 }}>
              출처:{" "}
              <a href={selectedItem.url} target="_blank" rel="noopener noreferrer">
                {selectedItem.source}
              </a>
            </p>
          </div>
        )}
      </Modal>
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
          {tab === "tips" && <Tips />}
        </ErrorBoundary>
      </main>
    </div>
  );
}
