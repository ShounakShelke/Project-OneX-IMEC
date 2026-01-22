import requests
import json
import argparse

def predict_cli(input_file):
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    response = requests.post("http://localhost:8000/predict", json=data)
    print(json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("input_file", help="JSON file with prediction input")
    args = parser.parse_args()
    predict_cli(args.input_file)
