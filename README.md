# Mercury

Mercury è una web app React + Python per la gestione finanziaria personale.

## Requisiti implementati
- Login con credenziali salvate in DB locale (`sqlite`, equivalente locale leggero a H2 per questo stack Python).
- Pagina post-login con due aree:
  - Gestione note spese (es. benzina, rimborso chilometrico, altre spese con sezione).
  - Gestione stipendio effettivo.

## Avvio rapido
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python backend_app.py
```

Apri `http://127.0.0.1:5000`

Credenziali demo:
- username: `cyran31`
- password: `mercury123`

## Test
```bash
python -m unittest discover -s tests
```
