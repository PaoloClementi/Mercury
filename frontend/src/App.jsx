import { useEffect, useMemo, useState } from "react";
import { login, fetchExpenses, fetchSalaries, createExpense, createSalary } from "./api.js";
import Login from "./components/Login.jsx";
import ExpenseForm from "./components/ExpenseForm.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import SalaryForm from "./components/SalaryForm.jsx";
import SalaryList from "./components/SalaryList.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [formError, setFormError] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [salaries, setSalaries] = useState([]);

  async function loadData() {
    try {
      const [expenseData, salaryData] = await Promise.all([fetchExpenses(), fetchSalaries()]);
      setExpenses(expenseData);
      setSalaries(salaryData);
    } catch (e) {
      setFormError("Errore di rete durante il caricamento dati.");
    }
  }

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  async function handleLogin(credentials) {
    const data = await login(credentials);
    setUser(data);
  }

  async function handleAddExpense(expenseForm) {
    setFormError("");
    try {
      await createExpense(expenseForm);
      await loadData();
    } catch (e) {
      setFormError(e.message);
    }
  }

  async function handleAddSalary(salaryForm) {
    setFormError("");
    try {
      await createSalary(salaryForm);
      await loadData();
    } catch (e) {
      setFormError(e.message);
    }
  }

  const totals = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalSalaries = salaries.reduce((sum, s) => sum + s.amount, 0);
    return { totalExpenses, totalSalaries, balance: totalSalaries - totalExpenses };
  }, [expenses, salaries]);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <h1>Mercury</h1>
            <p className="welcome">Benvenuto, {user.username}</p>
          </div>
        </div>
        <button className="secondary" onClick={() => setUser(null)}>
          Esci
        </button>
      </header>

      {formError && <div className="error-banner">{formError}</div>}

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Stipendio totale</div>
          <div className="stat-value">€ {totals.totalSalaries.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Spese totali</div>
          <div className="stat-value">€ {totals.totalExpenses.toFixed(2)}</div>
        </div>
        <div className={`stat-card ${totals.balance >= 0 ? "positive" : "negative"}`}>
          <div className="stat-label">Saldo</div>
          <div className="stat-value">€ {totals.balance.toFixed(2)}</div>
        </div>
      </section>

      <section className="panels-grid">
        <div className="panel">
          <div className="panel-header">
            <span className="icon">💸</span>
            <h2>Note spese</h2>
          </div>
          <ExpenseForm onSubmit={handleAddExpense} />
          <ExpenseList expenses={expenses} />
        </div>

        <div className="panel">
          <div className="panel-header">
            <span className="icon">💰</span>
            <h2>Stipendio effettivo</h2>
          </div>
          <SalaryForm onSubmit={handleAddSalary} />
          <SalaryList salaries={salaries} />
        </div>
      </section>
    </div>
  );
}
