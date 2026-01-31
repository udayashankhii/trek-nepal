import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# 1. LOAD DATA
# We use read_csv even for .txt files if the data is separated by commas
try:
    print("📂 Loading data...")
    df = pd.read_csv('data/weatherData2.txt') # <--- CHANGE THIS to your actual filename
except FileNotFoundError:
    print("❌ Error: Could not find your text file. Make sure the name is correct.")
    exit()

# 2. DEFINE FEATURES (The inputs) & TARGET (The output)
# These must match the columns in your text file
features = [
    'month', 'min_temp', 'max_temp', 'avg_wind_speed', 
    'total_rainfall', 'snowfall_days', 'visibility_index', 
    'elevation', 'wind_chill', 'precip_3d_sum', 
    'is_extreme_wind', 'diurnal_range'
]
target = 'safety_label' # 0=Dangerous, 1=Caution, 2=Safe

X = df[features]
y = df[target]

# 3. SPLIT DATA (80% for training, 20% for testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. TRAIN THE MODEL
print("🧠 Training the XGBoost model... (this might take a moment)")
model = xgb.XGBClassifier(
    objective='multi:softmax', # Multi-class classification
    num_class=3,               # We have 3 labels: 0, 1, 2
    n_estimators=100,          # Number of "trees" in the forest
    learning_rate=0.1,
    max_depth=5
)

model.fit(X_train, y_train)

# 5. TEST ACCURACY
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"✅ Training Complete! Model Accuracy: {accuracy * 100:.1f}%")

# 6. SAVE THE BRAIN
joblib.dump(model, 'trek_safety_model.pkl')
print("💾 Model saved to 'trek_safety_model.pkl'. NOW you are ready!")