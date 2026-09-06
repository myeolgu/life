export const property = {
  name: "부개주공1단지",
  address: "인천광역시 부평구 부개동",
  unit: "107동 1001호",
  status: "매매 계약 완료 · 잔금 대기",
  closingDate: "2026-12-10",
  built: "1996년 11월",
  complex: "11개동, 1,044세대, 13~20층",
  pyeong: "25평 (전용 약 59㎡)",
  floorPlan: "미확보 — 추후 실측/도면 확보 필요",
};

// 2026-09-06: 공간(space)/우선순위/예상 기간/예상 비용 필드 추가.
// 비용은 시공업체 상담 전이라 실제 견적이 아니라 일반적 시세 기준 개략 범위다 — Scope() 하단
// 요약 박스와 화면에 "확정 금액 아님" 캐벗을 명시한다. 기간은 공사 진행 순서 탭 캘린더와 별개로,
// 항목 단독 작업 시 기준의 대략치(실제로는 여러 항목이 같은 날 겹쳐 진행됨).
export const scope = [
  { no: 1, item: "도배 전체", detail: "LX 베스띠 화이트 실크벽지, 벽 + 천장 전체", space: "공통", priority: "높음", duration: "3일", costRange: "150~200만원" },
  { no: 2, item: "장판 전체 교체", detail: "약 3.0T", space: "공통", priority: "높음", duration: "2일", costRange: "100~150만원" },
  { no: 3, item: "천장 몰딩", detail: "전체 교체", space: "공통", priority: "중간", duration: "1일", costRange: "50~80만원" },
  { no: 4, item: "걸레받이", detail: "전체 교체", space: "공통", priority: "낮음", duration: "1일", costRange: "30~50만원" },
  { no: 5, item: "문 교체", detail: "방문 3개 + 욕실문 1개 = 총 4개", space: "공통", priority: "중간", duration: "1일", costRange: "60~100만원" },
  { no: 6, item: "현관문", detail: "문 교체 X, 안쪽 인테리어 필름 시공", space: "현관", priority: "낮음", duration: "1일", costRange: "15~25만원" },
  { no: 7, item: "싱크대", detail: "전체 교체 X, 상판 교체 + 하부장 필름 시공", space: "주방", priority: "중간", duration: "1일", costRange: "80~150만원" },
  { no: 8, item: "베란다 바닥 타일", detail: "기존 타일 철거 포함, 전체 교체", space: "베란다", priority: "중간", duration: "1일", costRange: "80~120만원" },
  { no: 9, item: "현관 바닥 타일", detail: "기존 타일 철거 포함, 전체 교체", space: "현관", priority: "중간", duration: "1일", costRange: "40~70만원" },
  { no: 10, item: "콘센트 증설", detail: "약 3~4개 추가", space: "공통(전기)", priority: "낮음", duration: "1일", costRange: "20~40만원" },
  {
    no: 11,
    item: "화장실 전체 리모델링",
    detail: "철거, 방수, 벽/바닥 타일, 변기, 세면대, 수전, 천장, 환풍기, 조명 등 전체 교체",
    space: "욕실",
    priority: "높음",
    duration: "5일",
    costRange: "400~600만원",
  },
  { no: 12, item: "공통", detail: "기존 자재 철거비, 폐기물 처리비, 기본 마감 및 보수비 포함", space: "공통", priority: "높음", duration: "1일", costRange: "150~250만원" },
];

// 착공 예정일: 2026.12.12 (잔금일 2026.12.10 이후 — 사용자 확정, 2026-09-06)
// FullCalendar 규칙: end는 "포함하지 않는" 다음날짜다 (예: 12.13~12.14 이틀짜리 작업이면 end는 12.15).
export const events = [
  { id: "d1", title: "철거", start: "2026-12-12", description: "욕실 철거, 현관/베란다 타일 철거, 기존 문·몰딩 철거, 폐기물 반출" },
  { id: "d2-3", title: "욕실 방수", start: "2026-12-13", end: "2026-12-15", description: "욕실 방수 (1차·2차) 및 양생" },
  { id: "d4-5", title: "타일 시공", start: "2026-12-15", end: "2026-12-17", description: "욕실 벽/바닥, 베란다, 현관 타일 시공" },
  { id: "d6", title: "목공", start: "2026-12-17", description: "천장 몰딩, 문틀 보수, 걸레받이 밑작업" },
  { id: "d7", title: "전기 (콘센트 증설)", start: "2026-12-18", description: "콘센트 증설(3~4개) 및 배선 정리" },
  { id: "d8", title: "문 설치", start: "2026-12-19", description: "방문 3개, 욕실문 1개 설치" },
  { id: "d9", title: "필름 시공", start: "2026-12-20", description: "싱크대 하부장 필름, 현관문 안쪽 필름 시공" },
  { id: "d10-12", title: "도배", start: "2026-12-21", end: "2026-12-24", description: "벽 + 천장 전체(LX 베스띠 실크벽지), 건조 양생" },
  { id: "d13-14", title: "장판 시공", start: "2026-12-24", end: "2026-12-26", description: "장판 시공 (3.0T)" },
  { id: "d15", title: "걸레받이 마감", start: "2026-12-26", description: "걸레받이 최종 마감 설치" },
  { id: "d16", title: "욕실 마감", start: "2026-12-27", description: "변기, 세면대, 수전, 환풍기, 조명 설치 / 싱크대 상판 교체" },
  { id: "d17-18", title: "최종 점검·입주청소", start: "2026-12-28", end: "2026-12-30", description: "최종 점검, 하자보수 체크, 입주 청소" },
];

