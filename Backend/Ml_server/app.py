from flask import Flask, request, jsonify ,request, render_template
import numpy as np
import tensorflow as tf
import cv2
import os
import ssl
import time
from datetime import datetime
from werkzeug.utils import secure_filename
from tensorflow.keras.preprocessing.image import load_img, img_to_array,save_img
ssl._create_default_https_context = ssl._create_unverified_context
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

model = tf.keras.models.load_model('model.h5')
print("Model loaded successfully")
model.summary()

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    img = load_img(image_path, target_size=(64, 64))
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Ensure channel dimension is present
    return img_array

def calculate_image_quality(image_path):
    """Calculate a simple image quality score based on contrast and sharpness"""
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return 0.0
    
    # Calculate contrast (standard deviation of pixel intensities)
    contrast = np.std(img)
    
    # Calculate sharpness using Laplacian variance
    laplacian = cv2.Laplacian(img, cv2.CV_64F)
    sharpness = laplacian.var()
    
    # Normalize and combine metrics (simple heuristic)
    quality_score = min(100, (contrast / 255.0 * 50) + (sharpness / 1000.0 * 50))
    return round(quality_score, 2)

@app.route('/predict', methods=['POST'])
def predict():
    start_time = time.time()
    
    if 'file' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'invalid file type. Allowed types are png, jpg, jpeg, bmp'}), 400
    
    filename = secure_filename(file.filename)
    file_path = os.path.join('uploads', filename)
    file.save(file_path)
    
    try:
        # Calculate image quality
        quality_score = calculate_image_quality(file_path)
        
        # Preprocess and predict
        img = preprocess_image(file_path)
        predictions = model.predict(img)
        predicted_class = int(np.argmax(predictions[0]))
        print("Predicted class is : ", predicted_class)
        
        # Calculate processing time
        processing_time = round((time.time() - start_time) * 1000, 2)  # in milliseconds
        
        class_names = ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-']   
        predicted_label = class_names[predicted_class]
        confidence = float(np.max(predictions[0]))
        
        # Get current timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
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
    
if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(host='0.0.0.0', port=5000, debug=True)





