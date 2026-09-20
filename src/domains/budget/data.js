// 2026-09-06: 기존에 쓰던 Notion 예산 표(카테고리/이름/총비용/지불인/메모/미지급 금액)를
// 그대로 옮긴 시드 데이터. "미지급"은 사용자가 확인해준 의미 — 아직 안 낸 금액 (표에 있던
// "남은 비용" 컬럼은 예전 추정치라 사용자가 무시해도 된다고 확인해서 옮기지 않음).
// 금액 단위는 원(KRW) — 표에 적힌 숫자를 그대로 사용.
export const items = [
  { category: "결혼식", name: "결혼식 식장 + 식대(200명)", total: 18700000, unpaid: 18700000, paidBy: [], memo: "예약금 뺀 가격" },
  { category: "결혼식", name: "결혼식 예약금", total: 3000000, unpaid: 0, paidBy: ["김소윤", "이주엽"], memo: "" },
  { category: "결혼식", name: "식권 (200장)", total: 20000, unpaid: 20000, paidBy: [], memo: "" },
  { category: "결혼식", name: "청첩장 (200장)", total: 250000, unpaid: 250000, paidBy: [], memo: "" },
  { category: "결혼식", name: "결혼식 전문 사회자", total: 300000, unpaid: 300000, paidBy: [], memo: "" },
  { category: "결혼식", name: "결혼식 한복 대여", total: 660000, unpaid: 660000, paidBy: [], memo: "예상 비용/예약금 소윤이 냈음" },
  { category: "결혼식", name: "혼주 메이크업 (양가 어머님, 아버님)", total: 550000, unpaid: 550000, paidBy: [], memo: "예상 비용/예약금 소윤이 냈음" },
  { category: "예복", name: "신랑 예복", total: 635000, unpaid: 0, paidBy: ["이주엽"], memo: "" },
  { category: "예복", name: "양가 아버님 예복", total: 1400000, unpaid: 1400000, paidBy: [], memo: "아버님들 정장" },
  { category: "결혼식", name: "처제 2명, 동훈", total: 900000, unpaid: 900000, paidBy: [], memo: "각 30만원" },
  { category: "결혼식", name: "결혼식 축사 비용", total: 300000, unpaid: 300000, paidBy: [], memo: "" },
  { category: "플래너피", name: "플래너피", total: 259000, unpaid: 0, paidBy: ["김소윤", "이주엽"], memo: "" },
  { category: "스드메", name: "스드메 헬퍼비용", total: 600000, unpaid: 600000, paidBy: [], memo: "촬영 1회, 본식 1회 = 2회 헬퍼비용" },
  { category: "예복", name: "예복 예약금", total: 100000, unpaid: 0, paidBy: ["이주엽"], memo: "" },
  { category: "여행", name: "스페인 먹거리 및 여행 경비", total: 3425523, unpaid: 3425523, paidBy: [], memo: "예상 비용" },
  { category: "여행", name: "스페인 비행기", total: 2713800, unpaid: 0, paidBy: ["김소윤", "이주엽"], memo: "" },
  { category: "여행", name: "스페인 숙박", total: 2095247, unpaid: 2095247, paidBy: [], memo: "예상 비용" },
  { category: "스드메", name: "스튜디오 원본/수정본", total: 440000, unpaid: 440000, paidBy: [], memo: "" },
  { category: "스드메", name: "스드메 총 비용", total: 2751000, unpaid: 0, paidBy: [], memo: "예상 비용" },
  { category: "예물", name: "결혼 반지", total: 2560000, unpaid: 0, paidBy: ["이주엽"], memo: "" },
  { category: "예물", name: "가방", total: 6000000, unpaid: 6000000, paidBy: [], memo: "" },
  { category: "촬영", name: "헤어변형", total: 330000, unpaid: 220000, paidBy: ["김소윤"], memo: "" },
  { category: "결혼식", name: "부케", total: 300000, unpaid: 300000, paidBy: [], memo: "예상비용" },
  // 2026-09-20: 추정치(1,500만원)에서 실제 서면 견적 금액으로 교체. 디자인큐원 2026-09-19자
  // 견적서 34,140,167원(VAT 포함)이며, 금액이 비어 있던 공종이 전부 "해당 없음"(안방욕실)
  // 또는 "하지 않기로 함"(시스템에어컨·붙박이장·창호·설비)으로 정리돼 범위가 확정된 금액이다.
  { category: "신혼집", name: "신혼집 인테리어", total: 34140167, unpaid: 34140167, paidBy: [], memo: "(주)디자인큐원 2026-09-19 서면 견적 (VAT 포함, 범위 확정) — 아직 계약 전이라 업체를 바꾸거나 수량을 조정하면 달라질 수 있음" },
  { category: "신혼집", name: "신혼집 가구/가전", total: 0, unpaid: 0, paidBy: [], memo: "미정 — 붙박이장·시스템에어컨을 시공에서 뺐으므로 옷장과 에어컨은 여기서 사야 한다" },
  { category: "신혼집", name: "커튼/블라인드", total: 0, unpaid: 0, paidBy: [], memo: "미정 — 인테리어 견적에 없는 항목" },
  { category: "신혼집", name: "이사비", total: 0, unpaid: 0, paidBy: [], memo: "미정 — 입주청소는 인테리어 견적에 포함(396,000원)되어 있음" },
];

// 2026-09-06: 원래 대출/혼인신고 도메인 캘린더에 있었지만, 혼인신고·디딤돌대출 절차와
// 무관하고 예산 항목(스드메 지출)에 해당하는 일정이라 예산 관리 도메인으로 옮김
// (사용자가 홈 캘린더에서 도메인 색 구분이 안 된다고 지적하면서 — 드레스 가봉은
// 예산(초록)으로 분류돼야 한다고 확인).
export const events = [
  {
    id: "dress-fitting",
    title: "드레스 가봉",
    start: "2026-10-03",
    description: "드레스 가봉 — 오전 10시",
  },
  {
    id: "wedding-photoshoot",
    title: "웨딩 촬영",
    start: "2026-10-23",
    description: "웨딩 촬영 — 메종드힐, 오전 11시",
  },
];
