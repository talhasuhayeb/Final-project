import os
# Suppress unnecessary warnings
os.environ["PYTHONUNBUFFERED"] = "1"

from flask import Flask, request, jsonify
import numpy as np
import cv2
import time
from datetime import datetime
from werkzeug.utils import secure_filename
from PIL import Image
from flask_cors import CORS

# Use lightweight LiteRT/TFLite interpreter instead of full tensorflow
try:
    from ai_edge_litert.interpreter import Interpreter as LiteInterpreter
    print("Using ai-edge-litert (LiteRT)", flush=True)
    _USE_LITERT = True
except ImportError:
    try:
        import tflite_runtime.interpreter as tflite_mod
        LiteInterpreter = tflite_mod.Interpreter
        print("Using tflite-runtime", flush=True)
        _USE_LITERT = True
    except ImportError:
        # Fallback: use tf.lite if neither litert nor tflite_runtime available (e.g. local dev)
        import tensorflow as tf
        LiteInterpreter = tf.lite.Interpreter
        print("Using tensorflow.lite fallback", flush=True)
        _USE_LITERT = True


app = Flask(__name__)

# Allow cross-origin requests from any origin (e.g. deployed frontend or local dev)
CORS(app, resources={r"/*": {"origins": "*"}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

MODEL_PATH = os.path.join(BASE_DIR, "model.tflite")

print("MODEL PATH:", MODEL_PATH, flush=True)
print("MODEL EXISTS:", os.path.exists(MODEL_PATH), flush=True)

_interpreter = None
_input_details = None
_output_details = None

def get_interpreter():
    """Load TFLite interpreter and warm it up."""
    global _interpreter, _input_details, _output_details
    if _interpreter is None:
        print("Loading TFLite model from disk...", flush=True)
        _interpreter = LiteInterpreter(model_path=MODEL_PATH)
        _interpreter.allocate_tensors()
        _input_details = _interpreter.get_input_details()
        _output_details = _interpreter.get_output_details()
        print(f"  Input shape: {_input_details[0]['shape']}", flush=True)
        print(f"  Output shape: {_output_details[0]['shape']}", flush=True)

        # Warm up with a dummy inference
        print("Warming up model...", flush=True)
        dummy = np.zeros((1, 64, 64, 3), dtype=np.float32)
        _interpreter.set_tensor(_input_details[0]['index'], dummy)
        _interpreter.invoke()
        print("Model loaded and warmed up successfully!", flush=True)
    return _interpreter, _input_details, _output_details

# Pre-warm model on startup so port opens with model ready
try:
    get_interpreter()
except Exception as e:
    print(f"Warning: Initial model load failed: {e}", flush=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    img = Image.open(image_path).convert('RGB').resize((64, 64))
    img_array = np.array(img, dtype=np.float32)
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
        'message': 'Blood Detection ML Server is running (TFLite)'
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

        interpreter, input_details, output_details = get_interpreter()
        interpreter.set_tensor(input_details[0]['index'], img)
        interpreter.invoke()
        raw_predictions = interpreter.get_tensor(output_details[0]['index'])
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
