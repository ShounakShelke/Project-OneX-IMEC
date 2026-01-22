import os
import glob
import pandas as pd
import numpy as np
import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
# Assuming IMSA Data is at ../IMSA Data relative to IMECvS3 folder
RAW_DATA_PATH = BASE_DIR.parent / "IMSA Data"
PROCESSED_DATA_PATH = BASE_DIR / "data" / "processed"
PROCESSED_DATA_PATH.mkdir(parents=True, exist_ok=True)

CLASS_MAPPING = {
    "DPi": "GTP",
    "GTP": "GTP",
    "LMP2": "LMP2",
    "LMP3": "LMP2", 
    "GTLM": "GTD_PRO",
    "GTD PRO": "GTD_PRO",
    "GTD": "GTD"
}

def load_data():
    print(f"Loading data from {RAW_DATA_PATH}...")
    
    all_results = []
    
    # Iterate years 2021-2024
    years = ["2021", "2022", "2023", "2024"]
    
    for year in years:
        year_path = RAW_DATA_PATH / year
        if not year_path.exists():
            continue
            
        print(f"Processing {year}...")
        for event_dir in glob.glob(str(year_path / "*")):
            if not os.path.isdir(event_dir): continue
            
            # Look for race results
            results_files = glob.glob(os.path.join(event_dir, "*race-results.csv"))
            if not results_files:
                continue
                
            df = pd.read_csv(results_files[0])
            
            # Normalize column names
            df.columns = [c.strip().lower() for c in df.columns]
            
            # Map car classes to standard categories
            if 'class' in df.columns:
                df['standard_class'] = df['class'].map(CLASS_MAPPING).fillna(df['class'])
            else:
                df['standard_class'] = 'Unknown'
            
            # Standardize column naming conventions
            if 'pos' in df.columns: df.rename(columns={'pos': 'position'}, inplace=True)
            if 'no' in df.columns: df.rename(columns={'no': 'number'}, inplace=True)
            if 'best lap' in df.columns: df.rename(columns={'best lap': 'best_lap'}, inplace=True)
            
            all_results.append(df)

    if not all_results:
        return pd.DataFrame()
        
    final_df = pd.concat(all_results, ignore_index=True)
    
    # Ensure object columns are strings via astype(str) to avoid Parquet mixed-type errors
    for col in final_df.columns:
        if final_df[col].dtype == 'object':
            final_df[col] = final_df[col].astype(str)
            
    return final_df

if __name__ == "__main__":
    df = load_data()
    if not df.empty:
        output_file = PROCESSED_DATA_PATH / "imsa_processed_history.parquet"
        df.to_parquet(output_file)
        print(f"Saved {len(df)} records to {output_file}")
    else:
        print("No data found.")
