export default function ExpenseList({ expenses }) {
  if (expenses.length === 0) {
    return <p className="empty-state">Nessuna spesa registrata.</p>;
  }

  return (
    <div className="entry-list">
      {expenses.map((expense) => (
        <div key={expense.id} className="entry-card expense">
          <div className="entry-main">
            <span className="entry-title">
              {expense.category}
              {expense.section && <span className="tag">{expense.section}</span>}
            </span>
            {expense.note && <span className="entry-meta">{expense.note}</span>}
          </div>
          <span className="entry-amount">- € {expense.amount.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
