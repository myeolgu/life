export const property = {
  name: "부개주공1단지",
  address: "인천광역시 부평구 부개동",
  unit: "107동 1001호",
  dealDate: "2025-12-10",
  status: "매매 완료",
  built: "1996년 11월",
  complex: "11개동, 1,044세대, 13~20층",
  pyeong: "25평 (전용 약 59㎡)",
  floorPlan: "미확보 — 추후 실측/도면 확보 필요",
};

export const scope = [
  { no: 1, item: "도배 전체", detail: "LX 베스띠 화이트 실크벽지, 벽 + 천장 전체" },
  { no: 2, item: "장판 전체 교체", detail: "약 3.0T" },
  { no: 3, item: "천장 몰딩", detail: "전체 교체" },
  { no: 4, item: "걸레받이", detail: "전체 교체" },
  { no: 5, item: "문 교체", detail: "방문 3개 + 욕실문 1개 = 총 4개" },
  { no: 6, item: "현관문", detail: "문 교체 X, 안쪽 인테리어 필름 시공" },
  { no: 7, item: "싱크대", detail: "전체 교체 X, 상판 교체 + 하부장 필름 시공" },
  { no: 8, item: "베란다 바닥 타일", detail: "기존 타일 철거 포함, 전체 교체" },
  { no: 9, item: "현관 바닥 타일", detail: "기존 타일 철거 포함, 전체 교체" },
  { no: 10, item: "콘센트 증설", detail: "약 3~4개 추가" },
  {
    no: 11,
    item: "화장실 전체 리모델링",
    detail: "철거, 방수, 벽/바닥 타일, 변기, 세면대, 수전, 천장, 환풍기, 조명 등 전체 교체",
  },
  { no: 12, item: "공통", detail: "기존 자재 철거비, 폐기물 처리비, 기본 마감 및 보수비 포함" },
];

// 착공 예정일: 2026.09.20 (가정 — 실제 착공일이 다르면 이 배열을 다시 계산해서 갱신할 것)
// FullCalendar 규칙: end는 "포함하지 않는" 다음날짜다 (예: 09.21~09.22 이틀짜리 작업이면 end는 09.23).
export const events = [
  { id: "d1", title: "철거", start: "2026-09-20", description: "욕실 철거, 현관/베란다 타일 철거, 기존 문·몰딩 철거, 폐기물 반출" },
  { id: "d2-3", title: "욕실 방수", start: "2026-09-21", end: "2026-09-23", description: "욕실 방수 (1차·2차) 및 양생" },
  { id: "d4-5", title: "타일 시공", start: "2026-09-23", end: "2026-09-25", description: "욕실 벽/바닥, 베란다, 현관 타일 시공" },
  { id: "d6", title: "목공", start: "2026-09-25", description: "천장 몰딩, 문틀 보수, 걸레받이 밑작업" },
  { id: "d7", title: "전기 (콘센트 증설)", start: "2026-09-26", description: "콘센트 증설(3~4개) 및 배선 정리" },
  { id: "d8", title: "문 설치", start: "2026-09-27", description: "방문 3개, 욕실문 1개 설치" },
  { id: "d9", title: "필름 시공", start: "2026-09-28", description: "싱크대 하부장 필름, 현관문 안쪽 필름 시공" },
  { id: "d10-12", title: "도배", start: "2026-09-29", end: "2026-10-02", description: "벽 + 천장 전체(LX 베스띠 실크벽지), 건조 양생" },
  { id: "d13-14", title: "장판 시공", start: "2026-10-02", end: "2026-10-04", description: "장판 시공 (3.0T)" },
  { id: "d15", title: "걸레받이 마감", start: "2026-10-04", description: "걸레받이 최종 마감 설치" },
  { id: "d16", title: "욕실 마감", start: "2026-10-05", description: "변기, 세면대, 수전, 환풍기, 조명 설치 / 싱크대 상판 교체" },
  { id: "d17-18", title: "최종 점검·입주청소", start: "2026-10-06", end: "2026-10-08", description: "최종 점검, 하자보수 체크, 입주 청소" },
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

export const progress = [
  { id: "interior:deal-done", done: true, label: "아파트 매매 완료 (2025-12-10)" },
  { id: "interior:site-survey", done: false, label: "현장 실측 / 정확한 평면도 확보" },
  { id: "interior:contractor-selected", done: false, label: "시공업체 선정 및 견적 비교 (계약/견적 체크리스트 확인)" },
  { id: "interior:start-date-fixed", done: false, label: "착공일 확정 (예정: 2026.09.20)" },
  { id: "interior:construction", done: false, label: "공사 진행" },
  { id: "interior:move-in-clean", done: false, label: "입주 청소 및 최종 점검" },
];
