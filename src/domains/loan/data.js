// 2026-09-06 웹 리서치(기금e든든/HF 공식 안내 + 실제 이용자 후기·질문글 종합) 반영해서 일정 재조정.
// 핵심 근거:
// - 사전자산심사: 접수 후 1~5일 내 결과 (빠르면 익일)
// - 정식신청 후 승인까지 통상 1~2주, 승인~은행 약정~실행까지 추가 1~2주 (서류 미비 시 지연)
// - 은행 방문(약정체결)은 "잔금일 30일 전"이 널리 권장되는 기준 — 기존 계획(잔금 7일 전)은 너무 촉박했음
// - 등본/초본/가족관계증명서/등기부등본/전입세대확인서 등은 "발급 후 1개월 이내"만 유효 → 너무 일찍 떼면 재발급 필요
export const finance = {
  events: [
    { date: "2026-09-01", desc: "혼인신고 접수 (서초구청)" },
    { date: "2026-09-11 ~ 09-15 (예상)", desc: "혼인관계증명서 발급 가능 시점 (접수 후 10~14일 소요)" },
    { date: "2026-09-15 (권장)", desc: "기금e든든에서 자산심사 먼저 신청 — 증명서 발급 즉시 시작. 통상 1~5일 내 결과" },
    { date: "2026-10-13 (권장)", desc: "디딤돌대출 정식 신청 (기금e든든 접수, 서류 제출). 서류(등본·초본 등)는 이 시점 기준 1~2주 전에 발급 — 1개월 유효기간 안에 은행 약정까지 커버되도록" },
    { date: "2026-11-03 (권장)", desc: "우리은행 방문 — 대출 약정 체결. 잔금일(12/10) 기준 약 37일 전 (권장 기준인 '잔금일 30일 전'보다 여유 확보), 정식신청 후 3주 뒤라 심사·승인 기간도 충분" },
    { date: "2026-12-10", desc: "잔금일 — 대출 실행(송금) 목표일. 약정일(11/3)로부터 5주 이상 지나므로, 서류 유효기간(1개월) 초과분은 은행에 재제출 필요 여부 확인" },
  ],
  loanSummary: [
    "대상: 무주택 세대주, 부부합산 연소득 8,500만원 이하, 부부합산 순자산 5.11억원 이하",
    "대상 주택: 전용 85㎡ 이하 (신혼·2자녀 이상은 6억원 이하 주택까지 가능)",
    "대출 한도: 최대 3.2억원 (저가주택 매입 시 예외 조항 있음)",
    "금리: 연 2.85%~4.15% (2026년 1월 기준, 소득·기간별 변동)",
    "심사 기준: LTV 최대 70%, DTI 최대 60%",
    "⚠️ 처리기간 참고(후기·커뮤니티 종합, 정확한 규정·기한은 은행 상담 시 재확인): 사전자산심사 1~5일 → 정식신청~승인 통상 1~2주 → 승인~은행 약정~실행 추가 1~2주. 서류 미비/오류 시 지연될 수 있음",
    "⚠️ 은행 방문(약정체결)은 잔금일 최소 30일 전이 안전권 — 너무 늦게 가면(예: 잔금 1주 전) 승인기한 내 실행을 못 맞출 위험. 반대로 서류(등본·초본 등)는 1개월 이내 발급분만 유효하니 너무 일찍 떼어두지 않기",
  ],
  // 2026-09-06 기준: "공통" 그룹 없이 전부 남편/아내 각자 몫으로 나눔 (부부 공동 서류도 각자 1부씩 준비).
  // 괄호 안 유효기간은 리서치 기준 "발급 후 1개월 이내"가 일반적 — 은행 방문(11/3) 1~2주 전 발급 권장.
  documents: [
    { id: "loan:doc-idcard-husband", label: "신분증 사본", group: "남편" },
    { id: "loan:doc-resident-reg-husband", label: "주민등록등본 (발급 1개월 이내)", group: "남편" },
    { id: "loan:doc-resident-detail-husband", label: "주민등록초본 (발급 1개월 이내)", group: "남편" },
    { id: "loan:doc-family-cert-husband", label: "가족관계증명서 (발급 1개월 이내)", group: "남편" },
    { id: "loan:doc-marriage-cert-husband", label: "혼인관계증명서 상세 (발급 1개월 이내, 우대금리용)", group: "남편" },
    { id: "loan:doc-sale-contract-husband", label: "매매계약서 사본", group: "남편" },
    { id: "loan:doc-registry-husband", label: "등기사항전부증명서 (등기부등본, 발급 1개월 이내)", group: "남편" },
    { id: "loan:doc-move-in-husband", label: "전입세대확인서 (동거인 포함, 발급 1개월 이내)", group: "남편" },
    { id: "loan:doc-income-husband", label: "소득 증빙 (원천징수영수증 또는 소득금액증명원)", group: "남편" },
    { id: "loan:doc-employment-husband", label: "재직증명서 (또는 사업자등록증 사본)", group: "남편" },
    { id: "loan:doc-networth-husband", label: "본인 자산 확인 서류 (예금잔액증명서 등, 순자산 심사용)", group: "남편" },
    { id: "loan:doc-idcard-wife", label: "신분증 사본", group: "아내" },
    { id: "loan:doc-resident-reg-wife", label: "주민등록등본 (발급 1개월 이내)", group: "아내" },
    { id: "loan:doc-resident-detail-wife", label: "주민등록초본 (발급 1개월 이내)", group: "아내" },
    { id: "loan:doc-family-cert-wife", label: "가족관계증명서 (발급 1개월 이내)", group: "아내" },
    { id: "loan:doc-marriage-cert-wife", label: "혼인관계증명서 상세 (발급 1개월 이내, 우대금리용)", group: "아내" },
    { id: "loan:doc-sale-contract-wife", label: "매매계약서 사본", group: "아내" },
    { id: "loan:doc-registry-wife", label: "등기사항전부증명서 (등기부등본, 발급 1개월 이내)", group: "아내" },
    { id: "loan:doc-move-in-wife", label: "전입세대확인서 (동거인 포함, 발급 1개월 이내)", group: "아내" },
    { id: "loan:doc-income-wife", label: "소득 증빙 (원천징수영수증 또는 소득금액증명원)", group: "아내" },
    { id: "loan:doc-employment-wife", label: "재직증명서 (또는 사업자등록증 사본)", group: "아내" },
    { id: "loan:doc-networth-wife", label: "본인 자산 확인 서류 (예금잔액증명서 등, 순자산 심사용)", group: "아내" },
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
    start: "2026-10-13",
    description:
      "기금e든든에서 정식 대출신청(접수, 서류 제출). 자산심사(9/15) 적격판정 후 여유있게 진행. 등본·초본 등 유효기간 1개월인 서류는 이 시점 1~2주 전에 발급받아 은행 약정(11/3)까지 유효하게 맞춘다.",
  },
  {
    id: "woori-bank-visit",
    title: "우리은행 방문 · 대출 약정 (권장)",
    start: "2026-11-03",
    description:
      "서류 제출 및 대출 약정 체결. 잔금일(12/10) 기준 약 37일 전 — 후기·커뮤니티에서 권장하는 '잔금일 30일 전' 기준보다 여유를 확보한 날짜. 정식신청(10/13) 후 3주 뒤라 온라인 심사·승인 기간도 충분하다. 실행(송금)일은 여기서 잔금일(12/10)로 은행과 사전 협의.",
  },
  {
    id: "loan-disbursement-target",
    title: "대출 실행 · 잔금 지급일",
    start: "2026-12-10",
    description:
      "디딤돌대출 실행일 = 잔금 지급일 목표. 약정일(11/3)로부터 5주 이상 지나므로, 발급 유효기간이 1개월인 서류(등본·초본·가족관계증명서 등)는 재발급/재제출 필요 여부를 은행에 미리 확인.",
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
