import { useCallback, useEffect, useState } from "react";

// 2026-09-06: 앱을 열면(설치된 PWA 포함) "삶 관리" 홈(카테고리 선택 화면)이 먼저 보이게 한다.
// 한때 시공업체를 아직 못 골라서 인테리어로 바로 들어가게 했었지만, 도메인이 3개로 늘어난
// 지금은 홈이 먼저 보이는 게 자연스럽다고 사용자가 확인함.
const DEFAULT_VIEW = "home";

function getViewFromLocation() {
  const params = new URLSearchParams(window.location.search);
  return params.get("view") || DEFAULT_VIEW;
}

/**
 * view 상태를 브라우저 히스토리(URL의 ?view= 쿼리)와 동기화한다.
 * 이렇게 하지 않으면 앱 내 화면 전환이 히스토리에 안 쌓여서,
 * 뒤로가기를 눌렀을 때 앱 내부(기본 화면)가 아니라 사이트 진입 전 페이지로 바로 나가버린다.
 */
export function useRoute() {
  const [view, setView] = useState(getViewFromLocation);

  useEffect(() => {
    function onPopState() {
      setView(getViewFromLocation());
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((nextView) => {
    const url = new URL(window.location.href);
    if (nextView === DEFAULT_VIEW) {
      url.searchParams.delete("view");
    } else {
      url.searchParams.set("view", nextView);
    }
    window.history.pushState({ view: nextView }, "", url);
    setView(nextView);
  }, []);

  return [view, navigate];
}
