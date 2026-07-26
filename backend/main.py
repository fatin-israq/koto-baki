from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import engine, Base, SessionLocal
from models import Customer, Transaction
from routers import ledger, transcribe

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mudi Dokan Khata API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ledger.router, prefix="/api")
app.include_router(transcribe.router, prefix="/api")

# Database seeding logic
def seed_db():
    db = SessionLocal()
    if db.query(Customer).count() == 0:
        demo_customers = [
            {"id": 1, "name": "করিম ভাই", "display_name": "করিম ভাই"},
            {"id": 2, "name": "রহিমা আপা", "display_name": "রহিমা আপা"},
            {"id": 3, "name": "জামাল ভাই", "display_name": "জামাল ভাই"},
            {"id": 4, "name": "নতুন কাস্টমার", "display_name": "নতুন কাস্টমার"},
            {"id": 5, "name": "আফতাব", "display_name": "আফতাব"},
            {"id": 6, "name": "নগদ খদ্দের", "display_name": "নগদ খদ্দের"}
        ]
        for c in demo_customers:
            db.add(Customer(**c))
        
        demo_transcripts = [
            {"id": 1, "raw_transcript": "“করিম ভাইকে ২০০ টাকার বাকিতে একটা শার্ট দিলাম”", "customer_name": "করিম ভাই", "customer_id": 1, "item": "শার্ট", "amount": 200.0, "type": "baki", "confidence": 0.94},
            {"id": 2, "raw_transcript": "“রহিমা আপা ৫০ টাকার চা-বিস্কুট কিনলেন, ক্যাশ”", "customer_name": "রহিমা আপা", "customer_id": 2, "item": "চা ও বিস্কুট", "amount": 50.0, "type": "sale", "confidence": 0.97},
            {"id": 3, "raw_transcript": "“জামাল ভাই আগের বাকি থেকে ৩০০ টাকা শোধ করলেন”", "customer_name": "জামাল ভাই", "customer_id": 3, "item": "বাকি পরিশোধ", "amount": 300.0, "type": "poroshod", "confidence": 0.91},
            {"id": 4, "raw_transcript": "“নতুন কাস্টমার, দুই কেজি চাল, ১২০ টাকা ক্যাশ”", "customer_name": "নতুন কাস্টমার", "customer_id": 4, "item": "চাল (২ কেজি)", "amount": 120.0, "type": "sale", "confidence": 0.89},
            {"id": 5, "raw_transcript": "“...পনেরো... না পঞ্চাশ টাকা বাকি রাখলো... আফতাব”", "customer_name": "আফতাব", "customer_id": 5, "item": "(অস্পষ্ট)", "amount": 50.0, "type": "baki", "confidence": 0.52}
        ]
        for t in demo_transcripts:
            db.add(Transaction(**t))
        db.commit()
    db.close()

seed_db()
