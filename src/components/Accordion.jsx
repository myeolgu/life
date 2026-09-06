import { useState } from "react";
import "./Accordion.css";

export default function Accordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="accordion">
      <button type="button" className="accordion-header" onClick={() => setOpen((o) => !o)}>
        <span>{title}</span>
        <span className={`accordion-chevron${open ? " open" : ""}`}>▾</span>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}
