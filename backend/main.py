from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pymongo import MongoClient
import os

app = FastAPI()

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["video_db"]
collection = db["videos"]

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    # Save the uploaded file
    file_location = f"videos/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Insert file metadata into MongoDB
    collection.insert_one({"filename": file.filename, "path": file_location})

    # Here, you would call your trained model to process the video
    # For example: result = process_video(file_location)

    # Simulate a result from the model
    result = "Detected sign language text"

    return JSONResponse(content={"message": "Upload successful", "result": result})
