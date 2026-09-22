import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  property as propertySeed,
  scope as scopeSeed,
  events as eventsSeed,
  phases as phasesSeed,
  contractChecklist as contractChecklistSeed,
  contractReview as contractReviewSeed,
  contractors as contractorsSeed,
  quoteSections as quoteSectionsSeed,
  requirements as requirementsSeed,
  progress,
} from "./data";
import { useChecklist } from "../../hooks/useChecklist";
import { useContentItems } from "../../hooks/useContentItems";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";
import EventStatusBadge, { getEventStatus } from "../../components/EventStatusBadge";
import ErrorBoundary from "../../components/ErrorBoundary";
import Modal from "../../components/Modal";
import Accordion from "../../components/Accordion";
import ProgressRing from "../../components/ProgressRing";
const arrowIconSrc = `${import.meta.env.BASE_URL}icons/pixel/arrow.png`;

const TABS = [
  { key: "contractors", label: "시공업체" },
  { key: "requirements", label: "요구사항" },
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
          {property.concept && <tr><th>선호 컨셉</th><td>{property.concept}</td></tr>}
          {property.lifestyleNotes && <tr><th>생활 특이사항</th><td>{property.lifestyleNotes}</td></tr>}
        </tbody>
      </table>
    </section>
  );
}

const SPACE_ORDER = ["현관", "주방", "베란다", "욕실", "공통", "공통(전기)"];
// 2026-09-16: 흰 글씨 배지 배경 대비가 WCAG AA(4.5:1) 미달이라 어둡게 조정 (다른 status-badge 색과 동일 기준).
const PRIORITY_BADGE = { "높음": "#db372f", "중간": "#cc4e00", "낮음": "#767676" };

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
                    <span className="status-badge" style={{ background: PRIORITY_BADGE[s.priority] ?? "#767676" }}>
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
          locales={[koLocale]}
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

