import sys
import json
import pickle
import cv2
import numpy as np
import os

# Ensure protobuf compatibility
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

try:
    import tensorflow as tf
    tf.get_logger().setLevel('ERROR')
except Exception as e:
    print(json.dumps({"error": f"TensorFlow import failed: {e}"}))
    sys.exit(1)

try:
    import mediapipe as mp
except Exception as e:
    print(json.dumps({"error": f"MediaPipe import failed: {e}"}))
    sys.exit(1)

IMG_SIZE = 224
NUM_LANDMARKS = 21
NUM_COORDS = 2
NUM_CLASSES = 18

def build_dual_input_model(num_classes):
    from tensorflow.keras.models import Model
    from tensorflow.keras.layers import Input, Dense, Concatenate, GlobalAveragePooling2D, Dropout
    from tensorflow.keras.applications import EfficientNetB0

    image_input = Input(shape=(IMG_SIZE, IMG_SIZE, 3), name='image_input')
    base_model = EfficientNetB0(include_top=False, weights=None, input_tensor=image_input)
    base_model.trainable = False
    x = GlobalAveragePooling2D()(base_model.output)
    x = Dropout(0.5)(x)
    image_features = Dense(128, activation='relu')(x)

    landmark_input = Input(shape=(NUM_LANDMARKS * NUM_COORDS,), name='landmark_input')
    y = Dense(32, activation='relu')(landmark_input)
    y = Dropout(0.3)(y)
    landmark_features = Dense(64, activation='relu')(y)

    combined = Concatenate()([image_features, landmark_features])
    z = Dense(64, activation='relu')(combined)
    z = Dropout(0.5)(z)
    output = Dense(num_classes, activation='softmax', name='output')(z)

    return Model(inputs=[image_input, landmark_input], outputs=output)

def to_safe_json(result):
    def safe(v):
        if isinstance(v, (np.floating,)):
            return float(v)
        if isinstance(v, (np.integer,)):
            return int(v)
        return v
    if 'boundingBoxes' in result:
        safe_boxes = []
        for b in result['boundingBoxes']:
            safe_boxes.append({
                'x': int(b.get('x', 0)),
                'y': int(b.get('y', 0)),
                'width': int(b.get('width', 0)),
                'height': int(b.get('height', 0)),
                'label': str(b.get('label', 'Hand')),
                'confidence': float(b.get('confidence', 0.0)),
            })
        result['boundingBoxes'] = safe_boxes
    result['confidence'] = float(result.get('confidence', 0.0))
    result['prediction'] = str(result.get('prediction', ''))
    result['gestureLabel'] = str(result.get('gestureLabel', ''))
    result['processingTime'] = int(result.get('processingTime', 0))
    return result

def main():
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: python gestureWorker.py <model_path> <label_encoder_path>"}))
        sys.exit(1)

    model_path = sys.argv[1]
    label_path = sys.argv[2]

    # Load model and encoder once
    model = build_dual_input_model(NUM_CLASSES)
    model.load_weights(model_path)
    with open(label_path, 'rb') as f:
        label_encoder = pickle.load(f)

    # Init mediapipe hands once
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.7)

    # Worker loop: read image paths from stdin
    for line in sys.stdin:
        image_path = line.strip()
        if not image_path:
            continue
        try:
            frame = cv2.imread(image_path)
            if frame is None:
                print(json.dumps({"success": True, "prediction": "No Hand Detected", "confidence": 0.0, "boundingBoxes": [], "gestureLabel": "", "processingTime": 0 }))
                sys.stdout.flush()
                continue

            if len(frame.shape) == 2 or frame.shape[2] == 1:
                frame = cv2.cvtColor(frame, cv2.COLOR_GRAY2BGR)

            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(frame_rgb)

            display_text = "No Hand Detected"
            confidence = 0.0
            bbox = []
            gesture_label = ""

            if results.multi_hand_landmarks:
                hand_landmarks = results.multi_hand_landmarks[0]
                points = []
                xs, ys = [], []
                for lm in hand_landmarks.landmark:
                    points.extend([lm.x, lm.y])
                    xs.append(lm.x); ys.append(lm.y)
                processed_landmarks = np.expand_dims(np.array(points, dtype=np.float32), axis=0)

                resized_frame = cv2.resize(frame_rgb, (IMG_SIZE, IMG_SIZE))
                image_array_expanded = np.expand_dims(resized_frame, axis=0)
                processed_image = tf.keras.applications.efficientnet.preprocess_input(image_array_expanded)

                probs = model.predict({'image_input': processed_image, 'landmark_input': processed_landmarks}, verbose=0)
                idx = int(np.argmax(probs, axis=1)[0])
                confidence = float(np.max(probs))

                if confidence > 0.4:
                    gesture_label = str(label_encoder.inverse_transform([idx])[0])
                    display_text = f"{gesture_label} ({confidence:.0%})"

                if xs and ys:
                    x_min = max(min(xs), 0.0); y_min = max(min(ys), 0.0)
                    x_max = min(max(xs), 1.0); y_max = min(max(ys), 1.0)
                    h, w, _ = frame.shape
                    bbox = [{
                        'x': int(x_min * w), 'y': int(y_min * h),
                        'width': int((x_max - x_min) * w), 'height': int((y_max - y_min) * h),
                        'label': 'Hand', 'confidence': confidence
                    }]

            result = {
                'success': True,
                'prediction': display_text,
                'confidence': confidence,
                'boundingBoxes': bbox,
                'gestureLabel': gesture_label,
                'processingTime': 0,
                'probabilities': []
            }
            print(json.dumps(to_safe_json(result)))
            sys.stdout.flush()
        except Exception as e:
            print(json.dumps({"success": False, "error": str(e)}))
            sys.stdout.flush()

if __name__ == '__main__':
    main()


