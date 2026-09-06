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
  // 2026-09-06 최초 작성 시엔 "공통" 그룹 없이 전부 각자 몫으로 나눴었으나,
  // 매매계약서 사본은 부부 공동 서류라 한 부만 있으면 되므로 2026-09-06에 "공통" 그룹으로 분리함.
  // 나머지(등본/초본/가족관계증명서 등)는 여전히 각자 1부씩 필요.
  // 괄호 안 유효기간은 리서치 기준 "발급 후 1개월 이내"가 일반적 — 은행 방문(11/3) 1~2주 전 발급 권장.
  documents: [
    { id: "loan:doc-sale-contract", label: "매매계약서 사본", group: "공통" },
    { id: "loan:doc-idcard-husband", label: "신분증 사본", group: "남편" },
    { id: "loan:doc-resident-reg-husband", label: "주민등록등본 (발급 1개월 이내)", group: "남편" },
    { id: "loan:doc-resident-detail-husband", label: "주민등록초본 (발급 1개월 이내)", group: "남편" },
    { id: "loan:doc-family-cert-husband", label: "가족관계증명서 (발급 1개월 이내)", group: "남편" },
    { id: "loan:doc-marriage-cert-husband", label: "혼인관계증명서 상세 (발급 1개월 이내, 우대금리용)", group: "남편" },
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
    { id: "loan:doc-registry-wife", label: "등기사항전부증명서 (등기부등본, 발급 1개월 이내)", group: "아내" },
    { id: "loan:doc-move-in-wife", label: "전입세대확인서 (동거인 포함, 발급 1개월 이내)", group: "아내" },
    { id: "loan:doc-income-wife", label: "소득 증빙 (원천징수영수증 또는 소득금액증명원)", group: "아내" },
    { id: "loan:doc-employment-wife", label: "재직증명서 (또는 사업자등록증 사본)", group: "아내" },
    { id: "loan:doc-networth-wife", label: "본인 자산 확인 서류 (예금잔액증명서 등, 순자산 심사용)", group: "아내" },
  ],
  // 2026-09-06 웹 리서치 — 서류별 발급처/유효기간. HF·기금e든든 공식 페이지에는
  // 서류별 유효기간을 명시한 표가 없어서(직접 확인함), "은행 관행상 통상 N개월"이라고
  // 적은 항목은 디딤돌대출 특화 규정이 아니라 부동산담보대출 업계 관행이다 — 신청 전
  // 반드시 담당 은행/기금e든든에 재확인. 전부 실제 검색으로 찾은 출처(url)만 포함.
  documentGuide: [
    {
      doc: "주민등록등본",
      office: "정부24(온라인)·무인발급기·주민센터",
      validity: "통상 1~3개월 이내 — 자료마다 혼재, 공식 규정 없음",
      source: "디딤돌대출 준비서류 총정리 (morningstudy.com)",
      url: "https://morningstudy.com/%EB%94%94%EB%94%A4%EB%8F%8C%EB%8C%80%EC%B6%9C-%EC%A4%80%EB%B9%84%EC%84%9C%EB%A5%98/",
    },
    {
      doc: "주민등록초본",
      office: "정부24·무인발급기·주민센터",
      validity: "법적 유효기간 없음, 은행 관행상 통상 3개월 이내",
      source: "주민등록초본 유효기간·발급방법 정리 (ajd.co.kr)",
      url: "https://www.ajd.co.kr/contents/basic-tip/detail/%EC%A3%BC%EB%AF%BC%EB%93%B1%EB%A1%9D%EC%B4%88%EB%B3%B8_%EC%9C%A0%ED%9A%A8%EA%B8%B0%EA%B0%84_%EB%B0%9C%EA%B8%89%EB%B0%A9%EB%B2%95_%ED%95%9C%EB%B2%88%EC%97%90_%EC%A0%95%EB%A6%AC-75244",
    },
    {
      doc: "가족관계증명서",
      office: "대법원 전자가족관계등록시스템(efamily.scourt.go.kr)·정부24·주민센터",
      validity: "법적 규정 없음, 은행 관행상 통상 3개월 이내 (일부 1개월 요구 사례도 있음)",
      source: "가족관계증명서 유효기간이 3개월인 이유? (a-ha 질문답변)",
      url: "https://www.a-ha.io/questions/4ed8ee923257926f831eab98b5489c51",
    },
    {
      doc: "혼인관계증명서 (상세)",
      office: "대법원 전자가족관계등록시스템·정부24",
      validity: "확인 안 됨 — 가족관계증명서와 동일하게 통상 3개월 이내로 추정",
      source: "가족관계등록부등의 증명서 발급 (정부24)",
      url: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=97400000004",
    },
    {
      doc: "등기사항전부증명서 (등기부등본)",
      office: "대법원 인터넷등기소 (iros.go.kr)",
      validity: "통상 1~3개월 이내 — 자료마다 혼재, 공식 규정 없음",
      source: "등기사항증명서 (나무위키)",
      url: "https://namu.wiki/w/%EB%93%B1%EA%B8%B0%EC%82%AC%ED%95%AD%EC%A6%9D%EB%AA%85%EC%84%9C",
    },
    {
      doc: "전입세대확인서 (동거인 포함)",
      office: "읍/면/동 주민센터 방문 필수 — 정부24 온라인 발급 불가, 대리 발급 시 위임장 필요",
      validity: "확인 안 됨 — 은행 관행상 통상 1개월 이내로 추정",
      source: "전입세대확인서 열람(발급) 안내 (정부24)",
      url: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=13100000305",
    },
    {
      doc: "소득 증빙 (원천징수영수증/소득금액증명원)",
      office: "원천징수영수증: 재직 회사 발급(직인 필수) / 소득금액증명원: 국세청 홈택스(hometax.go.kr)",
      validity: "통상 전년도분 제출, 신규 입사자는 최근 3개월 급여명세로 갈음 가능 — HF 세부 규정 원문 확인 실패",
      source: "소득금액증명원 발급 방법과 과세기간 선택 기준 (govmanual.com)",
      url: "https://govmanual.com/2026/08/11/income-certificate-hometax/",
    },
    {
      doc: "재직증명서 (또는 사업자등록증 사본)",
      office: "재직증명서: 재직 회사 발급(직인 필수) / 사업자등록증: 홈택스 온라인 발급 또는 보유분 사본",
      validity: "확인 안 됨 — 은행 관행상 통상 1개월 이내",
      source: "디딤돌대출 준비서류 총정리 (morningstudy.com)",
      url: "https://morningstudy.com/%EB%94%94%EB%94%A4%EB%8F%8C%EB%8C%80%EC%B6%9C-%EC%A4%80%EB%B9%84%EC%84%9C%EB%A5%98/",
    },
    {
      doc: "예금잔액증명서 등 자산 확인 서류",
      office: "거래 은행 영업점·온라인/모바일뱅킹 (발급 즉시 해당 계좌 익영업일까지 입출금 제한)",
      validity: "확인 안 됨 — 신청일 당일/직전 발급본 제출이 관행",
      source: "잔고증명서(잔액증명서)에 대한 모든 것 (help-me.kr)",
      url: "https://www.help-me.kr/blog/article/%EC%9E%94%EC%95%A1%EC%A6%9D%EB%AA%85%EC%84%9C%EC%9D%98_%EB%AA%A8%EB%93%A0_%EA%B2%83/",
    },
    {
      doc: "매매계약서 사본",
      office: "별도 발급기관 없음 — 계약 당사자/공인중개사 보관본 사본",
      validity: "개념상 없음 (참고: 소유권 이전등기일로부터 3개월 이내 대출 신청이라는 별개 조건은 있음 — 계약서 자체 유효기간 아님)",
      source: "신청절차 (한국주택금융공사, hf.go.kr)",
      url: "https://www.hf.go.kr/ko/sub01/sub01_02_02.do",
    },
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
];

