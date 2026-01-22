# Blackbox: Project OneX IMSA Backend

AI Race Analyser Backend & ML Pipeline.
Trains on IMSA 2021-2024 data and provides inference for race strategy.

## Setup

1. Install Python 3.10+.
2. Install Poetry: `pip install poetry`.
3. Install dependencies: `poetry install`.

## Data

Place the IMSA data CSVs/JSONs in `../IMSA Data` or adapt the `train.py` script path.
Currently configured to read from `../IMSA Data`.

## Training

```bash
poetry run python scripts/train.py
```

## Running API

```bash
poetry run uvicorn app.main:app --reload
```
API will be available at `http://localhost:8000`.
Docs at `http://localhost:8000/docs`.

## Docker

```bash
docker build -t blackbox .
docker run -p 8000:8000 blackbox
```
