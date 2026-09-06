import { useState } from "react";
import { categories as categoriesSeed } from "./data";
import { useContentItems } from "../../hooks/useContentItems";
import ProgressRing from "../../components/ProgressRing";
import Modal from "../../components/Modal";
import ErrorBoundary from "../../components/ErrorBoundary";

function won(n) {
  return `${n.toLocaleString()}만원`;
}

function EditBudgetForm({ category, onSubmit, onCancel }) {
  const [planned, setPlanned] = useState(String(category.planned));
  const [spent, setSpent] = useState(String(category.spent));

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ planned: Number(planned) || 0, spent: Number(spent) || 0 });
  }

  return (
    <form className="add-event-form" onSubmit={handleSubmit}>
      <h3>{category.name} 금액 수정</h3>
      <label>
        계획 예산 (만원)
        <input type="number" min="0" value={planned} onChange={(e) => setPlanned(e.target.value)} />
      </label>
      <label>
        실제 지출 (만원)
        <input type="number" min="0" value={spent} onChange={(e) => setSpent(e.target.value)} />
      </label>
      <div className="add-event-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>취소</button>
        <button type="submit" className="btn-primary">저장</button>
      </div>
    </form>
  );
}

function BudgetStatus() {
  const { items: categories, updateItem } = useContentItems("budget", "categories", categoriesSeed);
  const [editingIndex, setEditingIndex] = useState(null);

  const totalPlanned = categories.reduce((sum, c) => sum + c.planned, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const totalPct = totalPlanned === 0 ? 0 : Math.round((totalSpent / totalPlanned) * 100);

  return (
    <section>
      <h2>예산 현황</h2>
      <p className="muted">계획 예산과 실제 지출을 항목별로 관리합니다. 금액이 없는 항목은 "수정"으로 직접 입력하세요.</p>

      <div className="budget-summary">
        <ProgressRing pct={totalPct} size={84} stroke={9} />
        <div>
          <p style={{ margin: 0, fontWeight: 700 }}>총 {won(totalSpent)} / {won(totalPlanned)} 지출</p>
          <p className="muted" style={{ margin: 0 }}>남은 예산: {won(Math.max(totalPlanned - totalSpent, 0))}</p>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr><th>항목</th><th>계획 예산</th><th>실제 지출</th><th>남은 예산</th><th>진행률</th><th></th></tr>
        </thead>
        <tbody>
          {categories.map((c, i) => {
            const pct = c.planned === 0 ? 0 : Math.round((c.spent / c.planned) * 100);
            const remaining = c.planned - c.spent;
            return (
              <tr key={c.no}>
                <td>{c.name}</td>
                <td className="nowrap">{won(c.planned)}</td>
                <td className="nowrap">{won(c.spent)}</td>
                <td className="nowrap">{won(remaining)}</td>
                <td>
                  <div className="category-progress-bar" style={{ width: 100 }}>
                    <div className="category-progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: "var(--accent)" }} />
                  </div>
                  <span className="muted" style={{ fontSize: "0.78rem" }}>{pct}%</span>
                </td>
                <td>
                  <button className="btn-secondary" onClick={() => setEditingIndex(i)}>수정</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="callout">
        "신혼집 인테리어" 계획 예산은 인테리어 도메인 "시공 범위" 탭의 예상 비용 범위(약 1,175~1,835만원) 중간값을 참고로 넣어둔 값입니다 — 실제 견적이 나오면 수정하세요. 월별 지출 계획 그래프는 카테고리별 금액이 채워진 뒤 추가할 예정입니다.
      </p>

      <Modal open={editingIndex !== null} onClose={() => setEditingIndex(null)}>
        {editingIndex !== null && (
          <EditBudgetForm
            category={categories[editingIndex]}
            onCancel={() => setEditingIndex(null)}
            onSubmit={(patch) => {
              updateItem(editingIndex, patch);
              setEditingIndex(null);
            }}
          />
        )}
      </Modal>
    </section>
  );
}

export default function BudgetPage({ onBack }) {
  return (
    <div className="app">
      <header className="app-header">
        <button className="back-link" onClick={onBack}>← 홈으로</button>
        <h1>예산 관리</h1>
        <p className="muted">결혼/인테리어 관련 지출과 예산을 추적합니다.</p>
      </header>

      <main className="content">
        <ErrorBoundary>
          <BudgetStatus />
        </ErrorBoundary>
      </main>
    </div>
  );
}
