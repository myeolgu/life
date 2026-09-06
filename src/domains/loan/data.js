export const finance = {
  events: [
    { date: "2026-09-01", desc: "혼인신고 접수 (서초구청)" },
    { date: "2026-09-11 ~ 09-15 (예상)", desc: "혼인관계증명서 발급 가능 시점 (접수 후 10~14일 소요)" },
    { date: "증명서 발급 후", desc: "신혼부부 디딤돌대출 신청 진행" },
  ],
  loanSummary: [
    "대상: 무주택 세대주, 부부합산 연소득 8,500만원 이하, 부부합산 순자산 5.11억원 이하",
    "대상 주택: 전용 85㎡ 이하 (신혼·2자녀 이상은 6억원 이하 주택까지 가능)",
    "대출 한도: 최대 3.2억원 (저가주택 매입 시 예외 조항 있음)",
    "금리: 연 2.85%~4.15% (2026년 1월 기준, 소득·기간별 변동)",
    "심사 기준: LTV 최대 70%, DTI 최대 60%",
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
];

export const progress = [
  { id: "loan:marriage-filed", done: true, label: "혼인신고 접수 (2026-09-01, 서초구청)" },
  { id: "loan:marriage-cert-issued", done: false, label: "혼인관계증명서 발급 (예상 2026-09-11~15)" },
  { id: "loan:loan-approved", done: false, label: "디딤돌대출 신청 및 승인" },
];
