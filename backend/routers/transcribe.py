from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from db import get_db
import models
from services.gemma_client import parse_spoken_transaction

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(None),
    text: str = Form(None),
    db: Session = Depends(get_db)
):
    """
    Accepts either an audio file or a raw text string (for testing/simulated fallback).
    """
    customers = db.query(models.Customer).all()
    
    # In a real app we'd pass `file` to Gemma Native Audio
    # Since we are using the simulator which accepts text, we'll use `text` if provided
    # or fallback to a hardcoded string if a file is sent.
    
    spoken_input = text
    if file and not text:
        # Simulate processing an audio file
        # We can extract a demo string based on some condition, or just fallback
        spoken_input = "করিম ভাইকে ২০০ টাকার বাকিতে একটা শার্ট দিলাম"
        
    result = await parse_spoken_transaction(spoken_input, customers)
    return result
