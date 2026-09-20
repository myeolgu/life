import { useState } from "react";
import { items as itemsSeed } from "./data";
import { useContentItems } from "../../hooks/useContentItems";
import ProgressRing from "../../components/ProgressRing";
import Modal from "../../components/Modal";
import ErrorBoundary from "../../components/ErrorBoundary";

function won(n) {
  return `₩${n.toLocaleString()}`;
}

function EditItemForm({ item, onSubmit, onCancel }) {
  const [total, setTotal] = useState(String(item.total));
  const [unpaid, setUnpaid] = useState(String(item.unpaid));
  const [paidBy, setPaidBy] = useState(item.paidBy.join(", "));
  const [memo, setMemo] = useState(item.memo);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      total: Number(total) || 0,
      unpaid: Number(unpaid) || 0,
      paidBy: paidBy.split(",").map((s) => s.trim()).filter(Boolean),
      memo,
    });
  }

  return (
    <form className="add-event-form" onSubmit={handleSubmit}>
      <h3>{item.name} 수정</h3>
      <label>
        총 비용 (원)
        <input type="number" min="0" value={total} onChange={(e) => setTotal(e.target.value)} />
      </label>
      <label>
        남은 금액 (원)
        <input type="number" min="0" value={unpaid} onChange={(e) => setUnpaid(e.target.value)} />
      </label>
      <label>
        지불인 (쉼표로 구분)
        <input type="text" value={paidBy} onChange={(e) => setPaidBy(e.target.value)} placeholder="예: 김소윤, 이주엽" />
      </label>
      <label>
        메모
        <input type="text" value={memo} onChange={(e) => setMemo(e.target.value)} />
      </label>
      <div className="add-event-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>취소</button>
        <button type="submit" className="btn-primary">저장</button>
      </div>
    </form>
  );
}

function BudgetStatus() {
  const { items, updateItem } = useContentItems("budget", "items", itemsSeed);
  const [editingIndex, setEditingIndex] = useState(null);

  const totalCost = items.reduce((sum, i) => sum + i.total, 0);
  const totalUnpaid = items.reduce((sum, i) => sum + i.unpaid, 0);
  const totalPaid = totalCost - totalUnpaid;
  const pct = totalCost === 0 ? 0 : Math.round((totalPaid / totalCost) * 100);

  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <section>
      <h2>예산 현황</h2>
      <p className="muted">항목별 총 비용과 아직 지불하지 않은 금액을 관리합니다. "수정"으로 직접 입력하세요.</p>

      <div className="budget-summary">
        <ProgressRing pct={pct} size={84} stroke={9} />
        <div>
          <p style={{ margin: 0, fontWeight: 700 }}>{won(totalPaid)} / {won(totalCost)} 지불</p>
          <p className="muted" style={{ margin: 0 }}>아직 안 낸 금액: {won(totalUnpaid)}</p>
        </div>
      </div>

      {categories.map((cat) => {
        const catEntries = items
          .map((item, i) => ({ item, i }))
          .filter(({ item }) => item.category === cat);
        const catTotal = catEntries.reduce((sum, { item }) => sum + item.total, 0);
        const catUnpaid = catEntries.reduce((sum, { item }) => sum + item.unpaid, 0);
        return (
          <div className="checklist-group" key={cat}>
            <h4>
              {cat} <span className="muted">({won(catTotal - catUnpaid)} / {won(catTotal)} 지불)</span>
            </h4>
            <table className="data-table budget-table">
              <thead>
                <tr><th>항목</th><th>총 비용</th><th>남은 금액</th><th>지불인</th><th>메모</th><th></th></tr>
              </thead>
              <tbody>
                {catEntries.map(({ item, i }) => (
                  <tr key={i} className={item.unpaid === 0 ? "budget-paid-row" : ""}>
                    <td>{item.name}</td>
                    <td className="nowrap">{won(item.total)}</td>
                    <td className="nowrap">{won(item.unpaid)}</td>
                    <td>{item.paidBy.length > 0 ? item.paidBy.join(", ") : "—"}</td>
                    <td>{item.memo || "—"}</td>
                    <td>
                      <button className="btn-secondary" onClick={() => setEditingIndex(i)}>수정</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      <p className="callout">
        "신혼집 인테리어"는 (주)디자인큐원의 2026-09-19 서면 견적 34,140,167원(VAT 포함)입니다 — 인테리어 도메인 "시공업체" 탭의 견적서 화면에서 항목별 내역을 볼 수 있습니다.
        아직 계약 전이라 업체를 바꾸거나 수량을 조정하면 달라집니다. 가구/가전·커튼·이사비는 금액이 정해지면 채워 넣으세요.
      </p>

      <Modal open={editingIndex !== null} onClose={() => setEditingIndex(null)}>
        {editingIndex !== null && (
          <EditItemForm
            item={items[editingIndex]}
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
