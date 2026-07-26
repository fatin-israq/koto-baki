from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from db import Base

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    display_name = Column(String)

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, index=True, nullable=True)
    customer_name = Column(String)
    item = Column(String)
    amount = Column(Float)
    type = Column(String)
    confidence = Column(Float, nullable=True)
    raw_transcript = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
