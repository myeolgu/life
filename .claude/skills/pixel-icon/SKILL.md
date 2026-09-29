---
name: pixel-icon
description: 이 사이트용 픽셀아트 아이콘(16x16 SVG 원본 → sharp nearest PNG)을 새로 만들거나 앱 아이콘/파비콘을 다시 렌더링할 때 따르는 절차.
---

# 픽셀 아이콘 만들기

이모지나 손으로 좌표 찍은 인라인 SVG는 쓰지 않는다 (CLAUDE.md "디자인 컨셉" 참고). 대신 이 순서를 따른다:

1. `src/assets/pixel-icons/<이름>-source.svg`로 16x16 그리드 원본을 만든다 (`shape-rendering="crispEdges"`, `<rect>`로만 구성, 곡선/그라디언트 없음). 배경이 필요하면 도메인 색(`domainMeta` 참고, 예: 인테리어 `#b4784a`, 대출 `#5b7df0`)으로 꽉 채운 사각형을 먼저 깔고, 그 위에 크림색(`#fdf6ec`) 등으로 그림을 얹는다. 투명 배경이 필요하면(본문에 흐르는 작은 장식 아이콘 등) 배경 사각형을 생략한다.
2. `sharp`를 임시로 설치해서(`npm install -D sharp`, 끝나면 제거) `kernel: 'nearest'`로 PNG 래스터화 (`sharp('원본.svg').resize(128, 128, {kernel:'nearest'}).png().toFile('public/icons/pixel/<이름>.png')`). 픽셀 아트는 곡선을 매끄럽게 스케일하면 안 되므로 반드시 `nearest`를 쓴다.
3. **Read 도구로 결과 PNG를 실제로 열어보고 모양을 확인한 다음에** 코드에 반영한다 (확인 없이 좌표만 믿고 넘어가지 않는다).
4. 컴포넌트에서는 `<img src={`${import.meta.env.BASE_URL}icons/pixel/<이름>.png`} />`로 불러온다 (`base: '/life/'` 설정 때문에 경로 앞에 `import.meta.env.BASE_URL`을 꼭 붙여야 한다 — 안 붙이면 GitHub Pages 배포에서 경로가 깨진다). CSS에는 `image-rendering: pixelated`를 줘서 확대/축소 시 흐려지지 않게 한다.

## 앱 아이콘/파비콘
`src/assets/icon-source.svg`(16x16 픽셀아트 집 모양)가 원본이다. `public/favicon.svg`와 `public/icons/`의 PNG(192/512/마스커블 512)는 전부 이 파일에서 만든 결과물이라, 아이콘을 바꾸려면 이 SVG를 고치고 위 2~3단계와 같은 방식(`sharp` + `kernel: 'nearest'`, 끝나면 `sharp` 제거)으로 다시 렌더링한다. 집 아이콘이 필요하면 `house-source.svg`를 새로 만들지 말고 이 파일을 재사용한다.
