export async function login(credentials) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Login fallito");
  }
  return data;
}

export async function fetchExpenses() {
  const response = await fetch("/api/expenses");
  return response.json();
}

export async function fetchSalaries() {
  const response = await fetch("/api/salary");
  return response.json();
}

export async function createExpense(expense) {
  const response = await fetch("/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Errore salvataggio spesa.");
  }
  return data;
}

export async function createSalary(salary) {
  const response = await fetch("/api/salary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(salary),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Errore salvataggio stipendio.");
  }
  return data;
}
