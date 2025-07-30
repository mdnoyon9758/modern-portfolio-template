# backend/app/api/v1/endpoints/media.py

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
from pathlib import Path
from typing import List
import shutil

router = APIRouter()

# Define the upload directory relative to the backend folder
UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent.parent / "uploads"

@router.post("/upload", summary="Upload a new image")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload a new image to the server.

    - **file**: The image file to upload.
    """
    # Ensure the upload directory exists
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only image files are allowed."
        )

    file_path = UPLOAD_DIR / file.filename
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"filename": file.filename, "url": f"/uploads/{file.filename}"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}"
        )

@router.get("/", summary="Get a list of all uploaded images")
async def get_all_images() -> List[str]:
    """
    Retrieve a list of URLs for all images in the upload directory.
    """
    if not UPLOAD_DIR.is_dir():
        return []

    image_urls = [
        f"/uploads/{file.name}" 
        for file in UPLOAD_DIR.iterdir() 
        if file.is_file() and file.suffix.lower() in [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
    ]
    return image_urls

