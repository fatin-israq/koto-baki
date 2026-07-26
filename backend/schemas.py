from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    shop_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    shop_name: str
    user_id: int
    email: str

class UserResponse(BaseModel):
    id: int
    email: str
    shop_name: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

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
