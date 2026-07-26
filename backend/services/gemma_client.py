import json
import httpx
from services.customer_matcher import match_customer

async def parse_spoken_transaction(spoken_input: str, db_customers: list) -> dict:
    """
    Calls local Ollama API to parse the Bengali transaction text into JSON.
    """
    if not spoken_input:
        return {}

    prompt = f"""
    You are an AI assistant for a Bangladeshi shopkeeper's ledger app. 
    Analyze the following spoken Bengali text and extract the transaction details.
    
    Return ONLY a valid JSON object matching this schema, with no markdown formatting or extra text:
    {{
        "customer": "Name of the customer (string). If unknown, use 'নগদ খদ্দের'",
        "item": "What was bought or 'বাকি পরিশোধ' if it's a payment (string)",
        "amount": "The amount as an integer number (int)",
        "type": "Must be exactly one of: 'sale' (for cash sales), 'baki' (for credit/due), or 'poroshod' (for payment of due)"
    }}
    
    CRITICAL CLASSIFICATION RULES for "type":
    - 'sale': Use this if the customer bought items and paid cash, OR if they just bought items but words indicating credit/due are NOT explicitly mentioned.
    - 'baki': ONLY use this if words implying credit/due are explicitly spoken (e.g., "বাকি", "পরে দিবে", "পাবে"). DO NOT assume 'baki' just because a customer's name is mentioned!
    - 'poroshod': Use this if the customer is paying off previous dues (e.g., "জমা দিল", "পরিশোধ করল", "দিয়ে গেল").
    
    If the amount is missing, set it to 0.
    
    Spoken text: "{spoken_input}"
    """

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://127.0.0.1:11434/api/generate",
                json={
                    "model": "gemma4",
                    "prompt": prompt,
                    "stream": False,
                    "format": "json" # Ollama supports forcing JSON format
                },
                timeout=120.0  # Increased timeout to 120 seconds for slow model loading
            )
            response.raise_for_status()
            result = response.json()
            
            # The response from Ollama should be in result["response"]
            llm_text = result.get("response", "{}")
            print(f"Ollama Raw Response: {llm_text}")
            
            # Sometimes LLMs wrap JSON in markdown even with format: json
            if llm_text.startswith("```json"):
                llm_text = llm_text[7:]
            if llm_text.endswith("```"):
                llm_text = llm_text[:-3]
                
            parsed = json.loads(llm_text.strip())
            
            customer = parsed.get("customer", "নগদ খদ্দের")
            item = parsed.get("item", "পণ্য ক্রয়")
            amount = int(parsed.get("amount", 0))
            tx_type = parsed.get("type", "sale")
            
            # Fuzzy match the customer against the database
            cust_match = match_customer(customer, db_customers)
            
            return {
                "customer": cust_match["name"],
                "customer_id": cust_match["id"],
                "item": item,
                "amount": amount,
                "type": tx_type,
                "confidence": 0.95, # High confidence if JSON parsed
                "raw_transcript": spoken_input
            }
            
    except Exception as e:
        print(f"Ollama Error: {e}")
        # Fallback to a basic structure if it fails
        return {
            "customer": "অজ্ঞাত",
            "customer_id": None,
            "item": "Error parsing",
            "amount": 0,
            "type": "sale",
            "confidence": 0.0,
            "raw_transcript": spoken_input
        }
