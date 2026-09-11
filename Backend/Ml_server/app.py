from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import cv2
import os
import ssl
import time
from datetime import datetime
from werkzeug.utils import secure_filename
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from flask_cors import CORS

app = Flask(__name__)

CORS(app, origins=os.getenv("FRONTEND_URL", "*"))

ssl._create_default_https_context = ssl._create_unverified_context

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

MODEL_PATH = os.path.join(BASE_DIR, "model.h5")

print("MODEL PATH:", MODEL_PATH)
print("MODEL EXISTS:", os.path.exists(MODEL_PATH))

if os.path.exists(MODEL_PATH):
    print("MODEL SIZE:", os.path.getsize(MODEL_PATH))
    with open(MODEL_PATH, "rb") as f:
        print("MODEL HEADER:", f.read(8))

model = tf.keras.models.load_model(MODEL_PATH)

print("Model loaded successfully")

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

    if 'file' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename):
        return jsonify({
            'error': 'Invalid file type. Allowed types are png, jpg, jpeg, bmp'
        }), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    try:
        file.save(file_path)

        quality_score = calculate_image_quality(file_path)

        img = preprocess_image(file_path)
        predictions = model.predict(img, verbose=0)

        predicted_class = int(np.argmax(predictions[0]))

        print("Predicted class is:", predicted_class)

        class_names = [
            'A+', 'A-', 'AB+', 'AB-',
            'B+', 'B-', 'O+', 'O-'
        ]

        predicted_label = class_names[predicted_class]

        confidence = float(np.max(predictions[0]))

        processing_time = round(
            (time.time() - start_time) * 1000, 2
        )

        timestamp = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

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
        return jsonify({'error': str(e)}), 500

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000)),
        debug=False
    )
