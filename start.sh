#!/bin/bash

# 交互式地图应用启动脚本

echo "========================================="
echo "   Interactive Campus Map - 启动脚本"
echo "========================================="
echo ""

# 激活conda环境
echo "1. 激活 conda 环境..."
source /opt/conda/bin/activate base

# 检查依赖
echo "2. 检查依赖..."
python -c "import flask" 2>/dev/null || {
    echo "   Flask 未安装，正在安装..."
    pip install flask flask-cors
}

# 启动后端服务器
echo "3. 启动后端 API 服务器..."
cd /workspace/building/webapp/backend
python app.py &
BACKEND_PID=$!

echo ""
echo "========================================="
echo "   服务已启动！"
echo "========================================="
echo ""
echo "后端 API: http://localhost:5000"
echo "   - GET  /api/boundary"
echo "   - GET  /api/buildings"
echo "   - GET  /api/countries"
echo "   - GET  /api/user-points"
echo "   - POST /api/user-points"
echo ""
echo "前端页面: 请使用浏览器打开"
echo "   /workspace/building/webapp/index.html"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "========================================="

# 等待用户中断
wait $BACKEND_PID