#!/bin/bash

echo "🔍 BAF Crowdfunding - Frontend Debug Script"
echo "============================================"
echo ""

echo "📊 Verificando estado del frontend..."
echo ""

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend está corriendo en http://localhost:3000"
else
    echo "❌ Frontend no está corriendo"
    exit 1
fi

echo ""
echo "📁 Verificando archivos críticos..."

# Check critical files
files=(
    "frontend/src/index.js"
    "frontend/src/App.js"
    "frontend/src/services/paymentService.js"
    "frontend/public/index.html"
    "frontend/package.json"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file NO existe"
    fi
done

echo ""
echo "📦 Verificando dependencias..."

# Check if node_modules exists
if [ -d "frontend/node_modules" ]; then
    echo "✅ node_modules existe"
    
    # Check critical dependencies
    deps=("react" "react-dom" "styled-components" "soroban-client")
    for dep in "${deps[@]}"; do
        if [ -d "frontend/node_modules/$dep" ]; then
            echo "✅ $dep instalado"
        else
            echo "❌ $dep NO instalado"
        fi
    done
else
    echo "❌ node_modules NO existe"
fi

echo ""
echo "🌐 Verificando respuesta del servidor..."

# Get HTTP response
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
echo "HTTP Status Code: $response"

if [ "$response" = "200" ]; then
    echo "✅ Servidor responde correctamente"
else
    echo "❌ Servidor no responde correctamente"
fi

echo ""
echo "📋 Verificando contenido HTML..."

# Check if root div exists
if curl -s http://localhost:3000 | grep -q '<div id="root">'; then
    echo "✅ Elemento root encontrado"
else
    echo "❌ Elemento root NO encontrado"
fi

echo ""
echo "🔧 Comandos de diagnóstico:"
echo ""
echo "1. Abre las herramientas de desarrollador (F12)"
echo "2. Ve a la pestaña 'Console'"
echo "3. Recarga la página (Ctrl+R)"
echo "4. Busca errores en rojo"
echo ""
echo "5. Verifica la pestaña 'Network':"
echo "   - Busca archivos .js que fallen al cargar"
echo "   - Verifica que bundle.js se cargue correctamente"
echo ""
echo "6. Si hay errores, ejecuta:"
echo "   cd frontend && npm install"
echo "   npm start"
echo ""

echo "🎯 URLs útiles:"
echo "   Frontend: http://localhost:3000"
echo "   Stellar Laboratory: https://laboratory.stellar.org/#explorer?network=testnet"
echo "   Freighter: https://www.freighter.app/"
echo "" 