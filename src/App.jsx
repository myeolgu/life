import Home from "./Home";
import InteriorPage from "./domains/interior/InteriorPage";
import LoanPage from "./domains/loan/LoanPage";
import { useRoute } from "./hooks/useRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

function App() {
  const [view, navigate] = useRoute();

  return (
    <ErrorBoundary key={view}>
      {view === "interior" && <InteriorPage onBack={() => navigate("home")} />}
      {view === "loan" && <LoanPage onBack={() => navigate("home")} />}
      {view !== "interior" && view !== "loan" && <Home onSelect={navigate} />}
    </ErrorBoundary>
  );
}

export default App;