export const contractChecklist = [
  {
    no: 1,
    phrase: "'~일체(一切)'",
    explain:
      "모든 것을 해준다는 뜻으로 보이지만, 고객이 생각하는 범위와 업자가 생각하는 범위가 다름. '철거비 일체'에 폐기물 처리비·엘리베이터 보양비 등이 빠지는 경우가 대부분.",
    action: "모호한 용어 대신 철거비·폐기물 처리비 등 모든 항목을 개별로 명시하도록 요구",
  },
  {
    no: 2,
    phrase: "'~별도' / '추후 협의'",
    explain: "계약 후 업체가 추가금을 요구할 명분을 미리 만들어두는 공식 선언. 공사 중단 위협으로 인한 강제 지불 위험.",
    action: "모든 조건을 계약 시점에 확정하고, 불가피하면 반드시 상한선(예: '최대 500만원 미만') 명시",
  },
  {
    no: 3,
    phrase: "회사명만 명시된 자재",
    explain:
      "'LG 하우시스 바닥재'처럼 제품명·규격 없이 회사명만 기재. 같은 브랜드도 3만원대~30만원대까지 가격 편차가 커서 시공 당일 저가 자재로 바뀔 위험.",
    action: "자재명·브랜드·모델번호·규격까지 정확히 명시하도록 요구",
  },
  {
    no: 4,
    phrase: "부가가치세(VAT) 숨김",
    explain: "'부가세 별도'를 작은 글씨로 숨겨 실제 금액이 10% 더 붙는 경우 (예: 3,000만원 → 실제 3,300만원)",
    action: "첫 미팅에서 '부가세 포함 금액인가?' 확인, 모든 업체 견적을 부가세 포함 기준으로 비교",
  },
  {
    no: 5,
    phrase: "불균형한 대금 지급 조건",
    explain: "'공사 20% 진행 시 80% 선지급' 같은 구조로 고객 돈을 인질화. 하자 발생 시 고객이 약자 입장이 됨.",
    action: "잔금 최소 10% 이상 남기고, 공정률에 맞춰 4~5회로 분할 지급",
  },
];

// 2026-09-06 기준 조사한 시공업체 후보. 전부 아직 상담 전. 주소/거리 정보는 온라인 검색으로
// 확인한 것과 확인 안 된 것을 명확히 구분해뒀다 — 확인 안 된 업체는 상담 전 직접 재확인 필요.
export const contractors = [
  {
    no: 1,
    name: "미라클인테리어",
    address: "인천광역시 부평구 장제로381번길 2 (삼산동)",
    distance: "부개주공1단지와 같은 부평구 삼산동 — 가까운 편",
    contact: "032-556-7322 / 010-9090-7322 · miracleid.kr",
    note: "당근마켓에는 계양구 효성동 주소로도 등록돼 있어 지점/정보가 다를 수 있음 — 상담 전 정확한 위치 재확인 필요.",
    portfolioUrl: "https://ozip.me/BwBrAmB",
    verified: true,
  },
  {
    no: 2,
    name: "(주)디자인큐원",
    address: "인천광역시 부평구 원적로421번길 3 (산곡동)",
    distance: "부개주공1단지와 같은 부평구 산곡동 — 가까운 편",
    contact: "032-527-2461 · q1design.co.kr",
    note: "사용자가 직접 확인한 주소 (2026-09-06). 전화번호는 주소 일치로 확인(2026-09-06) — 상담 전화 시 한 번 더 확인 권장.",
    portfolioUrl: "https://ozip.me/Ey9G9Ch",
    verified: true,
  },
  {
    no: 3,
    name: "홈프렌드",
    address: "인천광역시 부평구 주부토로146번길 13-3 (갈산동)",
    distance: "부개주공1단지와 같은 부평구 갈산동 — 가까운 편",
    contact: "032-710-8782 (확인 신뢰도 낮음 — 출처 하나뿐)",
    note: "사용자가 직접 확인한 주소 (2026-09-06). 온라인에는 동명의 생활용품 쇼핑몰(대전 소재)만 나와서 헷갈리기 쉬우니 주의. 전화번호는 단일 출처로만 확인돼서 신뢰도가 낮음 — 상담 전 재확인 필요.",
    portfolioUrl: "https://ozip.me/umMrsZO",
    verified: true,
  },
  {
    no: 4,
    name: "미송디자인",
    address: "인천광역시 부평구 부개동 23-18",
    distance: "부개주공1단지와 같은 부개동 — 4곳 중 가장 가까움",
    contact: "070-4795-2127 (도로명: 부흥북로 123 1층)",
    note: "사용자가 직접 확인한 주소 (2026-09-06). 전화번호는 지번 주소 일치로 확인(2026-09-06).",
    portfolioUrl: "https://ozip.me/DlE2EdA",
    verified: true,
  },
];

export const progress = [
  { id: "interior:deal-done", done: true, label: "매매 계약 체결" },
  { id: "interior:balance-payment", done: false, label: "잔금 납부 및 입주 (예정: 2026.12.10)" },
  { id: "interior:site-survey", done: false, label: "현장 실측 / 정확한 평면도 확보" },
  { id: "interior:contractor-selected", done: false, label: "시공업체 선정 및 견적 비교 (계약/견적 체크리스트 확인)" },
  { id: "interior:start-date-fixed", done: true, label: "착공일 확정 (2026.12.12)" },
  { id: "interior:construction", done: false, label: "공사 진행" },
  { id: "interior:move-in-clean", done: false, label: "입주 청소 및 최종 점검" },
];
