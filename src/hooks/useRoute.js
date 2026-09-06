import { useCallback, useEffect, useState } from "react";

function getViewFromLocation() {
  const params = new URLSearchParams(window.location.search);
  return params.get("view") || "home";
}

/**
 * view 상태를 브라우저 히스토리(URL의 ?view= 쿼리)와 동기화한다.
 * 이렇게 하지 않으면 앱 내 화면 전환이 히스토리에 안 쌓여서,
 * 뒤로가기를 눌렀을 때 앱 내부(홈 화면)가 아니라 사이트 진입 전 페이지로 바로 나가버린다.
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
    if (nextView === "home") {
      url.searchParams.delete("view");
    } else {
      url.searchParams.set("view", nextView);
    }
    window.history.pushState({ view: nextView }, "", url);
    setView(nextView);
  }, []);

  return [view, navigate];
}
