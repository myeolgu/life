import { useState } from "react";
import Home from "./Home";
import InteriorPage from "./domains/interior/InteriorPage";
import LoanPage from "./domains/loan/LoanPage";
import "./App.css";

function App() {
  const [view, setView] = useState("home");

  if (view === "interior") return <InteriorPage onBack={() => setView("home")} />;
  if (view === "loan") return <LoanPage onBack={() => setView("home")} />;
  return <Home onSelect={setView} />;
}

export default App;
