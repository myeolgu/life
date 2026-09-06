import { useState } from "react";

export default function AddEventForm({ domains, onSubmit, onCancel }) {
  const [domain, setDomain] = useState(domains[0]?.key ?? "");
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title || !start) return;
    onSubmit(domain, {
      id: `custom-${Date.now()}`,
      title,
      start,
      end: end || undefined,
      description,
    });
  }

  return (
    <form className="add-event-form" onSubmit={handleSubmit}>
      <h3>일정 추가</h3>

      <label>
        카테고리
        <select value={domain} onChange={(e) => setDomain(e.target.value)}>
          {domains.map((d) => (
            <option key={d.key} value={d.key}>
              {d.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        제목
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>

      <div className="add-event-dates">
        <label>
          시작일
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} required />
        </label>
        <label>
          종료일 (선택, 마지막 날 포함)
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} min={start} />
        </label>
      </div>

      <label>
        설명
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </label>

      <div className="add-event-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          취소
        </button>
        <button type="submit" className="btn-primary">
          추가
        </button>
      </div>
    </form>
  );
}
