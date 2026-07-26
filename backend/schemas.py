from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TransactionBase(BaseModel):
    customer: str
    item: str
    amount: float
    type: str

class TransactionCreate(TransactionBase):
    customer_id: Optional[int] = None
    confidence: Optional[float] = None
    raw_transcript: Optional[str] = None

class TransactionResponse(TransactionBase):
    id: int
    customer_name: Optional[str] = None
    customer_id: Optional[int] = None
    confidence: Optional[float] = None
    raw_transcript: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class CustomerBase(BaseModel):
    name: str
    display_name: str

class CustomerResponse(CustomerBase):
    id: int

    class Config:
        from_attributes = True
