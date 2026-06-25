Mercury
Mercury is a React + Python web app for personal finance management.

Implemented Requirements
Login with credentials stored in a local DB (sqlite, lightweight local equivalent to H2 for this Python stack).
Post-login page with two sections:

Expense notes management (e.g., fuel, mileage reimbursement, other expenses with categorization).
Actual salary management.

## Quick Start
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python backend_app.py
```

Open `http://127.0.0.1:5000`

demo credential:
- username: `cyran31`
- password: `mercury123`

## Test
```bash
python -m unittest discover -s tests
```
