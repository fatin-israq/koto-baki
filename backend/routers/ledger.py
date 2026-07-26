from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from db import get_db
import models, schemas
from services.auth_service import get_current_user

router = APIRouter()

@router.get("/ledger", response_model=List[schemas.TransactionResponse])
def get_ledger(
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user)
):
    query = db.query(models.Transaction)
    if current_user:
        # Filter transactions for current user, or legacy global ones
        query = query.filter((models.Transaction.user_id == current_user.id) | (models.Transaction.user_id == None))
    transactions = query.order_by(models.Transaction.id).all()
    return transactions

@router.post("/ledger", response_model=schemas.TransactionResponse)
def create_transaction(
    tx: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user)
):
    db_tx = models.Transaction(
        user_id=current_user.id if current_user else None,
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
def get_customers(
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user)
):
    query = db.query(models.Customer)
    if current_user:
        query = query.filter((models.Customer.user_id == current_user.id) | (models.Customer.user_id == None))
    customers = query.all()
    return customers
