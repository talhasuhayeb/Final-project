from flask import Flask, request, jsonify ,request, render_template
import numpy as np
import tensorflow as tf
import cv2
import os
import ssl
from werkzeug.utils import secure_filename
from tensorflow.keras.preprocessing.image import load_img, img_to_array,save_img
ssl._create_default_https_context = ssl._create_unverified_context
from flask_cors import CORS

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

@app.route('/predict', methods=['POST'])
def predict():
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
        img = preprocess_image(file_path)
        predictions = model.predict(img)
        predicted_class = int(np.argmax(predictions[0]))
        print("Predicted class is : ", predicted_class)
        
        class_names = ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-']   
        predicted_label = class_names[predicted_class]
        
        return jsonify({
            'predicted_class': predicted_class,
            'predicted_label': predicted_label,
            'confidence': float(np.max(predictions[0]))
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
            
            
if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(host='0.0.0.0', port=5000, debug=True)
    
    