export const progress = [
  { id: "loan:marriage-filed", done: true, label: "혼인신고 접수 (2026-09-01, 서초구청)" },
  { id: "loan:marriage-cert-issued", done: false, label: "혼인관계증명서 발급 (예상 2026-09-11~15)" },
  { id: "loan:loan-approved", done: false, label: "디딤돌대출 신청 및 승인" },
];

// 2026-09-06 웹 리서치 — 공식 조건/일정(finance.loanSummary)과 별개로,
// 실제 이용자 후기/커뮤니티 질문답변/뉴스기사/유튜브 영상에서 모은 실전 팁·함정만 추림.
// 전부 실제 검색으로 확인한 출처(url)만 포함 — 링크를 지어내지 않음.
export const tips = [
  {
    type: "후기",
    title: "적격 판정 뒤집은 사례 — 부적격 나와도 이의신청 가능",
    summary:
      "기금e든든에서 최초 부적격 판정을 받았지만 이의신청 후 적격으로 뒤집힌 실제 사례가 있다. 다만 이의신청 절차를 거치느라 시간이 지체되면서 승인기한이 촉박해질 수 있으니, 판정 결과가 나오는 대로 바로 확인하고 대응하는 게 좋다.",
    source: "아하(a-ha) 질문답변",
    url: "https://www.a-ha.io/questions/40df7d47480a492c93385cf02abcc275",
  },
  {
    type: "후기",
    title: "대출승인일-잔금일 차이가 크면 '실행일만 변경'보다 재신청이 마음 편하다",
    summary:
      "대출 승인기한과 실제 잔금일 사이 간격이 한 달 가까이 벌어졌던 신청자 사례. 은행 담당자는 '승인만 기한 내 받고 실행일을 잔금일로 늦추면 된다'고 안내했지만, 실제 이용자들은 '담당자가 실행일 변경을 깜빡할 위험' 등을 이유로 아예 취소 후 재신청하는 쪽을 택했다.",
    source: "블라인드(Blind) 부동산 게시판",
    url: "https://www.teamblind.com/kr/post/%EB%82%B4%EC%A7%91%EB%A7%88%EB%A0%A8%EB%94%94%EB%94%A4%EB%8F%8C%EB%8C%80%EC%B6%9C-%E2%80%98%EB%8C%80%EC%B6%9C-%EC%8A%B9%EC%9D%B8-30%EC%9D%BC-%EC%9D%B4%EB%82%B4-%EB%8C%80%EC%B6%9C-%EC%8B%A4%ED%96%89-%ED%95%AD%EB%AA%A9-%EA%B4%80%EB%A0%A8-%EC%A7%88%EB%AC%B8%EB%93%9C%EB%A6%BD%EB%8B%88%EB%8B%A4-c4tm1UJe",
  },
  {
    type: "후기",
    title: "대출실행일 앞당기기, 은행마다 태도가 다르다",
    summary:
      "기금 신청~은행 방문 간격이 늘어난 절차 변경 이후, 대출실행일을 잔금일에 맞춰 앞당길 수 있는지 여러 은행에 문의한 후기. 대부분 은행이 거절했고 주거래은행 등 일부에서만 개별 협의로 가능했다는 경험담 — 은행을 정할 때 이 유연성도 미리 확인해볼 만하다.",
    source: "블라인드(Blind) 부동산 게시판",
    url: "https://www.teamblind.com/kr/post/%EC%9D%80%ED%96%89%ED%98%95%EB%93%A4-%EB%8F%84%EC%99%80%EC%A4%98-%EB%94%94%EB%94%A4%EB%8F%8C%EB%8C%80%EC%B6%9C-%EB%B0%94%EB%80%90%EA%B1%B0-%EC%A7%88%EB%AC%B8-KYUrRtoN",
  },
  {
    type: "후기",
    title: "은행 방문일, 서류 서명만 1시간 가까이 걸릴 수 있다",
    summary:
      "기금e든든 적격 판정 후 은행 방문 시 제출 서류와 대출 신청서 분량이 많아 서명에만 거의 1시간이 걸렸다는 실사용 후기. 방문 시간을 여유 있게 잡아두는 게 좋다.",
    source: "기금e든든 디딤돌 대출 후기 블로그",
    url: "https://blog.kimsfactory.com/entry/11899",
  },
  {
    type: "기사",
    title: "디딤돌대출 방공제 의무 적용 — 수도권 아파트는 한도 계산 시 유의",
    summary:
      "국토교통부가 디딤돌대출의 '방공제'(최우선변제금 공제) 면제를 원칙적으로 제한하는 관리방안을 수도권 소재 아파트에 한해 시행 중이다(2024-12-02 신규 신청분부터 적용, 지방/비아파트는 대상 아님). 매입 아파트에 기존 임차인이 있으면 방공제 없이는 대출이 어려울 수 있어, 수도권 아파트를 매입하는 경우 대출 한도를 보수적으로 잡아두는 게 안전하다.",
    source: "한국건설신문(hkbs)",
    url: "https://www.hkbs.co.kr/news/articleView.html?idxno=777360",
  },
  {
    type: "기사",
    title: "2026년 하반기 디딤돌대출 한도 변경 임박 — 잔금일 조율이 관건",
    summary:
      "정책모기지 한도가 매년 7월 1일 또는 1월 1일 자로 조정되는 경우가 많고, 시행 약 30일 전 사전 공지되는 패턴이다. 한도가 축소되는 방향으로 개편될 가능성이 거론되고 있어, 변경 시행일 이전으로 잔금일(대출 실행일)을 맞추는 것이 유리하다는 분석 — 실제 시행 여부/시점은 국토교통부 고시로 최종 확정되므로 계약 후에도 주기적으로 재확인이 필요하다.",
    source: "머니룩(asiatop)",
    url: "https://asiatop.co.kr/gov-support/didimdol-2026-h2-limit-change-checklist/",
  },
  {
    type: "유튜브",
    title: "내일부터 신혼부부 버팀목·디딤돌대출 소득요건 완화",
    summary:
      "신혼부부 대상 버팀목/디딤돌대출의 소득요건이 완화된다는 내용을 다룬 뉴스 영상. 정책 소득기준은 수시로 바뀌므로, 신청 직전 이런 채널에서 최신 개편 소식을 한 번 더 검색해 확인해볼 만하다.",
    source: "연합뉴스TV(YonhapnewsTV) 유튜브",
    url: "https://www.youtube.com/watch?v=2pVrGK9oWvg",
  },
  {
    type: "유튜브",
    title: "[HF 주택담보대출] 디딤돌대출 신청방법! 이 영상을 따라해보세요",
    summary:
      "한국주택금융공사 공식 채널의 디딤돌대출 신청 단계별 안내 영상. 기금e든든 화면을 직접 보여주며 따라 하도록 구성되어 있어, 처음 신청 화면을 접하기 전 미리 흐름을 익혀두기 좋다.",
    source: "한국주택금융공사 유튜브",
    url: "https://www.youtube.com/watch?v=Sy9gNQAe-wE",
  },
  {
    type: "정보",
    title: "혼인신고는 온라인만으로 완결되지 않는다",
    summary:
      "전자가족관계등록시스템은 증명서 발급 등에는 온라인을 지원하지만, 혼인신고 자체는 증인 2인의 서명(또는 날인)과 신고인 본인확인이 필요해 방문 또는 우편 접수만 가능하다. '온라인으로 다 끝난다'고 착각하지 말고 증인 서명을 미리 받아 서류를 준비해갈 것.",
    source: "대법원 전자가족관계등록시스템",
    url: "https://efamily.scourt.go.kr/cs/CsBltnWrtGuide.do?bltnbordId=0000008&guideCd=0000008007&guideYn=Y",
  },
];
