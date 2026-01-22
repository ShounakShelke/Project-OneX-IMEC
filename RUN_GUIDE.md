# Project OneX IMSA - Run Guide

## Prerequisites
- **Node.js** v18 or higher
- **Python** v3.10 or higher
- **pip** (Python package manager)

---

## 1. Backend Setup

The backend provides the FastAPI prediction API.

### Steps:

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows (PowerShell)**:
     ```bash
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (CMD)**:
     ```bash
     venv\Scripts\activate.bat
     ```
   - **Linux/macOS**:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install fastapi uvicorn joblib pandas numpy xgboost
   ```

5. Start the API server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. Verify the server is running at: **http://localhost:8000/docs**

---

## 2. ML Engine Setup (IMECvS3)

The ML Engine handles data preprocessing and model training.

### Steps:

1. Navigate to the IMECvS3 scripts folder:
   ```bash
   cd IMECvS3/scripts
   ```

2. If not already done, activate your Python environment.

3. Run preprocessing to load historical data:
   ```bash
   python preprocess.py
   ```

4. Train the XGBoost models:
   ```bash
   python train.py
   ```

5. Upon success, trained models will be saved to `IMECvS3/data/models/`.

---

## 3. Frontend Setup

The frontend is a React application built with Vite.

### Steps:

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to: **http://localhost:5173**

---

## 4. Usage Guide

1. **Upload Data**: Drag and drop your Practice AND Qualifying JSON files into the upload area.
2. **Set Conditions**: Enter Track Condition (e.g., "Dry") and Weather (e.g., "Sunny").
3. **Set Duration**: Enter the race duration in hours (supports 0.5 to 30 hours).
4. **Select Class**: Optionally filter by car class (GTP, LMP2, GTD PRO, GTD).
5. **Run Analysis**: Click the "Run Analysis" button to generate predictions.
6. **View Results**: Explore the Results Table, Pitstop Timeline, and Tire Strategy Grid.
7. **Export**: Use the export buttons to download results as JSON or CSV.

---

## Troubleshooting

| Issue                          | Solution                                      |
|--------------------------------|-----------------------------------------------|
| Backend connection failed      | Ensure the backend is running on port 8000    |
| Models not loading             | Run `train.py` to generate model files        |
| Frontend build errors          | Delete `node_modules/` and run `npm install`  |

---

## Contact

For support, contact **Shounak Shelke** at [Shelkeshounak1@gmail.com](mailto:Shelkeshounak1@gmail.com).