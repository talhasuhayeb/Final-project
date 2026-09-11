import os
# Configure TensorFlow to run strictly on CPU and suppress CUDA/GPU warnings & errors on Render
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["PYTHONUNBUFFERED"] = "1"

from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import cv2
import ssl
import time
from datetime import datetime
from werkzeug.utils import secure_filename
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from flask_cors import CORS

app = Flask(__name__)

# Allow cross-origin requests from any origin (e.g. deployed frontend or local dev)
CORS(app, resources={r"/*": {"origins": "*"}})

ssl._create_default_https_context = ssl._create_unverified_context

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

MODEL_PATH = os.path.join(BASE_DIR, "model.h5")

print("MODEL PATH:", MODEL_PATH, flush=True)
print("MODEL EXISTS:", os.path.exists(MODEL_PATH), flush=True)

_model = None

def get_model():
    """Load and warm up model safely inside the process to avoid fork deadlocks."""
    global _model
    if _model is None:
        print("Loading model from disk...", flush=True)
        _model = tf.keras.models.load_model(MODEL_PATH)
        print("Warming up model graph...", flush=True)
        dummy = np.zeros((1, 64, 64, 3), dtype=np.float32)
        # Fast direct execution avoids model.predict() thread/iterator deadlocks in WSGI
        _ = _model(dummy, training=False)
        print("Model loaded and warmed up successfully!", flush=True)
    return _model

# Pre-warm model on startup so port opens with model ready
try:
    get_model()
except Exception as e:
    print(f"Warning: Initial model load failed: {e}", flush=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    img = load_img(image_path, target_size=(64, 64))
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def calculate_image_quality(image_path):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    if img is None:
        return 0.0

    contrast = np.std(img)

    laplacian = cv2.Laplacian(img, cv2.CV_64F)
    sharpness = laplacian.var()

    quality_score = min(
        100,
        (contrast / 255.0 * 50) +
        (sharpness / 1000.0 * 50)
    )

    return round(quality_score, 2)


@app.route('/')
def home():
    return jsonify({
        'status': 'success',
        'message': 'Blood Detection ML Server is running'
    })


@app.route('/predict', methods=['POST'])
def predict():
    start_time = time.time()
    print("--> Received /predict request", flush=True)

    if 'file' not in request.files:
        print("Error: No image uploaded in request", flush=True)
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['file']

    if file.filename == '':
        print("Error: No selected file", flush=True)
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename):
        print(f"Error: Invalid file type {file.filename}", flush=True)
        return jsonify({
            'error': 'Invalid file type. Allowed types are png, jpg, jpeg, bmp'
        }), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    try:
        file.save(file_path)
        print(f"File saved to {file_path}", flush=True)

        quality_score = calculate_image_quality(file_path)
        print(f"Image quality score: {quality_score}", flush=True)

        img = preprocess_image(file_path)
        print("Image preprocessed, running model inference...", flush=True)

        model = get_model()
        raw_predictions = model(img, training=False).numpy()
        print("Inference completed successfully!", flush=True)

        predicted_class = int(np.argmax(raw_predictions[0]))
        print("Predicted class is:", predicted_class, flush=True)

        class_names = [
            'A+', 'A-', 'AB+', 'AB-',
            'B+', 'B-', 'O+', 'O-'
        ]

        predicted_label = class_names[predicted_class]
        confidence = float(np.max(raw_predictions[0]))

        processing_time = round(
            (time.time() - start_time) * 1000, 2
        )

        timestamp = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

        print(f"Prediction result: {predicted_label} ({round(confidence * 100, 2)}%) in {processing_time}ms", flush=True)

        return jsonify({
            'predicted_class': predicted_class,
            'predicted_label': predicted_label,
            'confidence': confidence,
            'confidence_percentage': round(confidence * 100, 2),
            'processing_time': processing_time,
            'image_quality_score': quality_score,
            'timestamp': timestamp,
            'filename': filename
        })

    except Exception as e:
        print(f"Prediction error: {str(e)}", flush=True)
        return jsonify({'error': str(e)}), 500

    finally:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000)),
        debug=False
    )

