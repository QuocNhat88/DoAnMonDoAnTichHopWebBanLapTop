import os
import pymongo
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import chuẩn
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

# 1. Cấu hình Load .env
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, '..', '.env')
load_dotenv(dotenv_path=env_path)

app = FastAPI()

# 2. Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    print("❌ LỖI: Không tìm thấy GOOGLE_API_KEY.")

# 3. Biến toàn cục
PRODUCT_CONTEXT = ""
PRODUCT_LIST_RAW = [] 

def load_data_from_mongo():
    """Đọc dữ liệu từ MongoDB nạp vào RAM"""
    global PRODUCT_CONTEXT, PRODUCT_LIST_RAW
    print("⏳ Đang đọc dữ liệu từ MongoDB...")
    
    client = pymongo.MongoClient(MONGO_URI)
    try:
        db = client.get_database()
    except:
        db = client["test"]

    pipeline = [
        { "$lookup": { "from": "brands", "localField": "brand", "foreignField": "_id", "as": "brand_info" } },
        { "$lookup": { "from": "categories", "localField": "category", "foreignField": "_id", "as": "category_info" } },
        { "$unwind": { "path": "$brand_info", "preserveNullAndEmptyArrays": True } },
        { "$unwind": { "path": "$category_info", "preserveNullAndEmptyArrays": True } }
    ]
    
    try:
        products = list(db.products.aggregate(pipeline))
        PRODUCT_LIST_RAW = products
        
        context_text = ""
        for prod in products:
            brand = prod.get('brand_info', {}).get('name', 'Không rõ')
            cat = prod.get('category_info', {}).get('name', 'Không rõ')
            specs = prod.get("specifications", {})
            
            context_text += f"""
            - Tên: {prod['name']}
            - Hãng: {brand} | Loại: {cat}
            - Giá: {prod['price']} VND
            - Cấu hình: CPU {specs.get('cpu', '')}, RAM {specs.get('ram', '')}, {specs.get('storage', '')}, {specs.get('gpu', '')}
            - Mô tả: {prod.get('description', '')[:150]}... 
            ------------------------------------------
            """
        
        PRODUCT_CONTEXT = context_text
        print(f"✅ Đã nạp {len(products)} sản phẩm vào bộ nhớ.")
    except Exception as e:
        print(f"❌ Lỗi kết nối MongoDB: {e}")

load_data_from_mongo()

# 4. Khởi tạo Gemini (ĐÃ SỬA TÊN MODEL TẠI ĐÂY)
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",  # <--- Dùng model mới nhất trong danh sách của bạn
    temperature=0.3,
    google_api_key=GOOGLE_API_KEY
)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        if not PRODUCT_CONTEXT:
            load_data_from_mongo()

        user_query = request.message
        
        prompt = f"""Bạn là nhân viên tư vấn bán laptop chuyên nghiệp.
Dưới đây là danh sách sản phẩm cửa hàng:
{PRODUCT_CONTEXT}

YÊU CẦU:
1. Chỉ tư vấn dựa trên danh sách trên.
2. Trả lời ngắn gọn, thân thiện, có emoji.
3. Luôn ghi giá tiền kèm "VND".

Khách hỏi: "{user_query}"
Trả lời:"""

        response = llm.invoke(prompt)
        answer = response.content
        
        recommended_products = []
        for prod in PRODUCT_LIST_RAW:
            if prod['name'] in answer:
                recommended_products.append({
                    "id": str(prod["_id"]),
                    "name": prod["name"],
                    "price": prod["price"],
                    "image": prod.get("thumbnail", "")
                })
                if len(recommended_products) >= 3:
                    break

        return {
            "reply": answer,
            "products": recommended_products
        }

    except Exception as e:
        print(f"Lỗi Chat: {e}")
        return {
            "reply": "Xin lỗi, server đang bận. Bạn thử lại sau nhé!", 
            "products": []
        }

@app.get("/")
def home():
    return {"status": "AI Server is running with Gemini 2.5 Flash"}