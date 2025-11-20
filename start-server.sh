#!/bin/bash

# 生存指南遊戲 - 啟動腳本（可選）

echo "🎮 生存指南：民防應變模擬"
echo "================================"
echo ""
echo "💡 提示：新版本可以直接打開 HTML 文件，無需服務器！"
echo "   只有在使用 JSON 文件模式時才需要服務器。"
echo ""
echo "直接使用：open index-new.html"
echo ""
echo "如果你想使用 JSON 文件模式，繼續啟動服務器..."
echo ""

# 檢查 Python 是否安裝
if command -v python3 &> /dev/null; then
    echo "✅ 使用 Python 3 啟動服務器..."
    echo "📡 服務器地址: http://localhost:8000"
    echo "📄 新版本: http://localhost:8000/index-new.html"
    echo "📄 舊版本: http://localhost:8000/index.html"
    echo ""
    echo "按 Ctrl+C 停止服務器"
    echo "================================"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ 使用 Python 2 啟動服務器..."
    echo "📡 服務器地址: http://localhost:8000"
    echo "📄 新版本: http://localhost:8000/index-new.html"
    echo "📄 舊版本: http://localhost:8000/index.html"
    echo ""
    echo "按 Ctrl+C 停止服務器"
    echo "================================"
    python -m SimpleHTTPServer 8000
else
    echo "❌ 未找到 Python"
    echo "請安裝 Python 或使用其他方式啟動 HTTP 服務器"
    echo ""
    echo "其他選項："
    echo "  - Node.js: npx serve"
    echo "  - PHP: php -S localhost:8000"
    exit 1
fi
