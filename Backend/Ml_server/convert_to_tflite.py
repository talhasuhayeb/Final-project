"""
Convert the Keras .h5 model to TensorFlow Lite (.tflite) format.

Run this LOCALLY (not on Render) since it needs full TensorFlow:
    python convert_to_tflite.py

This will create 'model.tflite' in the same directory.
"""
import os
import numpy as np
import tensorflow as tf

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
H5_PATH = os.path.join(BASE_DIR, "model.h5")
TFLITE_PATH = os.path.join(BASE_DIR, "model.tflite")

print(f"Loading Keras model from: {H5_PATH}")
model = tf.keras.models.load_model(H5_PATH)
model.summary()

# Convert to TFLite with float16 quantization for smaller size
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.target_spec.supported_types = [tf.float16]

print("Converting to TFLite with float16 quantization...")
tflite_model = converter.convert()

# Save the model
with open(TFLITE_PATH, 'wb') as f:
    f.write(tflite_model)

h5_size = os.path.getsize(H5_PATH) / (1024 * 1024)
tflite_size = os.path.getsize(TFLITE_PATH) / (1024 * 1024)
print(f"\nConversion complete!")
print(f"  Original .h5:  {h5_size:.2f} MB")
print(f"  TFLite:        {tflite_size:.2f} MB")
print(f"  Size reduction: {(1 - tflite_size/h5_size) * 100:.1f}%")

# Verify the TFLite model works
print("\nVerifying TFLite model...")
interpreter = tf.lite.Interpreter(model_path=TFLITE_PATH)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

print(f"  Input shape:  {input_details[0]['shape']}")
print(f"  Input dtype:  {input_details[0]['dtype']}")
print(f"  Output shape: {output_details[0]['shape']}")

# Test with dummy input
dummy = np.zeros((1, 64, 64, 3), dtype=np.float32)
interpreter.set_tensor(input_details[0]['index'], dummy)
interpreter.invoke()
output = interpreter.get_tensor(output_details[0]['index'])
print(f"  Test output shape: {output.shape}")
print(f"  Test output: {output[0]}")
print("\n✅ TFLite model verified successfully!")
