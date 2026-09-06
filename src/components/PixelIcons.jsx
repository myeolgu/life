// 사이트 컨셉("살짝 픽셀아트 느낌")에 맞춘 단색 픽셀 아이콘들.
// 전부 16x16 그리드 + shape-rendering="crispEdges"로 블로키하게 그린다 (favicon과 같은 원칙).
// color는 currentColor를 써서 부모의 글자색을 그대로 물려받는다 — 배경에 상관없이 어디서나 쓸 수 있게.

function PixelSvg({ size = 24, className, children }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function PixelHouseIcon(props) {
  return (
    <PixelSvg {...props}>
      <rect x="10" y="0" width="1" height="4" />
      <rect x="7" y="2" width="2" height="1" />
      <rect x="6" y="3" width="4" height="1" />
      <rect x="5" y="4" width="6" height="1" />
      <rect x="4" y="5" width="8" height="1" />
      <rect x="3" y="6" width="10" height="1" />
      <rect x="3" y="7" width="10" height="7" />
    </PixelSvg>
  );
}

export function PixelRingsIcon(props) {
  return (
    <PixelSvg {...props}>
      <rect x="2" y="5" width="6" height="1" />
      <rect x="2" y="10" width="6" height="1" />
      <rect x="2" y="5" width="1" height="6" />
      <rect x="7" y="5" width="1" height="6" />
      <rect x="8" y="5" width="6" height="1" />
      <rect x="8" y="10" width="6" height="1" />
      <rect x="13" y="5" width="1" height="6" />
    </PixelSvg>
  );
}

export function PixelArrowIcon(props) {
  return (
    <PixelSvg {...props}>
      <rect x="2" y="7" width="7" height="2" />
      <rect x="9" y="5" width="2" height="6" />
      <rect x="11" y="6" width="2" height="4" />
      <rect x="13" y="7" width="1" height="2" />
    </PixelSvg>
  );
}
