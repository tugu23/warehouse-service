#!/bin/bash

echo "🔄 Backend дахин эхлүүлж байна..."

# Одоо ажиллаж буй node процессийг зогсоох
taskkill //F //IM node.exe 2>/dev/null

echo "⏳ 3 секунд хүлээж байна..."
sleep 3

# Backend эхлүүлэх
cd /c/Users/User/OneDrive/Desktop/diplom/warehouse-service
npm run dev &

echo "⏳ Backend эхлэхийг хүлээж байна..."
sleep 10

# Шалгах
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend амжилттай эхэллээ!"
    echo "🌐 Backend URL: http://192.168.1.205:3000"
else
    echo "❌ Backend эхлээгүй байна"
fi
