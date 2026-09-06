import Home from "./Home";
import InteriorPage from "./domains/interior/InteriorPage";
import LoanPage from "./domains/loan/LoanPage";
import BudgetPage from "./domains/budget/BudgetPage";
import { useRoute } from "./hooks/useRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

const DOMAIN_VIEWS = ["interior", "loan", "budget"];

function App() {
  const [view, navigate] = useRoute();

  return (
    <ErrorBoundary key={view}>
      {view === "interior" && <InteriorPage onBack={() => navigate("home")} />}
      {view === "loan" && <LoanPage onBack={() => navigate("home")} />}
      {view === "budget" && <BudgetPage onBack={() => navigate("home")} />}
      {!DOMAIN_VIEWS.includes(view) && <Home onSelect={navigate} />}
    </ErrorBoundary>
  );
}

export default App;
