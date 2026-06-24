import tempfile
import unittest
from pathlib import Path

import backend_app


class MercuryBackendTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        backend_app.DB_PATH = Path(self.temp_dir.name) / "test.db"
        backend_app.init_db()
        self.client = backend_app.create_app().test_client()

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_login_success(self):
        response = self.client.post(
            "/api/login", json={"username": "cyran31", "password": "mercury123"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["username"], "cyran31")

    def test_expense_and_salary_creation(self):
        expense = self.client.post(
            "/api/expenses",
            json={
                "category": "benzina",
                "section": "viaggi",
                "amount": 50.5,
                "note": "rifornimento",
            },
        )
        self.assertEqual(expense.status_code, 201)

        salary = self.client.post(
            "/api/salary",
            json={"month": "2026-06", "amount": 2000, "note": "mensile"},
        )
        self.assertEqual(salary.status_code, 201)

        expenses = self.client.get("/api/expenses")
        self.assertEqual(len(expenses.get_json()), 1)

        salaries = self.client.get("/api/salary")
        self.assertEqual(len(salaries.get_json()), 1)

    def test_rejects_invalid_amount_and_month(self):
        invalid_expense = self.client.post(
            "/api/expenses",
            json={"category": "benzina", "amount": -1, "section": "", "note": ""},
        )
        self.assertEqual(invalid_expense.status_code, 400)

        invalid_salary = self.client.post(
            "/api/salary",
            json={"month": "2026/06", "amount": 1500, "note": "wrong format"},
        )
        self.assertEqual(invalid_salary.status_code, 400)


if __name__ == "__main__":
    unittest.main()
