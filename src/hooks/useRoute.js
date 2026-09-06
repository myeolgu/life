import { useCallback, useEffect, useState } from "react";

// 시공업체를 아직 못 골라서, 앱을 열면(설치된 PWA 포함) 바로 인테리어로 들어가게 한다.
// 카테고리 선택 화면("home")은 각 도메인의 "← 홈으로" 버튼으로 여전히 갈 수 있다.
const DEFAULT_VIEW = "interior";

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
