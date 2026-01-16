import cv2
import numpy as np
import pickle
from pathlib import Path
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, classification_report
from preprocessing.image_pipeline import resize_letterbox, extract_features_mobilenet

def load_dataset(base_path: Path):
    X, y = [], []
    classes = sorted([p.name for p in base_path.iterdir() if p.is_dir()])
    
    for label, class_name in enumerate(classes):
        class_path = base_path / class_name
        for img_path in class_path.iterdir():
            if not img_path.is_file(): continue
            image = cv2.imread(str(img_path))
            if image is None: continue
            
            # Processamento idêntico para todas as imagens 
            image_ready = resize_letterbox(image)
            features = extract_features_mobilenet(image_ready)
            X.append(features)
            y.append(label)
            
    return np.array(X), np.array(y), classes

# Definição de caminhos
BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR / "dataset"

# Carregamento dos dados [cite: 23]
print("Iniciando carregamento e extração de características...")
X_train, y_train, classes = load_dataset(DATASET_DIR / "train")
X_test, y_test, _ = load_dataset(DATASET_DIR / "test")

# Treinamento com Naive Bayes conforme requisito 
model = GaussianNB()
model.fit(X_train, y_train)

# Avaliação [cite: 27]
y_pred = model.predict(X_test)
print(f"Nova Acurácia com MobileNetV2: {accuracy_score(y_test, y_pred) * 100:.2f}%")
print(classification_report(y_test, y_pred, target_names=classes))

# Salvamento do modelo [cite: 31]
MODEL_PATH = BASE_DIR.parent / "model" / "naive_bayes_acidentes.pkl"
MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
with open(MODEL_PATH, "wb") as f:
    pickle.dump({"model": model, "classes": classes}, f)
print(f"Modelo salvo em: {MODEL_PATH}")