import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
import cv2
import os
import mediapipe as mp
import json

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.5)

def extract_landmarks(image_path):
    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = hands.process(image_rgb)
    
    if results.multi_hand_landmarks:
        landmarks = results.multi_hand_landmarks[0]
        # Convert landmarks to flat array
        return np.array([[lm.x, lm.y, lm.z] for lm in landmarks.landmark]).flatten()
    return None

# Define gestures
gestures = ['Hello', 'Yes', 'No', 'Thanks', 'Good_Afternoon']

# Prepare dataset
X = []
y = []

# Assuming images are saved in a 'training_data' directory
for gesture_idx, gesture in enumerate(gestures):
    gesture_dir = f'training_data/{gesture}'
    if os.path.exists(gesture_dir):
        for image_file in os.listdir(gesture_dir):
            if image_file.endswith('.jpg'):
                image_path = os.path.join(gesture_dir, image_file)
                landmarks = extract_landmarks(image_path)
                if landmarks is not None:
                    X.append(landmarks)
                    y.append(gesture_idx)

X = np.array(X)
y = np.array(y)

# Create and train the model
model = models.Sequential([
    layers.Dense(128, activation='relu', input_shape=(63,)),  # 21 landmarks * 3 coordinates
    layers.Dropout(0.5),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(len(gestures), activation='softmax')
])

model.compile(optimizer='adam',
             loss='sparse_categorical_crossentropy',
             metrics=['accuracy'])

# Train the model
model.fit(X, y, epochs=50, validation_split=0.2)

# Save the model
model.save('gesture_model.h5')

# Save gesture labels
with open('gesture_labels.json', 'w') as f:
    json.dump(gestures, f)

print("Training completed and model saved!")