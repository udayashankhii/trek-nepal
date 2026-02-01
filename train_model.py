"""
Trek Safety Model Training Script
==================================
Trains an XGBoost model to predict trek safety: Dangerous, Caution, or Safe
"""

import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import matplotlib.pyplot as plt

# ===================================================================
# 1. LOAD DATA
# ===================================================================
try:
    print("📂 Loading data...")
    df = pd.read_csv('data/weatherData3.txt')
    print(f"✅ Loaded {len(df):,} records for {df['trek_name'].nunique()} treks")
    print(f"   Date range: {df['year'].min()}-{df['year'].max()}")
except FileNotFoundError:
    print("❌ Error: Could not find 'data/weatherData2.txt'")
    print("   Make sure the file exists in the 'data/' folder!")
    exit()

# ===================================================================
# 2. DEFINE FEATURES (The inputs) & TARGET (The output)
# ===================================================================
features = [
    'month', 'min_temp', 'max_temp', 'avg_wind_speed', 
    'total_rainfall', 'snowfall_days', 'visibility_index', 
    'elevation', 'wind_chill', 'precip_3d_sum', 
    'is_extreme_wind', 'diurnal_range'
]
target = 'safety_label'  # 0=Dangerous, 1=Caution, 2=Safe

X = df[features]
y = df[target]

print(f"\n📊 Label Distribution:")
print(f"   Dangerous (0): {(y == 0).sum():,} ({(y == 0).sum() / len(y) * 100:.1f}%)")
print(f"   Caution (1):   {(y == 1).sum():,} ({(y == 1).sum() / len(y) * 100:.1f}%)")
print(f"   Safe (2):      {(y == 2).sum():,} ({(y == 2).sum() / len(y) * 100:.1f}%)")

# ===================================================================
# 3. SPLIT DATA (80% for training, 20% for testing)
# ===================================================================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2, 
    random_state=42,
    stratify=y  # Keep same label distribution in train/test
)

print(f"\n📦 Data Split:")
print(f"   Training samples: {len(X_train):,}")
print(f"   Testing samples:  {len(X_test):,}")

# ===================================================================
# 4. TRAIN THE MODEL
# ===================================================================
print("\n🧠 Training the XGBoost model... (this might take a moment)")

model = xgb.XGBClassifier(
    objective='multi:softmax',  # Multi-class classification
    num_class=3,                # We have 3 labels: 0, 1, 2
    n_estimators=100,           # Number of "trees" in the forest
    learning_rate=0.1,
    max_depth=5,
    random_state=42             # For reproducibility
)

model.fit(X_train, y_train)
print("✅ Training complete!")

# ===================================================================
# 5. TEST ACCURACY
# ===================================================================
print("\n🎯 Evaluating model performance...")

predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)

print(f"\n✅ Model Accuracy: {accuracy * 100:.1f}%")

# Detailed breakdown
print("\n📋 Classification Report:")
print(classification_report(
    y_test, predictions, 
    target_names=['Dangerous', 'Caution', 'Safe'],
    digits=3
))

# ===================================================================
# 6. VISUALIZE THE "BRAIN" (Pro-Tip #3!)
# ===================================================================
print("🧠 Analyzing what the model thinks is important...")

# Create feature importance plot
plt.figure(figsize=(10, 6))
xgb.plot_importance(model, max_num_features=12, importance_type='gain')
plt.title('Feature Importance: What Matters Most for Trek Safety?', 
          fontsize=14, fontweight='bold')
plt.xlabel('Importance Score', fontsize=12)
plt.tight_layout()

try:
    plt.savefig('feature_importance.png', dpi=300, bbox_inches='tight')
    print("✅ Feature importance graph saved as 'feature_importance.png'")
except Exception as e:
    print(f"⚠️  Could not save graph (matplotlib may need display): {e}")

# Print feature importance as text
print("\n📊 Feature Importance Ranking:")
feature_scores = pd.DataFrame({
    'Feature': features,
    'Importance': model.feature_importances_
}).sort_values('Importance', ascending=False)

for idx, row in feature_scores.iterrows():
    bar = '█' * int(row['Importance'] * 50)
    print(f"   {row['Feature']:20s} {bar} {row['Importance']:.4f}")

# ===================================================================
# 7. SAVE THE BRAIN
# ===================================================================
print("\n💾 Saving the trained model...")
joblib.dump(model, 'trek_safety_model.pkl')
print("✅ Model saved to 'trek_safety_model.pkl'")

# ===================================================================
# 8. FINAL SUMMARY
# ===================================================================
print("\n" + "="*60)
print("🎉 TRAINING COMPLETE!")
print("="*60)
print(f"✅ Model Accuracy:     {accuracy * 100:.1f}%")
print(f"✅ Model File:         trek_safety_model.pkl")
print(f"✅ Feature Graph:      feature_importance.png")
print(f"✅ Total Features:     {len(features)}")
print(f"✅ Training Samples:   {len(X_train):,}")
print("\n💡 Next Steps:")
print("   1. Check 'feature_importance.png' to see what drives predictions")
print("   2. Use the model in your Flask app (it's already configured!)")
print("   3. The model loads ONCE in predictor.py for speed ⚡")
print("="*60)