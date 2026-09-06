import { Component } from "react";

// 특정 탭/섹션에서 렌더링 에러가 나도 앱 전체가 하얗게 되지 않도록 감싸는 안전장치.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-fallback">
          <p>이 화면을 불러오는 중 문제가 생겼어요.</p>
          <pre>{String(this.state.error?.message || this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
