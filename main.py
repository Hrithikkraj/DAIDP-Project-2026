import io
import logging
from typing import Dict, Any, List
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from PIL import Image
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms
from torchvision.models import resnet50, vgg16, efficientnet_b3
import json
import pandas as pd
from pydantic import BaseModel
import os
import uuid
from fastapi.staticfiles import StaticFiles

# --- Model Classes ---

class BaseVisionModel:
    def __init__(self, model_name: str, model_path: str):
        self.model_name = model_name
        self.model = self.load_model(model_path)

    def load_model(self, model_path: str): pass
    def preprocess(self, image: Image.Image): pass
    def predict(self, preprocessed_input) -> Dict[str, Any]: pass

    def run(self, image: Image.Image) -> Dict[str, Any]:
        try:
            processed_data = self.preprocess(image)
            result = self.predict(processed_data)
            return {"status": "success", "data": result}
        except Exception as e:
            return {"status": "error", "message": str(e)}

class SkinTypeResNetModel(BaseVisionModel):
    def __init__(self, model_name: str, model_path: str):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.label_map = {0: "dry", 1: "oily"}
        super().__init__(model_name, model_path)

    def load_model(self, model_path: str) -> nn.Module:
        model = resnet50() 
        model.fc = nn.Linear(model.fc.in_features, 2)
        state_dict = torch.load(model_path, map_location=self.device, weights_only=True)
        model.load_state_dict(state_dict)
        model.to(self.device)
        model.eval()
        return model

    def preprocess(self, image: Image.Image) -> torch.Tensor:
        transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        return transform(image).unsqueeze(0).to(self.device)

    def predict(self, preprocessed_input: torch.Tensor) -> Dict[str, Any]:
        with torch.no_grad():
            outputs = self.model(preprocessed_input)
            probabilities = F.softmax(outputs, dim=1)
            confidence, pred_idx = torch.max(probabilities, 1)
            return {
                "predicted_class": self.label_map[pred_idx.item()],
                "confidence": round(confidence.item(), 4),
                "all_probabilities": {
                    "dry": round(probabilities[0][0].item(), 4),
                    "oily": round(probabilities[0][1].item(), 4)
                }
            }

