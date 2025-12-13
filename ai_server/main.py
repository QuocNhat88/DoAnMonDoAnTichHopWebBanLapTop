import os
import pymongo
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

# 1. Load .env
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, '..', '.env')
load_dotenv(dotenv_path=env_path)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# --- THÔNG TIN CỬA HÀNG ---
SHOP_INFO = """
🏨 THÔNG TIN CỬA HÀNG "LAPTOP STORE":
- Địa chỉ: 123 haha, hihi, Đà Nẵng.
- Hotline: 0905.999.999.
- Giờ mở cửa: 8:00 - 21:00.

🛡️ CHÍNH SÁCH:
- Bảo hành: 12 tháng chính hãng.
- Đổi trả: 1 đổi 1 trong 7 ngày đầu.
- Vận chuyển: Miễn phí nội thành Đà Nẵng.
"""

# Biến toàn cục
PRODUCT_CONTEXT = ""     
PRODUCT_LIST_RAW = []    
MARKET_INSIGHTS = ""     

def get_market_insights(db):
    """Phân tích hàng bán chạy (Best Sellers)"""
    print("📊 Đang phân tích xu hướng bán hàng...")
    try:
        pipeline = [
            { "$unwind": "$orderItems" },
            { 
                "$group": { 
                    "_id": "$orderItems.product",
                    "totalSold": { "$sum": "$orderItems.quantity" }
                } 
            },
            { "$sort": { "totalSold": -1 } },
            { "$limit": 5 } 
        ]
        
        top_products = list(db.orders.aggregate(pipeline))
        
        if not top_products:
            return "" # Trả về rỗng nếu không có dữ liệu

        insight_text = "\n🔥 TOP SẢN PHẨM BÁN CHẠY (Ưu tiên tư vấn):\n"
        prod_map = {str(p["_id"]): p["name"] for p in list(db.products.find())}
        
        for index, item in enumerate(top_products):
            pid = str(item["_id"])
            pname = prod_map.get(pid, "Sản phẩm")
            # Lọc bỏ sản phẩm rác nếu cần (ví dụ tên quá ngắn)
            if len(pname) > 3: 
                insight_text += f"- {pname}\n"
            
        return insight_text
    
    except Exception as e:
        print(f"⚠️ Lỗi phân tích đơn hàng: {e}")
        return ""

def load_data_from_mongo():
    global PRODUCT_CONTEXT, PRODUCT_LIST_RAW, MARKET_INSIGHTS
    print("⏳ Đang đọc dữ liệu từ MongoDB...")
    
    client = pymongo.MongoClient(MONGO_URI)
    try:
        db = client.get_database()
    except:
        db = client["test"]

    MARKET_INSIGHTS = get_market_insights(db)

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
            brand = prod.get('brand_info', {}).get('name', 'Khác')
            cat = prod.get('category_info', {}).get('name', 'Khác')
            specs = prod.get("specifications", {})
            
            # Chỉ nạp sản phẩm có giá > 0 vào ngữ cảnh để tránh rác
            if prod['price'] > 0:
                context_text += f"""
                - Tên: {prod['name']}
                - ID: {prod['_id']}
                - Hãng: {brand} | Loại: {cat}
                - Giá: {prod['price']} VND
                - CPU: {specs.get('cpu', '')}, RAM: {specs.get('ram', '')}, VGA: {specs.get('gpu', '')}
                ------------------------------------------
                """
        PRODUCT_CONTEXT = context_text
        print(f"✅ Đã nạp {len(products)} sản phẩm.")
        
    except Exception as e:
        print(f"❌ Lỗi kết nối MongoDB: {e}")

load_data_from_mongo()

llm = ChatGoogleGenerativeAI(
    model="gemini-flash-lite-latest",
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
        query_lower = user_query.lower()

        # --- EASTER EGG ---
        if "đẹp trai nhất" in query_lower:
            return { "reply": "Người đẹp trai nhất thì chắc chắn phải là thầy Ngô Văn Hiếu rồi! 😎💯", "products": [] }
        if "quốc nhật" in query_lower:
            return { "reply": "Quốc Nhật chỉ top 2 thôi! 🥈😂", "products": [] }
        # ------------------

        # Prompt được tinh chỉnh để trả lời chính xác hơn
        prompt = f"""Bạn là Trợ lý AI của LAPTOP STORE.

=== THÔNG TIN SHOP ===
{SHOP_INFO}

=== XU HƯỚNG BÁN CHẠY ===
{MARKET_INSIGHTS}

=== DANH SÁCH SẢN PHẨM ===
{PRODUCT_CONTEXT}

=== YÊU CẦU QUAN TRỌNG ===
1. Khách hỏi gì đáp nấy. KHÔNG tự ý liệt kê sản phẩm bán chạy nếu khách không hỏi về "bán chạy" hay "hot".
2. Nếu khách hỏi chung chung (ví dụ: "thương hiệu nào tốt"), hãy phân tích thương hiệu, ĐỪNG liệt kê tên sản phẩm cụ thể trừ khi cần thiết.
3. Khi bạn muốn gợi ý sản phẩm cho khách xem, hãy viết CHÍNH XÁC tên sản phẩm (y hệt trong danh sách) vào câu trả lời.
4. Giá tiền phải có đuôi "VND".

Khách hỏi: "{user_query}"
Trả lời:"""

        response = llm.invoke(prompt)
        answer = response.content
        
        # --- LOGIC TÌM SẢN PHẨM LIÊN QUAN (CẢI TIẾN) ---
        recommended_products = []
        answer_lower = answer.lower() # Chuyển câu trả lời về chữ thường
        
        for prod in PRODUCT_LIST_RAW:
            # Chuyển tên sản phẩm về chữ thường để so sánh
            prod_name = prod['name'].lower()
            
            # Logic: Chỉ hiện thẻ nếu Tên sản phẩm xuất hiện trong câu trả lời
            # VÀ sản phẩm đó không phải là sản phẩm rác (giá > 10000)
            if prod_name in answer_lower and prod['price'] > 10000:
                recommended_products.append({
                    "id": str(prod["_id"]),
                    "name": prod["name"],
                    "price": prod["price"],
                    "image": prod.get("thumbnail", "")
                })
                
                # Giới hạn hiển thị 4 thẻ để không bị rối
                if len(recommended_products) >= 4:
                    break

        return { "reply": answer, "products": recommended_products }

    except Exception as e:
        print(f"Lỗi Chat: {e}")
        return { "reply": "Chủ shop nghèo nên xài API free mà giờ quá tải bạn chờ xí:))", "products": [] }

@app.get("/")
def home():
    return {"status": "AI Server V5 (Smart Filtering)"}