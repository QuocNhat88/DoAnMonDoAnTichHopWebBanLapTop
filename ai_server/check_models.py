import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load key từ file .env
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, '..', '.env')
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ Lỗi: Không tìm thấy API Key trong file .env")
else:
    print(f"🔑 Đang kiểm tra Key: ...{api_key[-5:]}")
    genai.configure(api_key=api_key)

    print("\n📋 DANH SÁCH MODEL BẠN ĐƯỢC DÙNG:")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"   ✅ {m.name}")
    except Exception as e:
        print(f"❌ Lỗi khi gọi Google: {e}")