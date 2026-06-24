import { useState } from "react";

const EMPTY_SALARY = { month: "", amount: "", note: "" };

export default function SalaryForm({ onSubmit }) {
  const [salaryForm, setSalaryForm] = useState(EMPTY_SALARY);

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(salaryForm);
    setSalaryForm(EMPTY_SALARY);
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Mese</label>
        <input
          aria-label="Mese stipendio"
          placeholder="2026-06"
          value={salaryForm.month}
          onChange={(e) => setSalaryForm({ ...salaryForm, month: e.target.value })}
          required
        />
      </div>
      <div className="field">
        <label>Importo (€)</label>
        <input
          aria-label="Importo stipendio"
          placeholder="0.00"
          type="number"
          step="0.01"
          value={salaryForm.amount}
          onChange={(e) => setSalaryForm({ ...salaryForm, amount: e.target.value })}
          required
        />
      </div>
      <div className="field">
        <label>Nota</label>
        <input
          aria-label="Nota stipendio"
          placeholder="opzionale"
          value={salaryForm.note}
          onChange={(e) => setSalaryForm({ ...salaryForm, note: e.target.value })}
        />
      </div>
      <button type="submit">Salva stipendio</button>
    </form>
  );
}
