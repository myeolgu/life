import { events as interiorSeed } from "./domains/interior/data";
import { events as loanSeed } from "./domains/loan/data";
import { useCalendarEvents } from "./hooks/useCalendarEvents";

// 홈 화면 캘린더에서 도메인을 구분하는 색상/이름 (순수 UI 메타데이터라 Supabase로 옮기지 않는다).
export const domainMeta = {
  interior: { label: "인테리어", color: "#b4784a" },
  loan: { label: "대출·혼인신고", color: "#5b7df0" },
};

/**
 * 모든 도메인의 캘린더 이벤트(Supabase calendar_events 테이블)를 합쳐서 반환한다.
 * 새 도메인에 날짜 있는 일정이 생기면 여기에 useCalendarEvents 호출을 추가하고 합쳐준다.
 */
export function useAllEvents() {
  const { events: interiorEvents } = useCalendarEvents("interior", interiorSeed);
  const { events: loanEvents } = useCalendarEvents("loan", loanSeed);

  return [
    ...interiorEvents.map((e) => ({ ...e, id: `interior:${e.id}`, domain: "interior" })),
    ...loanEvents.map((e) => ({ ...e, id: `loan:${e.id}`, domain: "loan" })),
  ];
}