function PhaseCard({ phase }) {
  return (
    <div className="phase-card">
      <div className="phase-card-top">
        <div>
          <h4>{phase.title}</h4>
          <p className="muted" style={{ margin: 0 }}>{formatDate(phase.start)} ~ {formatDate(phase.end)}</p>
        </div>
        <ProgressRing pct={phaseProgressPct(phase.start, phase.end)} />
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
// 2026-09-14 재검증: 기존 좌표(37.5041112, 126.7329245)는 Nominatim에서 "부평동"으로
// 라벨링된 지점이었는데, 구조화 쿼리(street+housenumber)로 다시 조회하니 "부개동"으로 명시
// 라벨링된 지점이 별도로 있었다 (약 0.5km 차이) — 부개주공1단지는 부개동 소재이므로 이쪽이 맞음.
const APARTMENT_LOCATION = { lat: 37.5038196, lng: 126.7389088, label: "부개주공1단지 (길주남로 143, 부개동 확인)" };
// 좌표는 OpenStreetMap Nominatim으로 주소 지오코딩해서 구함 (2026-09-14).
const CONTRACTOR_LOCATIONS = {
  1: { lat: 37.5042615, lng: 126.7128978 },
  2: { lat: 37.4981899, lng: 126.7397386 }, // 봄인테리어 (GS수퍼마켓 인천부개점 기준)
  3: { lat: 37.5075993, lng: 126.7516984 }, // 데코크로스디자인 (대림타운, 부천 상동)
};

function createPinIcon({ text, bg, size }) {
  return L.divIcon({
    className: "pin-icon",
    html: `<div class="pin-dot" style="width:${size}px;height:${size}px;background:${bg};">${text}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const apartmentIcon = createPinIcon({ text: "★", bg: "#8a5c39", size: 26 });
const contractorIcon = (no) => createPinIcon({ text: String(no), bg: "#5b3a24", size: 22 });

function FitToMarkers({ points }) {
  const map = useMap();
  // key로 points 내용을 비교해서, 탭 전환 직후처럼 컨테이너가 아직 최종 크기로 자리잡기 전에
  // fitBounds가 실행돼 좁은 화면(모바일)에서 일부 핀이 범위 밖으로 밀려나는 문제가 있었다
  // (2026-09-14, 화면비율이 다른 모바일 폭에서 재현 확인). invalidateSize로 실제 렌더링된
  // 컨테이너 크기를 다시 측정한 뒤 fitBounds를 호출하도록 수정.
  const key = points.map((p) => p.join(",")).join("|");
  useEffect(() => {
    if (points.length > 0) {
      map.invalidateSize();
      map.fitBounds(points, { padding: [24, 24], maxZoom: 15 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key]);
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

// 2026-09-15: 업체별로 상담/견적 체크리스트를 따로 관리하고 싶다는 요청 반영 —
// 계약/견적 체크리스트 탭에 있던 18개 체크 항목(견적서 검토/계약서 검토)을 업체 카드에서
// 팝업으로 열리는 업체별 체크리스트로 옮겼다. 같은 checklist_items 도메인("interior_contract_review")
// 안에서 id 뒤에 ":업체no"를 붙여 업체별로 완전히 독립된 54개(18×3) 행으로 저장한다
// (checklist_items의 PK가 도메인이 아니라 id 단독이라 이렇게 구분해야 서로 안 겹친다).
function reviewSeedForContractor(no) {
  return contractReviewSeed.map((item) => ({ ...item, id: `${item.id}:${no}` }));
}
// 업체 번호는 시드(contractors)에서 가져온다 — 예전엔 [1, 2, 3]을 손으로 적어둬서, 업체를 추가하면
// 그 업체의 체크리스트가 조용히 비어버렸다 (2026-09-20 미송디자인 추가하면서 발견).
const allContractorReviewSeed = contractorsSeed.map((c) => c.no).flatMap(reviewSeedForContractor);

// 2026-09-15: 처음엔 팝업(모달)으로 만들었는데 폭이 너무 좁다는 피드백을 받아 전용 페이지
// 형태로 변경 — 업체 카드 목록 대신 이 화면 전체를 체크리스트로 바꿔서 보여주고, 상단
// "← 목록으로"로 돌아간다.
function ContractorChecklistPage({ contractor, onBack }) {
  const { items, toggle, persistent } = useChecklist("interior_contract_review", allContractorReviewSeed);
  const items_ = items.filter((i) => i.id.endsWith(`:${contractor.no}`));
  const doneCount = items_.filter((i) => i.done).length;

  return (
    <section>
      <button className="back-link" onClick={onBack}>← 목록으로</button>
      <h2>{contractor.no}. {contractor.name} — 상담·계약 체크리스트</h2>
      <p className="muted">
        {doneCount} / {items_.length} 완료
        {!persistent && " — Supabase 미설정: 저장 안 됨"}
      </p>
      {groupReviewItems(items_).map(({ key, items: groupItems }) => {
        const groupDone = groupItems.filter((d) => d.done).length;
        return (
          <div className="checklist-group" key={key}>
            <h4>{key} <span className="muted">({groupDone}/{groupItems.length})</span></h4>
            <ul className="checklist">
              {groupItems.map((d) => (
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
    </section>
  );
}

// 2026-09-20: 업체 카드에서 "견적서 보기"로 여는 견적서 전용 화면.
// 금액은 DB에 저장하지 않고 항상 수량×단가로 다시 계산한다 — 견적서에 적힌 공종 합계(subtotal)와
// 대조해서 어긋나면 화면에 바로 경고를 띄우기 위해서다 (숫자를 옮기다 틀리면 조용히 넘어가지 않게).
const num = (n) => n.toLocaleString("ko-KR");
const won = (n) => `${num(n)}원`;

// au는 재료비/노무비를 나누지 않고 "공급단가" 한 칸만 적는 견적서용이다 (봄인테리어). 재료비·노무비 열은 비고
// 합계에만 잡힌다 — mu에 넣으면 전액이 재료비로 보이기 때문에 따로 둔다.
function lineAmount(ln) {
  const material = ln.mu != null ? Math.round((ln.q ?? 1) * ln.mu) : 0;
  const labor = ln.lu != null ? Math.round((ln.q ?? 1) * ln.lu) : 0;
  const flat = ln.au != null ? Math.round((ln.q ?? 1) * ln.au) : 0;
  return { material, labor, total: material + labor + flat };
}

function sectionAmount(section) {
  return section.lines.reduce(
    (acc, ln) => {
      const a = lineAmount(ln);
      return { material: acc.material + a.material, labor: acc.labor + a.labor, total: acc.total + a.total };
    },
    { material: 0, labor: 0, total: 0 }
  );
}

function QuoteCardSummary({ quote }) {
  return (
    <div className="quote-block">
      <p className="quote-kind">
        <b>견적</b>{" "}
        <span className={`verify-badge ${quote.kind === "written" ? "verified" : "unverified"}`}>
          {quote.kind === "written" ? "서면 견적서" : "구두 (서면 없음)"}
        </span>
      </p>
      <p className="quote-total">{won(quote.total)}</p>
      <p className="muted">부가세 {quote.vat} · 견적일 {quote.date}</p>
    </div>
  );
}

function QuoteLineRow({ line }) {
  const { material, labor, total } = lineAmount(line);
  const cell = (amount, unitPrice) => {
    if (!amount) return "—";
    return (
      <>
        {num(amount)}
        {line.q !== 1 && <small>@{num(unitPrice)}</small>}
      </>
    );
  };

  return (
    <tr className={line.blank ? "quote-row-blank" : line.svc ? "quote-row-svc" : undefined}>
      <td>
        <b>{line.n}</b>
        {line.hl && <span className="quote-tag quote-tag-hl">원본 강조</span>}
        {line.svc && <span className="quote-tag quote-tag-svc">서비스</span>}
        {line.blank && <span className="quote-tag quote-tag-blank">금액 없음</span>}
        {line.mark && <span className="quote-tag quote-tag-svc">{line.mark}</span>}
        {line.s && <small>{line.s}</small>}
      </td>
      <td className="quote-amount quote-qty">{line.blank || line.svc ? "—" : `${line.q} ${line.u}`}</td>
      <td className="quote-amount">{line.blank || line.svc ? "—" : cell(material, line.mu)}</td>
      <td className="quote-amount">{line.blank || line.svc ? "—" : cell(labor, line.lu)}</td>
      <td className="quote-amount strong">{line.svc ? "0" : line.blank ? "—" : num(total)}</td>
    </tr>
  );
}

function QuoteSection({ section, hideBlank }) {
  const sum = sectionAmount(section);
  const blanks = section.lines.filter((l) => l.blank).length;
  const mismatch = section.subtotal != null && sum.total !== section.subtotal;
  const lines = hideBlank ? section.lines.filter((l) => !l.blank) : section.lines;

  return (
    <details className="quote-sec" open>
      <summary>
        <span className="quote-sec-name">
          {section.name}
          {section.note && <em>{section.note}</em>}
        </span>
        <span className="quote-sec-meta">
          {blanks > 0 && <span className="quote-tag quote-tag-blank">금액 없는 항목 {blanks}</span>}
          <span className="quote-sec-total">{won(sum.total)}</span>
        </span>
      </summary>
      {mismatch && (
        <p className="quote-mismatch">
          <b>합계 불일치</b> 항목을 더한 값({won(sum.total)})이 견적서에 적힌 공종 합계({won(section.subtotal)})와 다릅니다 — 원본을 다시 확인하세요.
        </p>
      )}
      <table className="data-table quote-lines">
        <thead>
          <tr>
            <th>품명 · 규격</th>
            <th className="quote-amount">수량</th>
            <th className="quote-amount">재료비</th>
            <th className="quote-amount">노무비</th>
            <th className="quote-amount">합계</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, i) => (
            <QuoteLineRow key={`${line.n}-${i}`} line={line} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>소계</td>
            <td />
            <td className="quote-amount">{sum.material ? num(sum.material) : "—"}</td>
            <td className="quote-amount">{sum.labor ? num(sum.labor) : "—"}</td>
            <td className="quote-amount strong">{num(sum.total)}</td>
          </tr>
        </tfoot>
      </table>
    </details>
  );
}

function QuoteDetail({ contractorNo, seed }) {
  const { items: sections } = useContentItems("interior", `quote:${contractorNo}`, seed);
  const [hideBlank, setHideBlank] = useState(false);

  const rows = sections.map((s) => ({ section: s, sum: sectionAmount(s) }));
  const itemsTotal = rows.reduce((acc, r) => acc + r.sum.total, 0);
  // 모든 줄이 blank인 견적이 들어와도 비중 칸이 NaN%가 되지 않게 나눗셈 분모만 0을 막는다
  // (itemsTotal 자체는 화면에 금액으로 찍히므로 그대로 둔다).
  const shareBase = itemsTotal || 1;
  const maxShare = rows.reduce((acc, r) => Math.max(acc, r.sum.total), 0) || 1;
  const materialTotal = rows.reduce((acc, r) => acc + r.sum.material, 0);
  const laborTotal = rows.reduce((acc, r) => acc + r.sum.labor, 0);

  return (
    <>
      <h3>공종별 요약</h3>
      <p className="muted">항목 합계({won(itemsTotal)}) 대비 비중입니다.</p>
      <table className="data-table quote-overview">
        <thead>
          <tr>
            <th>공종</th>
            <th className="quote-amount">재료비</th>
            <th className="quote-amount">노무비</th>
            <th className="quote-amount">합계</th>
            <th>비중</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ section, sum }) => (
            <tr key={section.id}>
              <td>{section.name}</td>
              <td className="quote-amount">{sum.material ? num(sum.material) : "—"}</td>
              <td className="quote-amount">{sum.labor ? num(sum.labor) : "—"}</td>
              <td className="quote-amount strong">{num(sum.total)}</td>
              <td className="quote-share">
                <span>
                  <span className="quote-bar">
                    <i style={{ width: `${(sum.total / maxShare) * 100}%` }} />
                  </span>
                  <span className="quote-share-pct">{((sum.total / shareBase) * 100).toFixed(1)}%</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>항목 합계</td>
            <td className="quote-amount">{num(materialTotal)}</td>
            <td className="quote-amount">{num(laborTotal)}</td>
            <td className="quote-amount strong">{num(itemsTotal)}</td>
            <td />
          </tr>
        </tfoot>
      </table>

      <h3>항목별 내역</h3>
      <p className="muted">수량 × 단가로 계산한 금액입니다. 견적서에 항목은 있지만 금액이 없는 줄은 흐리게 표시했습니다.</p>
      <label className="quote-toggle">
        <input type="checkbox" checked={hideBlank} onChange={() => setHideBlank((v) => !v)} /> 금액 없는 항목 숨기기
      </label>
      {rows.map(({ section }) => (
        <QuoteSection key={section.id} section={section} hideBlank={hideBlank} />
      ))}
    </>
  );
}

function QuotePage({ contractor, onBack }) {
  const quote = contractor.quote;
  const seed = quoteSectionsSeed[contractor.no] ?? [];
  // 나중에 추가되는 업체가 총액만 있는 견적을 들고 와도 화면이 죽지 않게, 없을 수 있는 값은 전부 가드한다.
  const questions = quote.questions ?? [];
  const hasMeta = quote.docTitle || quote.vendorLine || quote.terms;
  const emptyGroups = quote.emptyGroups ?? [];
  // 금액이 빈 공종이라고 다 추가 비용은 아니다 — 이 집에 없거나 안 하기로 한 것은 빼고,
  // 실제로 금액이 더 붙을 수 있는 "결정 필요"만 상단 경고로 올린다.
  const pending = emptyGroups.filter((g) => g.status === "결정 필요");
  const stack = quote.material
    ? [
        { label: "재료비", value: quote.material, cls: "quote-c-material" },
        { label: "노무비", value: quote.labor, cls: "quote-c-labor" },
        { label: "경비", value: quote.overhead, cls: "quote-c-overhead" },
        { label: `일반관리비 ${quote.mgmtRate}`, value: quote.mgmt, cls: "quote-c-mgmt" },
      ]
    : [];

  return (
    <section className="quote-view">
      <button className="back-link" onClick={onBack}>← 목록으로</button>
      <h2>{contractor.no}. {contractor.name} — 견적서</h2>
      {hasMeta && (
      <dl className="quote-meta">
        {quote.docTitle && (
          <>
            <dt>공사명</dt>
            <dd>{quote.docTitle}</dd>
          </>
        )}
        {quote.vendorLine && (
          <>
            <dt>업체</dt>
            <dd>{quote.vendorLine}</dd>
          </>
        )}
        {quote.terms && (
          <>
            <dt>조건</dt>
            <dd>{quote.terms}</dd>
          </>
        )}
      </dl>
      )}

      <div className="quote-hero">
        <p className="quote-kind">
          합계금액{" "}
          <span className={`verify-badge ${quote.kind === "written" ? "verified" : "unverified"}`}>
            {quote.kind === "written" ? "서면 견적서" : "구두 (서면 없음)"}
          </span>
        </p>
        <p className="quote-figure">{won(quote.total)}</p>
        <p className="muted">
          부가세 {quote.vat}
          {quote.vatNote && ` — ${quote.vatNote}`} · 견적일 {quote.date}
        </p>
        {stack.length > 0 && (
          <>
            <div className="quote-stack">
              {stack.map((part) => (
                <i key={part.label} className={part.cls} style={{ width: `${(part.value / quote.total) * 100}%` }} />
              ))}
            </div>
            <ul className="quote-legend">
              {stack.map((part) => (
                <li key={part.label}>
                  <span className={`legend-dot ${part.cls}`} />
                  {part.label}
                  <b>{won(part.value)}</b>
                </li>
              ))}
            </ul>
            <p className="muted quote-recon">
              공사금액 {won(quote.construction)}(재료비 + 노무비 + 경비)에 일반관리비 {quote.mgmtRate}를 더한 금액입니다. 기업이윤 칸은 비어 있습니다.
            </p>
          </>
        )}
      </div>

      {pending.length > 0 && (
        <p className="quote-alert">
          <b>아직 정해야 할 것.</b> 금액이 비어 있고 이번 공사에 넣을지 정해야 하는 공종이 있습니다 — {pending.map((g) => g.name).join(", ")}.
          마감을 끝낸 뒤에는 다시 뜯어야 하는 공사라 착공 전에 결정해야 하고, 넣으면 그만큼 공사비가 올라갑니다.
        </p>
      )}
      {emptyGroups.length > 0 && pending.length === 0 && (
        <p className="quote-settled">
          <b>공사 범위 확정.</b> 금액이 비어 있던 공종은 전부 "해당 없음" 또는 "하지 않기로 함"으로 정리됐습니다 — 이 금액 위에 더 붙을 공종은 없습니다.
          다만 견적서 특기사항은 여전히 "견적내역외 물량은 별도"이니, 계약서에 공사 범위를 이 견적서 항목으로 한정한다고 적어두세요.
        </p>
      )}

      {seed.length > 0 && <QuoteDetail contractorNo={contractor.no} seed={seed} />}

      {emptyGroups.length > 0 && (
        <>
          <h3>금액이 통째로 비어 있는 공종</h3>
          <p className="muted">
            견적서에는 항목 이름만 있고 금액이 하나도 없는 칸입니다. 왜 비어 있는지는 아래에 공종별로 적어뒀습니다.
          </p>
          <div className="quote-empty-grid">
            {emptyGroups.map((group) => (
              <div
                className={`quote-empty-card${group.status === "결정 필요" ? " quote-empty-pending" : ""}`}
                key={group.name}
              >
                <h4>
                  {group.name}
                  {group.status && (
                    <span className={`quote-tag ${group.status === "결정 필요" ? "quote-tag-blank" : "quote-tag-svc"}`}>
                      {group.status}
                    </span>
                  )}
                </h4>
                {group.statusNote && <p className="quote-empty-note">{group.statusNote}</p>}
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      {questions.length > 0 && (
        <>
          <h3>업체에 확인할 것</h3>
          <p className="muted">견적서만으로는 알 수 없어서 계약 전에 서면으로 받아야 하는 내용입니다.</p>
          <ol className="quote-ask">
            {questions.map((q) => (
              <li key={q.t}>
                <b>{q.t}</b>
                <span>{q.d}</span>
              </li>
            ))}
          </ol>
        </>
      )}

      {quote.footnote && <p className="callout">{quote.footnote}</p>}
    </section>
  );
}

function Contractors() {
  const { items: contractors } = useContentItems("interior", "contractors", contractorsSeed);
  // { contractor, mode: "checklist" | "quote" } — 목록 대신 그 업체의 전용 화면을 보여준다.
  const [selected, setSelected] = useState(null);

  if (selected?.mode === "checklist") {
    return <ContractorChecklistPage contractor={selected.contractor} onBack={() => setSelected(null)} />;
  }
  if (selected?.mode === "quote") {
    return <QuotePage contractor={selected.contractor} onBack={() => setSelected(null)} />;
  }

  return (
    <section>
      <h2>시공업체 후보</h2>
      <p className="muted">
        디자인큐원과 봄인테리어는 서면 견적서를 받았고 데코크로스디자인·미송디자인·모로디자인은 아직 견적을 못 받았습니다.
        부개주공1단지(인천 부평구 부개동) 기준 위치/거리를 정리했습니다 — "확인 안 됨"인 항목은 상담 전 직접 재확인이 필요합니다.
        카드의 "견적서 보기"는 그 업체 견적 내역, "체크리스트 보기"는 상담·계약 체크리스트 페이지로 이동합니다.
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
            {c.quote && <QuoteCardSummary quote={c.quote} />}
            {c.portfolioUrl && (
              <a className="event-detail-link" href={c.portfolioUrl} target="_blank" rel="noreferrer">
                오늘의집 포트폴리오 보기 →
              </a>
            )}
            <div className="card-actions">
              {c.quote && (
                <button className="btn-secondary" onClick={() => setSelected({ contractor: c, mode: "quote" })}>
                  견적서 보기
                </button>
              )}
              <button className="btn-secondary" onClick={() => setSelected({ contractor: c, mode: "checklist" })}>
                체크리스트 보기
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3>위치 비교 (★ 부개주공1단지)</h3>
      <p className="muted">지도 위 숫자 핀이 각 업체 위치입니다. 위 카드 번호와 동일하고, 주소가 확인된 업체만 표시됩니다.</p>
      <ContractorsMap contractors={contractors} />

      <p className="callout">
        상담 전에 계약/견적 체크리스트 탭의 "업체 말장난 TOP5"를 다시 한 번 확인할 것.
      </p>
    </section>
  );
}

// 2026-09-20: 업체 상담 때마다 같은 요구사항을 다시 설명하지 않도록 모아둔 탭.
// 각 요구사항 옆에 디자인큐원 견적서와 대조한 결과를 붙여서, 다른 업체를 상담할 때도
// "이걸 견적에 넣었는지"를 그대로 체크리스트처럼 쓸 수 있다.
const REQ_STATE = {
  match: { label: "견적 반영", cls: "verified" },
  partial: { label: "일부 반영", cls: "req-partial" },
  conflict: { label: "견적과 다름", cls: "unverified" },
  missing: { label: "견적서에 없음", cls: "req-partial" },
  none: { label: "대조 대상 아님", cls: "req-none" },
};

function Requirements() {
  const { items: spaces } = useContentItems("interior", "requirements", requirementsSeed);
  const all = spaces.flatMap((s) => s.items);
  const needsAction = all.filter((i) => i.quote?.state === "conflict" || i.quote?.state === "partial" || i.quote?.state === "missing");
  const conflicts = all.filter((i) => i.quote?.state === "conflict");

  return (
    <section>
      <h2>우리 요구사항</h2>
      <p className="muted">
        업체 상담 때 그대로 읽어주면 되도록 공간별로 모았습니다. 각 항목 옆에는 (주)디자인큐원 2026-09-19 견적서와 대조한 결과를 붙였습니다 —
        다른 업체 견적을 받을 때도 같은 기준으로 확인하세요.
      </p>
      <p className="callout">
        요구사항 {all.length}개 중 견적서와 <b>다르거나 확인이 필요한 것이 {needsAction.length}개</b>
        {conflicts.length > 0 && <> (그중 견적과 직접 충돌 {conflicts.length}개)</>}입니다.
      </p>

      <div className="card-grid">
        {spaces.map((space) => (
          <div className="card req-card" key={space.space}>
            <h3>{space.space}</h3>
            <ul className="req-list">
              {space.items.map((item) => {
                const state = REQ_STATE[item.quote?.state] ?? REQ_STATE.none;
                return (
                  <li key={item.text}>
                    <p className="req-text">
                      <b>{item.text}</b>
                      {item.status === "미정" && <span className="quote-tag quote-tag-hl">미정</span>}
                      <span className={`verify-badge ${state.cls}`}>{state.label}</span>
                    </p>
                    {item.quote?.note && <p className="muted req-note">{item.quote.note}</p>}
                    {item.quote?.sources?.map((s) => (
                      <a className="req-source" key={s.url} href={s.url} target="_blank" rel="noreferrer">
                        출처: {s.label}
                      </a>
                    ))}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

const REVIEW_GROUP_ORDER = ["견적서 검토", "계약서 검토"];

function groupReviewItems(items) {
  const groups = {};
  items.forEach((item) => {
    (groups[item.group] ??= []).push(item);
  });
  return REVIEW_GROUP_ORDER.filter((k) => groups[k]).map((key) => ({ key, items: groups[key] }));
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

      <p className="callout">
        실제 체크(견적서 검토/계약서 검토 18개 항목)는 여기서 하지 않는다 — "시공업체" 탭에서 업체
        카드의 "체크리스트 보기"를 누르면 그 업체 전용 체크리스트가 팝업으로 뜬다 (2026-09-15,
        업체별로 따로 관리하고 싶다는 요청 반영 — 3곳 상담 결과가 서로 안 섞이도록).
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
          {tab === "requirements" && <Requirements />}
          {tab === "checklist" && <ContractChecklist />}
        </ErrorBoundary>
      </main>
    </div>
  );
}
