#!/bin/bash

echo "🧪 Testing React Frontend"
echo "========================"
echo ""

echo "1. Checking if frontend is running..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not running"
    exit 1
fi

echo ""
echo "2. Checking HTML structure..."
html_content=$(curl -s http://localhost:3000)
if echo "$html_content" | grep -q '<div id="root">'; then
    echo "✅ Root div found"
else
    echo "❌ Root div not found"
fi

echo ""
echo "3. Checking JavaScript bundle..."
if curl -s http://localhost:3000/static/js/bundle.js > /dev/null; then
    echo "✅ JavaScript bundle accessible"
else
    echo "❌ JavaScript bundle not accessible"
fi

echo ""
echo "4. Testing React rendering..."
echo "   Please open http://localhost:3000 in your browser"
echo "   Press F12 to open developer tools"
echo "   Go to Console tab"
echo "   Look for: 'App component is rendering!'"
echo ""

echo "5. If you don't see the message, try:"
echo "   - Hard refresh (Ctrl+Shift+R)"
echo "   - Clear browser cache"
echo "   - Check for JavaScript errors in console"
echo ""

echo "6. Manual test:"
echo "   - Click the '🚀 Probar Funcionalidad' button"
echo "   - You should see an alert saying '¡Botón funcionando!'"
echo ""

echo "7. If still not working, try:"
echo "   cd frontend && npm start"
echo ""

echo "🔍 Debugging steps:"
echo "   1. Open browser console (F12)"
echo "   2. Look for red error messages"
echo "   3. Check Network tab for failed requests"
echo "   4. Try different browser or incognito mode"
echo "" 