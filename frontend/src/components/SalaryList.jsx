export default function SalaryList({ salaries }) {
  if (salaries.length === 0) {
    return <p className="empty-state">Nessuno stipendio registrato.</p>;
  }

  return (
    <div className="entry-list">
      {salaries.map((salary) => (
        <div key={salary.id} className="entry-card salary">
          <div className="entry-main">
            <span className="entry-title">{salary.month}</span>
            {salary.note && <span className="entry-meta">{salary.note}</span>}
          </div>
          <span className="entry-amount">+ € {salary.amount.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
