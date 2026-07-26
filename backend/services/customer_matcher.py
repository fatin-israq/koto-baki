from rapidfuzz import fuzz

def match_customer(spoken_name: str, db_customers: list) -> dict:
    if not spoken_name or "নগদ" in spoken_name or "অজ্ঞাত" in spoken_name:
        return {"name": "নগদ খদ্দের", "id": None, "is_new": False}
    
    clean_spoken = spoken_name.strip().lower()
    
    for cust in db_customers:
        main_name = cust.name.lower()
        disp_name = cust.display_name.lower()
        
        # Simple containment check first
        if (clean_spoken in main_name or main_name in clean_spoken or
            clean_spoken in disp_name or disp_name in clean_spoken):
            return {"name": cust.display_name, "id": cust.id, "is_new": False}
        
        # Fuzzy matching
        score_main = fuzz.partial_ratio(clean_spoken, main_name)
        score_disp = fuzz.partial_ratio(clean_spoken, disp_name)
        
        if max(score_main, score_disp) > 85: # Threshold
            return {"name": cust.display_name, "id": cust.id, "is_new": False}

    return {"name": spoken_name, "id": None, "is_new": True}
