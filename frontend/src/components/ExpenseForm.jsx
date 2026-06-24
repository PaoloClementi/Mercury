import { useState } from "react";

const EMPTY_EXPENSE = { category: "", section: "", amount: "", note: "" };

export default function ExpenseForm({ onSubmit }) {
  const [expenseForm, setExpenseForm] = useState(EMPTY_EXPENSE);

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(expenseForm);
    setExpenseForm(EMPTY_EXPENSE);
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Categoria</label>
        <input
          aria-label="Categoria spesa"
          placeholder="es. benzina"
          value={expenseForm.category}
          onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
          required
        />
      </div>
      <div className="field">
        <label>Sezione</label>
        <input
          aria-label="Sezione spesa"
          placeholder="opzionale"
          value={expenseForm.section}
          onChange={(e) => setExpenseForm({ ...expenseForm, section: e.target.value })}
        />
      </div>
      <div className="field">
        <label>Importo (€)</label>
        <input
          aria-label="Importo spesa"
          placeholder="0.00"
          type="number"
          step="0.01"
          value={expenseForm.amount}
          onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
          required
        />
      </div>
      <div className="field">
        <label>Nota</label>
        <input
          aria-label="Nota spesa"
          placeholder="opzionale"
          value={expenseForm.note}
          onChange={(e) => setExpenseForm({ ...expenseForm, note: e.target.value })}
        />
      </div>
      <button type="submit">Salva spesa</button>
    </form>
  );
}
