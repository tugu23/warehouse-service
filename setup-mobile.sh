#!/bin/bash

# Mobile App Setup Script
# Энэ script нь mobile app-ийг backend-тай холбох setup-ийг хийнэ

echo "📱 Warehouse Mobile App Setup"
echo "================================"
echo ""

# 1. IP хаяг олох
echo "🔍 Компьютерийн IP хаяг олж байна..."
IP=$(ipconfig | grep "192.168" | grep "IPv4" | head -1 | awk '{print $NF}')

if [ -z "$IP" ]; then
    echo "❌ IP хаяг олдсонгүй!"
    echo "Гараар ipconfig командыг ажиллуулж IP хаягаа олоорой."
    exit 1
fi

echo "✅ IP хаяг: $IP"
echo ""

# 2. Backend шалгах
echo "🔍 Backend ажиллаж байгаа эсэхийг шалгаж байна..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend localhost:3000 дээр ажиллаж байна"
else
    echo "❌ Backend ажиллахгүй байна!"
    echo "podman-compose up -d команд ажиллуулна уу"
    exit 1
fi
echo ""

# 3. Mobile app .env файл үүсгэх
echo "📝 Mobile app .env файл үүсгэж байна..."
cat > ../warehouse-mobile/.env << EOF
EXPO_PUBLIC_API_URL=http://$IP:3000
EOF
echo "✅ .env файл үүсгэгдлээ: http://$IP:3000"
echo ""

# 4. IP хаягаар backend тест хийх
echo "🔍 IP хаягаар backend-д хандаж байна..."
if curl -s http://$IP:3000/health > /dev/null 2>&1; then
    echo "✅ Backend $IP:3000 дээр хүрч байна"
else
    echo "⚠️  IP хаягаар хүрч чадахгүй байна"
    echo "Firewall эсвэл сүлжээний тохиргоогоо шалгана уу"
fi
echo ""

# 5. Заавар
echo "================================"
echo "✅ Setup бэлэн болсон!"
echo ""
echo "📱 Дараагийн алхамууд:"
echo "1. Mobile folder руу орох:"
echo "   cd ../warehouse-mobile"
echo ""
echo "2. App эхлүүлэх:"
echo "   npm start"
echo ""
echo "3. Гар утсандаа Expo Go апп татаад QR код scan хийх"
echo ""
echo "4. Нэвтрэх:"
echo "   Email: agent@warehouse.com"
echo "   Password: agent123"
echo ""
echo "🌐 Backend URL: http://$IP:3000"
echo "================================"
