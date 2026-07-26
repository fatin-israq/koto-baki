from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db import get_db
import models, schemas

router = APIRouter()

@router.get("/ledger", response_model=List[schemas.TransactionResponse])
def get_ledger(db: Session = Depends(get_db)):
    transactions = db.query(models.Transaction).order_by(models.Transaction.id).all()
    return transactions

@router.post("/ledger", response_model=schemas.TransactionResponse)
def create_transaction(tx: schemas.TransactionCreate, db: Session = Depends(get_db)):
    db_tx = models.Transaction(
        customer_id=tx.customer_id,
        customer_name=tx.customer,
        item=tx.item,
        amount=tx.amount,
        type=tx.type,
        confidence=tx.confidence,
        raw_transcript=tx.raw_transcript
    )
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    return db_tx

@router.get("/customers", response_model=List[schemas.CustomerResponse])
def get_customers(db: Session = Depends(get_db)):
    customers = db.query(models.Customer).all()
    return customers
