# Project OneX IMSA

**AI-Powered Race Strategy Analyser for IMSA Endurance Racing**

*Developed by Shounak Shelke*

---

## Overview

Project OneX IMSA is a comprehensive race strategy analysis platform designed for IMSA (International Motor Sports Association) endurance racing. The system leverages machine learning models trained on historical race data (2021-2024) to predict race outcomes, optimal pit stop timing, and tire strategies.

The project is architected with a clear separation between the **ML Engine** (IMECvS3), the **Backend API**, and the **Frontend Web Application**.

---

## Key Features

### Frontend (React Web Application)
- **IMSA Official Branding**: UI styled with IMSA's official color palette (Reflex Blue, Bright Cyan) and class-specific colors (GTP, LMP2, GTD PRO, GTD).
- **Dynamic Race Analysis**: Supports race durations from 30 minutes to 30 hours.
- **Interactive Visualizations**:
  - Parallax racing background for immersive experience.
  - Pitstop Timeline visualization per car.
  - Tire Strategy Grid showing compound sequences.
- **Data Export**: Export predictions to JSON or CSV formats.
- **Dark/Light Mode Toggle**: Adaptive theme support.
- **Tech Stack**: React, Vite, TailwindCSS, Framer Motion.

### Backend (FastAPI)
- **RESTful API**: FastAPI-powered `/predict` endpoint for real-time inference.
- **CORS Support**: Configured for cross-origin requests from the frontend.
- **Model Loading**: Dynamically loads trained XGBoost models at startup.

### ML Engine (IMECvS3)
- **XGBoost Models**: Separate regression models trained for each car class (GTP, LMP2, GTD PRO, GTD).
- **Preprocessing Pipeline**: Automated data ingestion from IMSA CSV files.
- **Label Encoding**: Categorical features (team, vehicle) are encoded and persisted.
- **Metadata Tracking**: Model version, features, and training metrics are logged.

---

## Directory Structure

```
Project OneX/
├── backend/            # FastAPI Application (Python)
│   └── app/            # Main API Logic
├── IMECvS3/            # ML Engine (Training & Models)
│   ├── data/           # Processed Data & Trained Models
│   └── scripts/        # Training & Preprocessing Scripts
├── frontend/           # React Web Application
│   ├── src/            # Source Code (JS/JSX)
│   ├── public/         # Static Assets
│   └── index.html
├── IMSA Data/          # Historical Race Data (CSVs)
├── Logo.jpg            # Project Branding Asset
├── Version Log.docx    # Version History Documentation
├── RUN_GUIDE.md        # Step-by-step Run Instructions
└── README.md           # This File
```

---

## Technology Stack

| Component     | Technology                        |
|---------------|-----------------------------------|
| Frontend      | React 18, Vite, TailwindCSS       |
| Backend       | Python 3.10+, FastAPI, Uvicorn    |
| ML Framework  | XGBoost, Scikit-learn, Pandas     |
| Data Format   | CSV (raw), Parquet (processed)    |

---

## Quick Start

Refer to **[RUN_GUIDE.md](RUN_GUIDE.md)** for detailed setup instructions.

### Summary:
1. **Backend**: Navigate to `backend/`, create a virtual environment, install dependencies, and run `uvicorn app.main:app --reload`.
2. **ML Training**: Navigate to `IMECvS3/scripts/`, run `python preprocess.py` then `python train.py`.
3. **Frontend**: Navigate to `frontend/`, run `npm install` then `npm run dev`.

---

## API Endpoints

| Endpoint      | Method | Description                       |
|---------------|--------|-----------------------------------|
| `/predict`    | POST   | Submit race data for prediction   |
| `/docs`       | GET    | Interactive Swagger UI            |

---

## Model Training

The ML models are trained using historical IMSA race data. The training pipeline:

1. **Preprocessing** (`preprocess.py`): Loads CSV files from `IMSA Data/`, normalizes columns, maps car classes, and saves to Parquet.
2. **Training** (`train.py`): Loads processed data, encodes categorical features, trains XGBoost regressors per class, and saves models.

Trained models are stored in `IMECvS3/data/models/`.

---

## Contact

**Shounak Shelke**  
Email: [Shelkeshounak1@gmail.com](mailto:Shelkeshounak1@gmail.com)

---

*© 2026 Project OneX IMSA. All rights reserved.*
