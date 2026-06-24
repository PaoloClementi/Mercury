from __future__ import annotations

import sqlite3
from pathlib import Path
import re
from typing import Any

from flask import Flask, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "mercury.db"
MAX_ALLOWED_AMOUNT = 1_000_000
MONTH_PATTERN = re.compile(r"^\d{4}-(0[1-9]|1[0-2])$")


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    hashed_password = generate_password_hash("mercury123")
    with get_connection() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL,
                section TEXT,
                amount REAL NOT NULL,
                note TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS salaries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                month TEXT NOT NULL,
                amount REAL NOT NULL,
                note TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
        connection.execute(
            "INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)",
            ("cyran31", hashed_password),
        )
        existing_user = connection.execute(
            "SELECT id, password FROM users WHERE username = ?",
            ("cyran31",),
        ).fetchone()
        if existing_user:
            stored_password = str(existing_user["password"])
            try:
                already_hashed = check_password_hash(stored_password, "mercury123")
            except ValueError:
                already_hashed = False
            if not already_hashed and stored_password == "mercury123":
                connection.execute(
                    "UPDATE users SET password = ? WHERE id = ?",
                    (hashed_password, existing_user["id"]),
                )


def create_app() -> Flask:
    app = Flask(__name__, static_folder="frontend/dist", static_url_path="")

    @app.get("/")
    def index() -> Any:
        return app.send_static_file("index.html")

    @app.post("/api/login")
    def login() -> Any:
        payload = request.get_json(silent=True) or {}
        username = (payload.get("username") or "").strip()
        password = (payload.get("password") or "").strip()

        if not username or not password:
            return jsonify({"error": "Username e password sono obbligatori."}), 400

        with get_connection() as connection:
            user = connection.execute(
                "SELECT id, username, password FROM users WHERE username = ?",
                (username,),
            ).fetchone()

        if user is None or not check_password_hash(user["password"], password):
            return jsonify({"error": "Credenziali non valide."}), 401

        return jsonify({"id": user["id"], "username": user["username"]})

    @app.get("/api/expenses")
    def list_expenses() -> Any:
        with get_connection() as connection:
            rows = connection.execute(
                "SELECT id, category, section, amount, note, created_at FROM expenses ORDER BY id DESC"
            ).fetchall()
        return jsonify([dict(row) for row in rows])

    @app.post("/api/expenses")
    def create_expense() -> Any:
        payload = request.get_json(silent=True) or {}
        category = (payload.get("category") or "").strip()
        section = (payload.get("section") or "").strip()
        note = (payload.get("note") or "").strip()

        try:
            amount = float(payload.get("amount"))
        except (TypeError, ValueError):
            return jsonify({"error": "Importo spesa non valido."}), 400

        if not category:
            return jsonify({"error": "Categoria spesa obbligatoria."}), 400
        if amount <= 0 or amount > MAX_ALLOWED_AMOUNT:
            return jsonify({"error": "Importo spesa fuori range consentito."}), 400

        with get_connection() as connection:
            cursor = connection.execute(
                "INSERT INTO expenses (category, section, amount, note) VALUES (?, ?, ?, ?)",
                (category, section, amount, note),
            )
            expense_id = cursor.lastrowid
            row = connection.execute(
                "SELECT id, category, section, amount, note, created_at FROM expenses WHERE id = ?",
                (expense_id,),
            ).fetchone()

        return jsonify(dict(row)), 201

    @app.get("/api/salary")
    def list_salary() -> Any:
        with get_connection() as connection:
            rows = connection.execute(
                "SELECT id, month, amount, note, created_at FROM salaries ORDER BY id DESC"
            ).fetchall()
        return jsonify([dict(row) for row in rows])

    @app.post("/api/salary")
    def create_salary() -> Any:
        payload = request.get_json(silent=True) or {}
        month = (payload.get("month") or "").strip()
        note = (payload.get("note") or "").strip()

        try:
            amount = float(payload.get("amount"))
        except (TypeError, ValueError):
            return jsonify({"error": "Importo stipendio non valido."}), 400

        if not month:
            return jsonify({"error": "Mese stipendio obbligatorio."}), 400
        if not MONTH_PATTERN.match(month):
            return jsonify({"error": "Formato mese non valido. Usa YYYY-MM."}), 400
        if amount <= 0 or amount > MAX_ALLOWED_AMOUNT:
            return jsonify({"error": "Importo stipendio fuori range consentito."}), 400

        with get_connection() as connection:
            cursor = connection.execute(
                "INSERT INTO salaries (month, amount, note) VALUES (?, ?, ?)",
                (month, amount, note),
            )
            salary_id = cursor.lastrowid
            row = connection.execute(
                "SELECT id, month, amount, note, created_at FROM salaries WHERE id = ?",
                (salary_id,),
            ).fetchone()

        return jsonify(dict(row)), 201

    return app


init_db()
app = create_app()


if __name__ == "__main__":
    app.run()
