import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load file .env giống như trong main.py
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, '..', '.env')
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print("🔍 Đang kết nối với Google để quét danh sách Model...")
print("-" * 50)
try:
    models = genai.list_models()
    found = False
    for m in models:
        # Kiểm tra xem model nào hỗ trợ nhúng dữ liệu (Embedding)
        if 'embedContent' in m.supported_generation_methods:
            print(f"✅ BẠN CÓ THỂ DÙNG MODEL NÀY: {m.name}")
            found = True
            
    if not found:
        print("❌ API Key của bạn hiện không hỗ trợ bất kỳ model Embedding nào!")
except Exception as e:
    print("❌ Lỗi kết nối:", e)
print("-" * 50)