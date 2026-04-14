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
from torchvision.models import resnet50, vgg16
import json
import pandas as pd
from pydantic import BaseModel
from typing import Optional

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

        fp17k_high = Fitzpatrick17kModel(
            model_name="Fitzpatrick17k_High",
            model_path="model_path_10_high_random_holdout.pth",
            label_map_path="label_map_high.json"
        )

        fp17k_mid = Fitzpatrick17kModel(
            model_name="Fitzpatrick17k_Mid",
            model_path="model_path_10_mid_random_holdout.pth",
            label_map_path="label_map_mid.json"
        )

        fp17k_low = Fitzpatrick17kModel(
            model_name="Fitzpatrick17k_low",
            model_path="model_path_10_low_random_holdout.pth",
            label_map_path="label_map_low.json"
        )
        
        # Add more models to this list as you build them
        pipeline = MultiModelPipeline(models=[skin_model, fp17k_high, fp17k_mid, fp17k_low])
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
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        inference_results = pipeline.process_pil_image(image)
        
        return {
            "filename": file.filename,
            "results": inference_results
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

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
