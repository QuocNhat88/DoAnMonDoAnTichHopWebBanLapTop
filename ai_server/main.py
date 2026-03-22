import os
import pymongo
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# --- IMPORT THÊM THƯ VIỆN RAG ---
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

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

# Biến toàn cục mới
VECTOR_DB = None # Thay thế cho PRODUCT_CONTEXT cũ
PRODUCT_LIST_RAW = []    
MARKET_INSIGHTS = ""     

# Khởi tạo mô hình Embedding của Google
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001", 
    google_api_key=GOOGLE_API_KEY
)

def get_market_insights(db):
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
            return "" 

        insight_text = "\n🔥 TOP SẢN PHẨM BÁN CHẠY (Ưu tiên tư vấn):\n"
        prod_map = {str(p["_id"]): p["name"] for p in list(db.products.find())}
        
        for index, item in enumerate(top_products):
            pid = str(item["_id"])
            pname = prod_map.get(pid, "Sản phẩm")
            if len(pname) > 3: 
                insight_text += f"- {pname}\n"
        return insight_text
    except Exception as e:
        print(f"⚠️ Lỗi phân tích đơn hàng: {e}")
        return ""

def load_data_from_mongo():
    global VECTOR_DB, PRODUCT_LIST_RAW, MARKET_INSIGHTS
    print("⏳ Đang đọc dữ liệu từ MongoDB và tạo Vector Database...")
    
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
        
        docs = []
        for prod in products:
            if prod['price'] > 0:
                brand = prod.get('brand_info', {}).get('name', 'Khác')
                cat = prod.get('category_info', {}).get('name', 'Khác')
                specs = prod.get("specifications", {})
                
                # Gom dữ liệu thành 1 đoạn văn bản để tạo Vector
                text_content = f"Tên laptop: {prod['name']}. Hãng sản xuất: {brand}. Loại: {cat}. Giá bán: {prod['price']} VND. Cấu hình CPU: {specs.get('cpu', '')}, RAM: {specs.get('ram', '')}, Card đồ họa VGA: {specs.get('gpu', '')}."
                
                # Lưu thêm siêu dữ liệu (metadata) để lấy ra làm thẻ UI sau này
                metadata = {
                    "id": str(prod["_id"]),
                    "name": prod["name"],
                    "price": prod["price"],
                    "image": prod.get("thumbnail", "")
                }
                
                docs.append(Document(page_content=text_content, metadata=metadata))
        
        # Tạo cơ sở dữ liệu FAISS từ danh sách tài liệu
        if docs:
            VECTOR_DB = FAISS.from_documents(docs, embeddings)
            print(f"✅ Đã tạo Vector DB thành công cho {len(docs)} sản phẩm.")
        else:
            print("⚠️ Không có sản phẩm hợp lệ nào để tạo Vector.")
            
    except Exception as e:
        print(f"❌ Lỗi kết nối MongoDB hoặc tạo FAISS: {e}")

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
        if VECTOR_DB is None:
            load_data_from_mongo()

        user_query = request.message
        query_lower = user_query.lower()

        # --- EASTER EGG ---
        if "đẹp trai nhất" in query_lower:
            return { "reply": "Người đẹp trai nhất thì chắc chắn phải là thầy Ngô Văn Hiếu rồi! 😎💯", "products": [] }
        if "quốc nhật" in query_lower:
            return { "reply": "Quốc Nhật chỉ top 2 thôi! 🥈😂", "products": [] }
        # ------------------

        # --- TIẾN HÀNH SIMILARITY SEARCH (RAG) ---
        # Tìm 4 sản phẩm giống với câu hỏi của người dùng nhất
        search_results = VECTOR_DB.similarity_search(user_query, k=4)
        
        # Rút trích thông tin sản phẩm tìm được để nhét vào ngữ cảnh cho AI
        retrieved_context = ""
        recommended_products = [] # Lưu metadata để trả về Frontend hiện UI luôn
        
        for doc in search_results:
            retrieved_context += f"- {doc.page_content}\n"
            recommended_products.append(doc.metadata)

        # Prompt giờ đây chỉ chứa các sản phẩm liên quan nhất, không phải toàn bộ DB
        prompt = f"""Bạn là Trợ lý AI của LAPTOP STORE.

=== THÔNG TIN SHOP ===
{SHOP_INFO}

=== XU HƯỚNG BÁN CHẠY ===
{MARKET_INSIGHTS}

=== SẢN PHẨM PHÙ HỢP TÌM ĐƯỢC THEO YÊU CẦU ===
{retrieved_context}

=== YÊU CẦU QUAN TRỌNG ===
1. Khách hỏi gì đáp nấy. 
2. Dựa vào danh sách "SẢN PHẨM PHÙ HỢP TÌM ĐƯỢC" ở trên để tư vấn chi tiết cho khách.
3. Khi gợi ý, hãy viết CHÍNH XÁC tên sản phẩm và báo giá kèm đuôi "VND".
4. Nếu khách hỏi không liên quan đến laptop (ví dụ sức khỏe, nấu ăn), bạn vẫn được phép trả lời bình thường.

Khách hỏi: "{user_query}"
Trả lời:"""

        response = llm.invoke(prompt)
        answer = response.content
        
        # Trả về câu trả lời và danh sách sản phẩm liên quan để UI render thẻ
        return { "reply": answer, "products": recommended_products }

    except Exception as e:
        print(f"Lỗi Chat: {e}")
        return { "reply": "Hệ thống AI đang quá tải, bạn chờ xí nha :))", "products": [] }

@app.get("/")
def home():
    return {"status": "AI Server V6 (Vector Search & FAISS RAG Activated)"}