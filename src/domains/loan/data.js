export const finance = {
  events: [
    { date: "2026-09-01", desc: "혼인신고 접수 (서초구청)" },
    { date: "2026-09-11 ~ 09-15 (예상)", desc: "혼인관계증명서 발급 가능 시점 (접수 후 10~14일 소요)" },
    { date: "2026-09-15 (권장)", desc: "기금e든든에서 자산심사 먼저 신청 — 증명서 발급 즉시 시작. 통과까지 며칠~수주 소요될 수 있음" },
    { date: "2026-10-20 (권장)", desc: "디딤돌대출 정식 신청 (기금e든든 접수). 잔금일(12/10) 기준 약 7주 전 — 너무 이르면 아래 '70일 캡'에 걸릴 수 있음" },
    { date: "2026-12-03 (권장)", desc: "우리은행 방문 — 서류 제출/약정, 잔금일에 맞춰 실행일 사전 협의" },
    { date: "2026-12-10", desc: "잔금일 — 대출 실행 목표일" },
  ],
  loanSummary: [
    "대상: 무주택 세대주, 부부합산 연소득 8,500만원 이하, 부부합산 순자산 5.11억원 이하",
    "대상 주택: 전용 85㎡ 이하 (신혼·2자녀 이상은 6억원 이하 주택까지 가능)",
    "대출 한도: 최대 3.2억원 (저가주택 매입 시 예외 조항 있음)",
    "금리: 연 2.85%~4.15% (2026년 1월 기준, 소득·기간별 변동)",
    "심사 기준: LTV 최대 70%, DTI 최대 60%",
    "⚠️ 처리기한 규정(HF 업무처리기준, 확인 필요): 접수일로부터 승인까지 최대 40일, 승인 후 실행까지 최대 30일, 총 접수~실행 70일 캡 — 너무 일찍 접수하면 캡이 잔금일 전에 만료돼 자동 취소될 수 있으니 접수 시점은 잔금일 6~8주 전이 안전권",
  ],
  // 은행/기금e든든에 부부가 함께 내는 서류는 group: "공통", 각자 본인 것을 따로 준비해야 하는
  // 서류는 group: "남편"/"아내"로 나눠서 각자 한 부씩 넣어둔다.
  documents: [
    { id: "loan:marriage-cert", label: "혼인관계증명서 (발급 후)", group: "공통" },
    { id: "loan:resident-reg", label: "주민등록등본/초본", group: "공통" },
    { id: "loan:sale-contract", label: "매매계약서 사본", group: "공통" },
    { id: "loan:registry", label: "등기부등본", group: "공통" },
    { id: "loan:net-worth", label: "부부 순자산 확인 서류", group: "공통" },
    { id: "loan:family-cert-husband", label: "가족관계증명서", group: "남편" },
    { id: "loan:income-proof-husband", label: "소득 증빙 (원천징수영수증 또는 소득금액증명원)", group: "남편" },
    { id: "loan:employment-cert-husband", label: "재직증명서", group: "남편" },
    { id: "loan:family-cert-wife", label: "가족관계증명서", group: "아내" },
    { id: "loan:income-proof-wife", label: "소득 증빙 (원천징수영수증 또는 소득금액증명원)", group: "아내" },
    { id: "loan:employment-cert-wife", label: "재직증명서", group: "아내" },
  ],
};

export const events = [
  { id: "marriage-filed", title: "혼인신고 접수", start: "2026-09-01", description: "서초구청에 혼인신고 접수" },
  {
    id: "cert-expected",
    title: "혼인관계증명서 발급 예상",
    start: "2026-09-11",
    end: "2026-09-16",
    description: "접수 후 10~14일 소요 예상. 발급되면 신혼부부 디딤돌대출 신청을 진행한다.",
  },
  {
    id: "asset-review-start",
    title: "자산심사 신청 (권장)",
    start: "2026-09-15",
    description: "기금e든든에서 자산심사 먼저 신청 — 혼인관계증명서 발급 즉시 시작. 통과까지 며칠~수주 소요될 수 있음.",
  },
  {
    id: "loan-apply-recommended",
    title: "디딤돌대출 정식 신청 (권장)",
    start: "2026-10-20",
    description:
      "기금e든든에서 정식 대출신청(접수). 잔금일(12/10) 기준 약 7주 전 — HF 처리기한 규정(확인 필요)상 접수~실행 70일 캡이 있어서, 너무 일찍 접수하면 캡이 잔금일 전에 만료돼 자동 취소될 위험이 있다. 6~8주 전이 안전권.",
  },
  {
    id: "woori-bank-visit",
    title: "우리은행 방문 (권장)",
    start: "2026-12-03",
    description: "서류 제출 및 약정. 잔금일(12/10)에 맞춰 대출 실행일을 은행과 사전 협의.",
  },
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

export const progress = [
  { id: "loan:marriage-filed", done: true, label: "혼인신고 접수 (2026-09-01, 서초구청)" },
  { id: "loan:marriage-cert-issued", done: false, label: "혼인관계증명서 발급 (예상 2026-09-11~15)" },
  { id: "loan:loan-approved", done: false, label: "디딤돌대출 신청 및 승인" },
];
