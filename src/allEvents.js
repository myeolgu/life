import { events as interiorEvents } from "./domains/interior/data";
import { events as loanEvents } from "./domains/loan/data";

// 홈 화면 캘린더에서 도메인을 구분하는 색상/이름.
// 새 도메인에 events 배열이 생기면 여기 등록하고 아래 allEvents에도 합쳐준다.
export const domainMeta = {
  interior: { label: "인테리어", color: "#b4784a" },
  loan: { label: "대출·혼인신고", color: "#5b7df0" },
};

export const allEvents = [
  ...interiorEvents.map((e) => ({ ...e, id: `interior:${e.id}`, domain: "interior" })),
  ...loanEvents.map((e) => ({ ...e, id: `loan:${e.id}`, domain: "loan" })),
];
