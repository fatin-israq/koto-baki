from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db
import models, schemas
from services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_current_user
)

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=schemas.TokenResponse)
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(models.User).filter(models.User.email == user_data.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="এই ইমেইল দিয়ে ইতোমধ্যে একটি খাতা নিবন্ধিত আছে।"
        )
    
    hashed_pwd = hash_password(user_data.password)
    new_user = models.User(
        email=user_data.email.lower(),
        shop_name=user_data.shop_name,
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token(data={"sub": new_user.id, "email": new_user.email})
    return schemas.TokenResponse(
        access_token=token,
        token_type="bearer",
        shop_name=new_user.shop_name,
        user_id=new_user.id,
        email=new_user.email
    )

@router.post("/login", response_model=schemas.TokenResponse)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email.lower()).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।"
        )
    
    token = create_access_token(data={"sub": user.id, "email": user.email})
    return schemas.TokenResponse(
        access_token=token,
        token_type="bearer",
        shop_name=user.shop_name,
        user_id=user.id,
        email=user.email
    )

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(require_current_user)):
    return current_user
