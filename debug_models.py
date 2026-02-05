import os
import sys
import traceback
from safe_dates import ModelEnsemble

print("Starting debug...", file=sys.stderr)
try:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_dir = os.path.join(base_dir, "models_optimized") + os.sep
    print(f"Path: {model_dir}", file=sys.stderr)
    
    if not os.path.exists(model_dir):
        print("Directory does not exist", file=sys.stderr)
    else:
        print(f"Directory exists. items: {os.listdir(model_dir)}", file=sys.stderr)
        
    m = ModelEnsemble(model_path=model_dir)
    print(f"Success. Models: {len(m.models)}", file=sys.stderr)
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    traceback.print_exc()