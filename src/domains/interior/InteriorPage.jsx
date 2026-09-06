import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  property as propertySeed,
  scope as scopeSeed,
  events as eventsSeed,
  phases as phasesSeed,
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
const arrowIconSrc = `${import.meta.env.BASE_URL}icons/pixel/arrow.png`;

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

const SPACE_ORDER = ["현관", "주방", "베란다", "욕실", "공통", "공통(전기)"];
const PRIORITY_BADGE = { "높음": "#e0524b", "중간": "#ff863b", "낮음": "#888888" };

function groupBySpace(items) {
  const groups = {};
  items.forEach((item) => {
    (groups[item.space] ??= []).push(item);
  });
  const keys = [...SPACE_ORDER.filter((k) => groups[k]), ...Object.keys(groups).filter((k) => !SPACE_ORDER.includes(k))];
  return keys.map((key) => ({ key, items: groups[key] }));
}

function parseCostRange(costRange) {
  const [min, max] = (costRange ?? "").split("~").map((s) => parseInt(s, 10));
  return { min: Number.isFinite(min) ? min : 0, max: Number.isFinite(max) ? max : 0 };
}

function Scope() {
  const { items: scope } = useContentItems("interior", "scope", scopeSeed);
  const totals = scope.reduce(
    (acc, s) => {
      const { min, max } = parseCostRange(s.costRange);
      acc.min += min;
      acc.max += max;
      acc.priority[s.priority] = (acc.priority[s.priority] ?? 0) + 1;
      return acc;
    },
    { min: 0, max: 0, priority: {} }
  );

  return (
    <section>
      <h2>시공 범위</h2>
      <p className="muted">견적/발주 기준으로 확정한 시공 항목을 공간별로 정리했습니다.</p>

      {groupBySpace(scope).map(({ key, items }) => (
        <div className="checklist-group" key={key}>
          <h4>{key}</h4>
          <table className="data-table">
            <thead>
              <tr><th>항목</th><th>세부 내용</th><th>우선순위</th><th>예상 기간</th><th>예상 비용</th></tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.no}>
                  <td>{s.item}</td>
                  <td>{s.detail}</td>
                  <td>
                    <span className="status-badge" style={{ background: PRIORITY_BADGE[s.priority] ?? "#888888" }}>
                      {s.priority}
                    </span>
                  </td>
                  <td className="nowrap">{s.duration}</td>
                  <td className="nowrap">{s.costRange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="callout">
        <b>전체 시공 범위 요약</b> — 총 {scope.length}개 항목 (
        {SPACE_ORDER.filter((k) => scope.some((s) => s.space === k)).length}개 공간)
        · 우선순위: 높음 {totals.priority["높음"] ?? 0} · 중간 {totals.priority["중간"] ?? 0} · 낮음 {totals.priority["낮음"] ?? 0}
        <br />
        예상 비용 합계: 약 {totals.min.toLocaleString()}~{totals.max.toLocaleString()}만원
        <br />
        <span className="muted" style={{ margin: 0 }}>
          ⚠️ 시공업체 상담/견적 전 일반 시세 기준 개략 추정치입니다 — 확정 금액이 아닙니다. 실제 공사 일정은 "공사 진행 순서" 탭 캘린더를 참고하세요 (여러 항목이 같은 날 함께 진행될 수 있어 기간을 단순 합산하지 않습니다).
        </span>
      </div>
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

function phaseProgressPct(start, end, today = new Date()) {
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (t <= s) return 0;
  if (t >= e) return 100;
  return Math.round(((t - s) / (e - s)) * 100);
}

function PhaseProgressRing({ start, end }) {
  const pct = phaseProgressPct(start, end);
  const r = 20;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="phase-ring" aria-label={`${pct}% 진행`}>
      <circle cx="28" cy="28" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="6"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 28 28)"
      />
      <text x="28" y="32" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text)">
        {pct}%
      </text>
    </svg>
  );
}

function PhaseCard({ phase }) {
  return (
    <div className="phase-card">
      <div className="phase-card-top">
        <div>
          <h4>{phase.title}</h4>
          <p className="muted" style={{ margin: 0 }}>{formatDate(phase.start)} ~ {formatDate(phase.end)}</p>
        </div>
        <PhaseProgressRing start={phase.start} end={phase.end} />
      </div>
      <div className="phase-section">
        <b>주요 작업</b>
        <ul>{phase.tasks.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </div>
      {phase.approvals.length > 0 && (
        <div className="phase-section">
          <b>필요 문서/승인</b>
          <ul>{phase.approvals.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </div>
      )}
      <div className="phase-section">
        <b>주의사항</b>
        <ul>{phase.cautions.map((c, i) => <li key={i}>{c}</li>)}</ul>
      </div>
      <p className="phase-contact">{phase.contact}</p>
    </div>
  );
}

function Timeline() {
  const { items: phases } = useContentItems("interior", "phases", phasesSeed);
  return (
    <section>
      <h2>공사 진행 순서</h2>
      <p className="muted">
        잔금(입주)일 2026.12.10 이후, 착공 예정일 2026.12.12 기준으로 정리했습니다. 실제 착공일이 달라지면 이 캘린더를 다시 갱신합니다.
      </p>

      <div className="phase-grid">
        {phases.map((p) => (
          <PhaseCard key={p.id} phase={p} />
        ))}
      </div>

      <h3>날짜별 상세 캘린더</h3>
      <p className="muted">날짜(일정)를 클릭하면 상세 내용이 팝업으로 나옵니다.</p>
      <ConstructionCalendar />
      <ul className="notes">
        <li>총 소요기간: 약 18일 작업일 기준 (주말·양생 여유 포함 시 실질 3~4주)</li>
        <li>방수 양생 기간과 도배 건조 기간이 전체 일정의 변수 — 여유 있게 잡을 것</li>
      </ul>
    </section>
  );
}

// 2026-09-06 기준 OpenStreetMap(Nominatim) 도로명주소 기준 지오코딩 좌표 — 건물 정확 위치가 아니라
// 도로 단위 근사치다 (한국 건물 단위 주소는 OSM 커버리지가 낮음). "직관적 거리 비교" 목적으로는 충분.
const APARTMENT_LOCATION = { lat: 37.5041112, lng: 126.7329245, label: "부개주공1단지 (길주남로 143 기준)" };
const CONTRACTOR_LOCATIONS = {
  1: { lat: 37.5197106, lng: 126.7313432 },
  2: { lat: 37.5042615, lng: 126.7128978 },
  3: { lat: 37.5080178, lng: 126.7275339 },
  4: { lat: 37.5003385, lng: 126.7372825 },
};

function createPinIcon({ text, bg, size }) {
  return L.divIcon({
    className: "pin-icon",
    html: `<div class="pin-dot" style="width:${size}px;height:${size}px;background:${bg};">${text}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const apartmentIcon = createPinIcon({ text: "★", bg: "#b4784a", size: 26 });
const contractorIcon = (no) => createPinIcon({ text: String(no), bg: "#5b3a24", size: 22 });

function FitToMarkers({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(points, { padding: [24, 24], maxZoom: 15 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);
  return null;
}

function ContractorsMap({ contractors }) {
  const markers = contractors
    .filter((c) => CONTRACTOR_LOCATIONS[c.no])
    .map((c) => ({ ...c, ...CONTRACTOR_LOCATIONS[c.no] }));
  const points = [[APARTMENT_LOCATION.lat, APARTMENT_LOCATION.lng], ...markers.map((m) => [m.lat, m.lng])];

  return (
    <div className="map-embed">
      <MapContainer center={points[0]} zoom={13} scrollWheelZoom={false} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToMarkers points={points} />
        <Marker position={[APARTMENT_LOCATION.lat, APARTMENT_LOCATION.lng]} icon={apartmentIcon}>
          <Popup>{APARTMENT_LOCATION.label}</Popup>
        </Marker>
        {markers.map((m) => (
          <Marker key={m.no} position={[m.lat, m.lng]} icon={contractorIcon(m.no)}>
            <Popup>{m.no}. {m.name}<br />{m.address}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
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

      <h3>위치 비교 (★ 부개주공1단지 · 1~4 업체)</h3>
      <p className="muted">지도 위 숫자 핀이 각 업체 위치입니다. 위 카드 번호와 동일합니다.</p>
      <ContractorsMap contractors={contractors} />

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
              <img src={arrowIconSrc} alt="" width={14} height={14} /> {c.action}
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
