import Home from "./Home";
import InteriorPage from "./domains/interior/InteriorPage";
import LoanPage from "./domains/loan/LoanPage";
import { useRoute } from "./hooks/useRoute";
import "./App.css";

function App() {
  const [view, navigate] = useRoute();

  if (view === "interior") return <InteriorPage onBack={() => navigate("home")} />;
  if (view === "loan") return <LoanPage onBack={() => navigate("home")} />;
  return <Home onSelect={navigate} />;
}

export default App;
