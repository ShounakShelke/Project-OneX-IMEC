import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import json
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

BASE_DIR = Path(__file__).resolve().parent.parent
PROCESSED_FILE = BASE_DIR / "data" / "processed" / "imsa_processed_history.parquet"
MODELS_DIR = BASE_DIR / "data" / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

RANDOM_SEED = 42

def train_models():
    print("Starting IMEC-S3 Training Pipeline...")
    
    if not PROCESSED_FILE.exists():
        print("Processed data not found, running preprocess first...")
        import preprocess
        df_proc = preprocess.load_data()
        if not df_proc.empty:
            df_proc.to_parquet(PROCESSED_FILE)
            print(f"Saved processed data to {PROCESSED_FILE}")
        
        if not PROCESSED_FILE.exists():
            print("Failed to create data. Exiting.")
            return

    df = pd.read_parquet(PROCESSED_FILE)
    if df.empty:
        print("Dataframe empty.")
        return

    # Target: Position (numeric)
    df['position'] = pd.to_numeric(df['position'], errors='coerce')
    df = df.dropna(subset=['position'])
    
    # Generate synthetic grid if not present in data
    if 'grid' not in df.columns:
         df['grid'] = df['position'] + np.random.randint(-2, 3, size=len(df))
    
    feature_cols = ['grid']
    
    # Categorical feature encoding
    cat_cols = ['team', 'vehicle']
    label_encoders = {}
    
    for c in cat_cols:
        if c in df.columns:
            le = LabelEncoder()
            df[c] = df[c].astype(str)
            df[c] = le.fit_transform(df[c])
            label_encoders[c] = le
            feature_cols.append(c)
            joblib.dump(le, MODELS_DIR / f"le_{c}.pkl")

    # Classes to train for
    target_classes = ["GTP", "LMP2", "GTD_PRO", "GTD"]
    
    trained_metrics = {}

    for cls in target_classes:
        print(f"Training IMEC-S3 Model for Class: {cls}")
        
        class_df = df[df['standard_class'] == cls]
        
        if len(class_df) < 10:
            print(f"Insufficient data for {cls}, using fallback model.")
            model = xgb.XGBRegressor()
            X_mock = np.random.rand(10, len(feature_cols))
            y_mock = np.random.rand(10)
            model.fit(X_mock, y_mock)
        else:
            X = class_df[feature_cols]
            y = class_df['position']
            
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=RANDOM_SEED)
            
            model = xgb.XGBRegressor(n_estimators=100, max_depth=5, random_state=RANDOM_SEED)
            model.fit(X_train, y_train)
            
            score = model.score(X_test, y_test)
            trained_metrics[cls] = float(score)
            print(f"Score for {cls}: {score}")

        # Save model
        joblib.dump(model, MODELS_DIR / f"imec_s3_{cls}.pkl")

    # Save metadata
    with open(MODELS_DIR / "model_metadata.json", "w") as f:
        json.dump({
            "version": "1.2",
            "classes": target_classes,
            "features": feature_cols,
            "metrics": trained_metrics
        }, f)

if __name__ == "__main__":
    train_models()