class Fitzpatrick17kModel(BaseVisionModel):
    def __init__(self, model_name: str, model_path: str, label_map_path: str):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Load the specific label map passed during initialization
        with open(label_map_path, 'r') as f:
            self.label_map = json.load(f)
            
        self.num_classes = len(self.label_map)
        super().__init__(model_name, model_path)

    def load_model(self, model_path: str) -> nn.Module:
        model = vgg16()
        model.classifier[6] = nn.Sequential(
            nn.Linear(4096, 256), 
            nn.ReLU(), 
            nn.Dropout(0.4),
            nn.Linear(256, self.num_classes),                   
            nn.LogSoftmax(dim=1)
        )
        
        state_dict = torch.load(model_path, map_location=self.device, weights_only=True)

        clean_state_dict = {}
        for key, value in state_dict.items():
            if key.startswith('module.'):
                clean_state_dict[key[7:]] = value 
            else:
                clean_state_dict[key] = value
                
        model.load_state_dict(clean_state_dict)
        model.to(self.device)
        model.eval()
        return model
    
    def preprocess(self, image: Image.Image) -> torch.Tensor:
        transform = transforms.Compose([
            transforms.Resize(size=256),
            transforms.CenterCrop(size=224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
            ])
        return transform(image).unsqueeze(0).to(self.device)
    
    def predict(self, preprocessed_input: torch.Tensor) -> Dict[str, Any]:
        with torch.no_grad():
            outputs = self.model(preprocessed_input)
            probabilities = torch.exp(outputs)
            confidence, pred_idx = torch.max(probabilities, 1)
            return {
                "predicted_class": self.label_map[str(pred_idx.item())],
                "confidence": round(confidence.item(), 4),
                "all_probabilities": {
                    self.label_map[str(idx)]: round(probabilities[0][idx].item(), 4) 
                    for idx in range(self.num_classes) 
                }
            }

class ConditionClassifier(BaseVisionModel):
    def __init__(self, model_name: str, model_path: str):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        # Hardcoded from your script
        self.class_map = {
            0: "Acne",
            1: "Dry",
            2: "Normal",
            3: "Oily",
            4: "Pigmentation"
        }
        super().__init__(model_name, model_path)

    def load_model(self, model_path: str) -> nn.Module:
        model = efficientnet_b3()
        num_ftrs = model.classifier[1].in_features
        # Modify for 5 classes
        model.classifier[1] = nn.Linear(num_ftrs, 5) 
        
        state_dict = torch.load(model_path, map_location=self.device, weights_only=True)
        model.load_state_dict(state_dict)
        model.to(self.device)
        model.eval()
        return model

    def preprocess(self, image: Image.Image) -> torch.Tensor:
        # Note: EfficientNetB3 in your script used 300x300, not 224x224
        transform = transforms.Compose([
            transforms.Resize((300, 300)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        return transform(image).unsqueeze(0).to(self.device)

    def predict(self, preprocessed_input: torch.Tensor) -> Dict[str, Any]:
        with torch.no_grad():
            outputs = self.model(preprocessed_input)
            
            # Use outputs[0] because your batch size is 1
            probabilities = F.softmax(outputs[0], dim=0)
            confidence, pred_idx = torch.max(probabilities, 0)
            
            pred_label = self.class_map.get(pred_idx.item(), "Unknown")

            return {
                "predicted_class": pred_label,
                "confidence": round(confidence.item(), 4),
                "all_probabilities": {
                    self.class_map[i]: round(probabilities[i].item(), 4) for i in range(5)
                }
            }
        
class SeverityRegressor(BaseVisionModel):
    def __init__(self, model_name: str, model_path: str):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        super().__init__(model_name, model_path)

    def load_model(self, model_path: str) -> nn.Module:
        model = efficientnet_b3()
        num_ftrs = model.classifier[1].in_features
        
        # Modify for Regression (Sequential block ending in 1 output)
        model.classifier[1] = nn.Sequential(
            nn.Linear(num_ftrs, 512),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(512, 1)
        )
        
        state_dict = torch.load(model_path, map_location=self.device, weights_only=True)
        model.load_state_dict(state_dict)
        model.to(self.device)
        model.eval()
        return model

    def preprocess(self, image: Image.Image) -> torch.Tensor:
        # Same preprocessing as the classifier
        transform = transforms.Compose([
            transforms.Resize((300, 300)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        return transform(image).unsqueeze(0).to(self.device)

    def predict(self, preprocessed_input: torch.Tensor) -> Dict[str, Any]:
        with torch.no_grad():
            # Get the raw float value out of the tensor
            severity_score = self.model(preprocessed_input).item()

            # Port your clinical verdict logic into the JSON response
            if severity_score < 0.5: status = "Clear"
            elif severity_score < 1.5: status = "Mild"
            elif severity_score < 2.5: status = "Moderate"
            else: status = "Severe"

            return {
                "severity_score": round(severity_score, 4),
                "clinical_verdict": status
            }

# --- The Updated Memory-Safe Pipeline ---

class MultiModelPipeline:
    def __init__(self, models: List[BaseVisionModel]):
        self.models = models

    def process_pil_image(self, base_image: Image.Image) -> Dict[str, Any]:
        """Runs inference directly on a PIL Image object in memory."""
        results = {}
        for model in self.models:
            results[model.model_name] = model.run(base_image)
        return results

# --- FastAPI Application Setup ---

app = FastAPI(
    title="Computer Vision Multi-Model API",
    description="API for running images through multiple CNN classifiers.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (good for local dev)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, OPTIONS, etc)
    allow_headers=["*"],  # Allows all headers
)

# Global variable to hold our pipeline so it persists across API calls
pipeline = None

# Global variable to hold recommendation products
df = None

# --- Quick JSON Database for Users ---
DB_FILE = "users_db.json"
users_db = {}

# Load existing users on startup
if os.path.exists(DB_FILE):
    with open(DB_FILE, "r") as f:
        users_db = json.load(f)

def save_users():
    with open(DB_FILE, "w") as f:
        json.dump(users_db, f)

# --- Image Upload Setup ---
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# --- Authentication Models & Endpoints ---
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    skin_concern: str
    heritage: str

class LoginRequest(BaseModel):
    email: str
    password: str

# --- User Profile & History Endpoints ---

class ScanRecord(BaseModel):
    email: str
    date: str
    score: int
    acneLevel: str
    hydration: str
    trend: str
    image_url: str

class QuestionnaireData(BaseModel):
    email: str
    answers: dict

@app.on_event("startup")
async def load_ml_models():
    """
    This function runs once when the server starts. 
    It prevents the API from loading the heavy .pth files on every single request.
    """
    global pipeline
    logging.info("Initializing Machine Learning Models...")
    
    try:
        # Initialize models here
        skin_model = SkinTypeResNetModel(
            model_name="Skin_Type_ResNet50", 
            model_path="best_skin_model_weights.pth"
        )

        # fp17k_high = Fitzpatrick17kModel(
        #     model_name="Fitzpatrick17k_High",
        #     model_path="model_path_10_high_random_holdout.pth",
        #     label_map_path="label_map_high.json"
        # )

        # fp17k_mid = Fitzpatrick17kModel(
        #     model_name="Fitzpatrick17k_Mid",
        #     model_path="model_path_10_mid_random_holdout.pth",
        #     label_map_path="label_map_mid.json"
        # )

        # fp17k_low = Fitzpatrick17kModel(
        #     model_name="Fitzpatrick17k_low",
        #     model_path="model_path_10_low_random_holdout.pth",
        #     label_map_path="label_map_low.json"
        # )

        condition_model = ConditionClassifier(
            model_name="Condition_Classifier_EfficientNet_b3",
            model_path="best_skin_model.pth"
        )

        severity_model = SeverityRegressor(
            model_name="Severity_Regressor_EfficientNet_b3",
            model_path="best_severity_model.pth"
        )
        
        # Add more models to this list as you build them
        pipeline = MultiModelPipeline(models=[skin_model, condition_model, severity_model])
        logging.info("Models loaded successfully into memory.")
        
    except Exception as e:
        logging.error(f"Failed to load models: {e}")

    global df
    logging.info("Initializing recommendation products...")

    try:
        df = pd.read_csv("./skincare_products/Skinpro.csv")
    except Exception as e:
        logging.error(f"Failed to read recommendation product dataset: {e}")

@app.post("/predict/")
async def predict_image(file: UploadFile = File(...)):
    """
    Endpoint that accepts an image file and returns model inferences.
    """
    # Validate the file type
    if not file.content_type or not file.content_type.startswith("image/"):
        # added a fallback check because sometimes valid images are sent as octet-stream
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    try:
        contents = await file.read()

        # --- NEW: Save the file permanently to the disk ---
        file_ext = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(file_path, "wb") as f:
            f.write(contents)

        permanent_image_url = f"http://127.0.0.1:8000/uploads/{unique_filename}"
        # --------------------------------------------------

        image = Image.open(io.BytesIO(contents)).convert("RGB")
        raw_results = pipeline.process_pil_image(image)
        
        # --- ENSEMBLE AGGREGATION LOGIC ---
        
        # Extract individual model data
        resnet_data = raw_results.get("Skin_Type_ResNet50", {}).get("data", {})
        effnet_data = raw_results.get("Condition_Classifier_EfficientNet_b3", {}).get("data", {})
        severity_data = raw_results.get("Severity_Regressor_EfficientNet_b3", {}).get("data", {})

        # --- UPDATED: Skin Type Conflict Resolution ---
        base_skin_type = resnet_data.get("predicted_class", "unknown").lower()
        resnet_confidence = resnet_data.get("confidence", 0.0)
        effnet_top_class = effnet_data.get("predicted_class", "unknown").lower()
        
        # Threshold for trusting the ResNet binary classifier. 
        # Since 0.50 is a random guess, 0.70 ensures it's fairly confident.
        RESNET_CONFIDENCE_THRESHOLD = 0.70 
        
        final_skin_type = base_skin_type

        # Only allow EfficientNet to influence the skin type if ResNet is uncertain
        if resnet_confidence < RESNET_CONFIDENCE_THRESHOLD:
            # If effnet predicts a valid skin type that CONFLICTS with ResNet, call it combination
            if effnet_top_class in ["dry", "normal", "oily"] and effnet_top_class != base_skin_type:
                final_skin_type = "combination"
        # ----------------------------------------------

        # Extract Skin Conditions via Probability Threshold
        detected_conditions = []
        effnet_probs = effnet_data.get("all_probabilities", {})
        
        # Set threshold (if the model is >threshold sure, flag it)
        CONDITION_THRESHOLD = 0.30 
        
        if effnet_probs.get("Acne", 0) > CONDITION_THRESHOLD:
            detected_conditions.append("acne")
        if effnet_probs.get("Pigmentation", 0) > CONDITION_THRESHOLD:
            detected_conditions.append("pigmentation")

        # 3. Construct Unified Response
        aggregated_response = {
            "final_skin_type": final_skin_type,
            "detected_conditions": detected_conditions,
            "severity_score": severity_data.get("severity_score"),
            "clinical_verdict": severity_data.get("clinical_verdict"),
            # Include raw data so frontend can still access individual confidences if needed
            "raw_model_data": raw_results,
            "image_url": permanent_image_url
        }

        return {
            "filename": file.filename,
            "analysis": aggregated_response
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    
class RecommendationRequest(BaseModel):
    skin_type: str        # "oily" or "dry"
    concern: str          # "acne", "hydration" etc
    confidence: float     # 0.5 - 1
    
@app.post("/recommend/")
async def recommend_products(req: RecommendationRequest):
    """
    Endpoint that accepts skin properties and returns a table of skincare products accordingly.
    """
    global df
    if df is None:
        raise HTTPException(status_code=500, detail="Product dataset is not loaded.")

    try:
        # Standardize inputs for case-insensitive matching
        user_skin_type = req.skin_type.lower()
        user_concern = req.concern.lower()
        
        # Identify the strict opposite to filter out during low confidence
        opposite_type = "dry" if user_skin_type == "oily" else "oily"

        # Start with a fresh copy of the global dataframe
        filtered_df = df.copy()

        # --- Filter by Concern ---
        # Using str.contains allows partial matches (e.g., user sends "acne", matches "anti-acne")
        # fillna('') ensures NaN rows don't break the string operations
        filtered_df['Concern'] = filtered_df['Concern'].fillna('')
        filtered_df = filtered_df[filtered_df['Concern'].str.lower().str.contains(user_concern)]

        # --- Filter by Skin Type based on Confidence ---
        filtered_df['Skin type'] = filtered_df['Skin type'].fillna('')
        
        if req.confidence < 0.80:
            # LOW CONFIDENCE (0.5 - 0.79):
            # Model isn't entirely sure. Play it safe by sending everything 
            # EXCEPT products strictly meant for the opposite skin type.
            # This leaves in matching types, 'balanced', 'combination', 'all', etc.
            filtered_df = filtered_df[~filtered_df['Skin type'].str.lower().str.contains(opposite_type)]
            
        else:
            # HIGH CONFIDENCE (0.80 - 1.0):
            # Model is sure. We can safely filter for products that are explicitly 
            # meant for this skin type.
            allowed_types = [user_skin_type]
            pattern = '|'.join(allowed_types)
            filtered_df = filtered_df[filtered_df['Skin type'].str.lower().str.contains(pattern)]

        # --- Format Response ---

        # ADD THIS LINE: Replace all remaining NaNs in the entire dataframe with empty strings
        # so the JSON encoder doesn't crash.
        filtered_df = filtered_df.fillna("")
        
        # Convert the resulting DataFrame into a list of dictionaries (JSON friendly)
        # orient="records" creates [{col1: val1, col2: val2}, ...]
        results = filtered_df.to_dict(orient="records")

        return {
            "status": "success",
            "matches_found": len(results),
            "confidence_mode": "broad_net" if req.confidence < 0.60 else "strict_match",
            "recommendations": results
        }

    except KeyError as e:
        # Catches if the CSV doesn't have the exact column names 'concern' or 'skin type'
        raise HTTPException(status_code=500, detail=f"Dataset column error: Missing {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation engine error: {str(e)}")
    
@app.post("/signup/")
async def signup(req: SignupRequest):
    if req.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered.")
    
    # In a real app, you'd hash the password here!
    users_db[req.email] = req.model_dump()
    save_users()
    
    return {"status": "success", "user": {"name": req.name, "email": req.email}}

@app.post("/login/")
async def login(req: LoginRequest):
    user = users_db.get(req.email)
    if not user or user["password"] != req.password:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
        
    return {"status": "success", "user": {"name": user["name"], "email": user["email"]}}

@app.post("/history/")
async def add_history(record: ScanRecord):
    if record.email not in users_db:
        raise HTTPException(status_code=404, detail="User not found.")
    
    if "history" not in users_db[record.email]:
        users_db[record.email]["history"] = []
        
    users_db[record.email]["history"].append(record.model_dump())
    save_users()
    return {"status": "success"}

@app.post("/questionnaire/")
async def save_questionnaire(data: QuestionnaireData):
    if data.email not in users_db:
        raise HTTPException(status_code=404, detail="User not found.")
        
    users_db[data.email]["questionnaire"] = data.answers
    save_users()
    return {"status": "success"}

@app.get("/profile/{email}")
async def get_profile(email: str):
    if email not in users_db:
        raise HTTPException(status_code=404, detail="User not found.")
        
    user_data = users_db[email]
    
    # Strip password before sending to frontend
    safe_data = {k: v for k, v in user_data.items() if k != "password"}
    
    # Ensure keys exist for new users
    if "history" not in safe_data:
        safe_data["history"] = []
    if "questionnaire" not in safe_data:
        safe_data["questionnaire"] = {}
        
    return {"status": "success", "data": safe_data}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    