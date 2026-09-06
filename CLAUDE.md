# 인테리어 프로젝트

부개주공1단지 아파트 107동 1001호(인천광역시 부평구 부개동, 25평/전용 약 59㎡) 인테리어를 준비하는 개인 프로젝트입니다. 2026-09-06부터 이 저장소 자체가 React 웹앱(Vite)이며, 관리 콘텐츠(매물정보/시공범위/공사순서/자금계획/계약견적 체크리스트/진행상황)의 기준(source of truth)입니다. GitHub 저장소 `myeolgu/life`에 연결되어 있고 GitHub Pages로 배포됩니다.

Notion 허브 페이지(https://app.notion.com/p/3d3face0214c80c7975fd90da7100383)는 이전 단계에서 쓰던 것으로 더 이상 기준 문서가 아닙니다 — 참고용으로만 남아있고, 새 내용은 이 React 앱(`src/data.js`)에 반영합니다.

## 이 저장소의 구조
- `src/data.js` — 모든 콘텐츠 데이터(매물정보, 시공범위, 공사순서, 자금계획, 계약체크리스트, 진행상황). 내용 업데이트는 여기를 수정.
- `src/App.jsx` — 탭 기반 대시보드 UI. 새 섹션 추가 시 TABS 배열과 컴포넌트를 함께 추가.
- `index.html` — `<meta name="robots" content="noindex, nofollow">`로 검색엔진 노출 차단, Pretendard 폰트 CDN 로드.
- `public/robots.txt` — 전체 크롤링 차단 (`Disallow: /`).
- `.github/workflows/deploy.yml` — main 브랜치 push 시 GitHub Pages 자동 배포.
- `vite.config.js` — `base: '/life/'` (GitHub Pages 저장소 경로와 일치시킴, 저장소명이 바뀌면 같이 바꿀 것).
- `.claude/agents/interior-design-assistant.md` — 인테리어 관련 질문/작업을 담당하는 서브에이전트
- `.claude/skills/interior-notion-project/SKILL.md` — (레거시) Notion 페이지 구조 기록. 더 이상 활발히 쓰지 않지만 과거 정리 내용 참고용으로 유지.

## 작업 원칙
- 콘텐츠 변경은 `src/data.js`를 수정하는 방식으로 한다 (Notion 페이지를 더 이상 갱신하지 않음).
- 대출/정책 관련 정보(디딤돌대출 조건 등)는 시점에 따라 바뀌므로, 참고할 때마다 최신 여부를 재검색해서 확인한다.
- 폰트는 Pretendard로 전역 통일 (`index.html`의 CDN 링크 + `src/index.css`의 font-family).
- 이 사이트는 검색 노출을 원치 않는 개인 프로젝트이므로 noindex/robots.txt 설정을 절대 제거하지 않는다.
