import HomeCalendar from "./components/HomeCalendar";
import { PixelHouseIcon, PixelRingsIcon } from "./components/PixelIcons";

const CATEGORIES = [
  {
    key: "interior",
    Icon: PixelHouseIcon,
    title: "인테리어",
    desc: "부개주공1단지 107동 1001호 — 매물정보, 시공범위, 공사순서, 계약 체크리스트",
  },
  {
    key: "loan",
    Icon: PixelRingsIcon,
    title: "대출 / 혼인신고",
    desc: "신혼부부 디딤돌대출 신청과 혼인신고 진행 상황, 자금 계획",
  },
];

export default function Home({ onSelect }) {
  return (
    <div className="home">
      <h1>삶 관리</h1>
      <p className="muted">관리할 카테고리를 선택하세요.</p>
      <div className="category-grid">
        {CATEGORIES.map((c) => (
          <button key={c.key} className="category-card" onClick={() => onSelect(c.key)}>
            <c.Icon size={28} className="category-icon" />
            <span className="category-title">{c.title}</span>
            <span className="category-desc">{c.desc}</span>
          </button>
        ))}
      </div>

      <HomeCalendar onNavigate={onSelect} />
    </div>
  );
}
