#!/bin/bash

# BAF Crowdfunding Contract - Deployment Script
# This script helps you deploy and test the application

set -e

echo "🚀 BAF Crowdfunding - Deployment Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ]; then
    print_error "No se encontró package.json ni directorio frontend. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

case "$1" in
    "local")
        print_status "Iniciando despliegue local..."
        
        # Kill any existing processes on port 3000
        print_status "Liberando puerto 3000..."
        pkill -f "react-scripts" || true
        sleep 2
        
        # Check if port 3000 is free
        if lsof -ti:3000 > /dev/null 2>&1; then
            print_warning "Puerto 3000 aún ocupado. Intentando liberar..."
            lsof -ti:3000 | xargs kill -9 || true
            sleep 3
        fi
        
        # Start frontend
        print_status "Iniciando frontend en modo desarrollo..."
        cd frontend
        npm start &
        FRONTEND_PID=$!
        
        # Wait for frontend to start
        print_status "Esperando que el frontend inicie..."
        sleep 10
        
        # Check if frontend is running
        if curl -s http://localhost:3000 > /dev/null; then
            print_success "Frontend iniciado exitosamente!"
            echo ""
            echo "🌐 URLs disponibles:"
            echo "   Local: http://localhost:3000"
            echo "   Network: http://$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}'):3000"
            echo ""
            echo "📋 Próximos pasos:"
            echo "   1. Abre http://localhost:3000 en tu navegador"
            echo "   2. Instala Freighter: https://www.freighter.app/"
            echo "   3. Configura Freighter en TESTNET"
            echo "   4. Obtén XLM de testnet: ./get_testnet_xlm.sh"
            echo "   5. ¡Prueba las transacciones!"
            echo ""
            echo "Para detener el frontend: Ctrl+C"
            
            # Wait for user to stop
            wait $FRONTEND_PID
        else
            print_error "Error iniciando frontend. Verifica los logs arriba."
            exit 1
        fi
        ;;
        
    "build")
        print_status "Creando build de producción..."
        cd frontend
        npm run build
        print_success "Build completado en frontend/build/"
        ;;
        
    "serve")
        print_status "Sirviendo build de producción..."
        
        # Check if build exists
        if [ ! -d "frontend/build" ]; then
            print_error "No se encontró build. Ejecuta './deploy.sh build' primero."
            exit 1
        fi
        
        # Install serve if not available
        if ! command -v serve &> /dev/null; then
            print_status "Instalando serve..."
            npm install -g serve
        fi
        
        # Kill any existing processes on port 3000
        pkill -f "serve" || true
        sleep 2
        
        # Serve the build
        print_status "Sirviendo aplicación en puerto 3000..."
        serve -s frontend/build -l 3000 &
        SERVE_PID=$!
        
        sleep 3
        
        if curl -s http://localhost:3000 > /dev/null; then
            print_success "Aplicación servida exitosamente!"
            echo ""
            echo "🌐 URLs disponibles:"
            echo "   Local: http://localhost:3000"
            echo "   Network: http://$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}'):3000"
            echo ""
            echo "Para detener: Ctrl+C"
            
            wait $SERVE_PID
        else
            print_error "Error sirviendo la aplicación."
            exit 1
        fi
        ;;
        
    "test")
        print_status "Ejecutando pruebas del contrato..."
        ./run_local.sh test
        ;;
        
    "clean")
        print_status "Limpiando procesos y puertos..."
        pkill -f "react-scripts" || true
        pkill -f "serve" || true
        lsof -ti:3000 | xargs kill -9 || true
        print_success "Limpieza completada."
        ;;
        
    "status")
        print_status "Verificando estado del despliegue..."
        
        echo ""
        echo "📊 Estado de puertos:"
        if lsof -ti:3000 > /dev/null 2>&1; then
            print_success "Puerto 3000: OCUPADO"
            lsof -i:3000
        else
            print_warning "Puerto 3000: LIBRE"
        fi
        
        echo ""
        echo "📁 Estado de archivos:"
        if [ -d "frontend/build" ]; then
            print_success "Build de producción: DISPONIBLE"
        else
            print_warning "Build de producción: NO DISPONIBLE"
        fi
        
        if [ -d "frontend/node_modules" ]; then
            print_success "Dependencias: INSTALADAS"
        else
            print_warning "Dependencias: NO INSTALADAS"
        fi
        
        echo ""
        echo "🌐 URLs de prueba:"
        echo "   Local: http://localhost:3000"
        echo "   Stellar Laboratory: https://laboratory.stellar.org/#explorer?network=testnet"
        echo "   Freighter: https://www.freighter.app/"
        ;;
        
    *)
        echo "Uso: $0 {local|build|serve|test|clean|status}"
        echo ""
        echo "Comandos disponibles:"
        echo "  local   - Iniciar frontend en modo desarrollo"
        echo "  build   - Crear build de producción"
        echo "  serve   - Servir build de producción"
        echo "  test    - Ejecutar pruebas del contrato"
        echo "  clean   - Limpiar procesos y puertos"
        echo "  status  - Verificar estado del despliegue"
        echo ""
        echo "Ejemplos:"
        echo "  $0 local    # Iniciar desarrollo local"
        echo "  $0 build    # Crear build de producción"
        echo "  $0 serve    # Servir aplicación optimizada"
        echo "  $0 status   # Verificar estado actual"
        exit 1
        ;;
esac 