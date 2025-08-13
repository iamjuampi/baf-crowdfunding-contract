# 🚀 BAF Crowdfunding Contract - Desarrollo Local

Guía completa para desarrollar y probar el contrato de crowdfunding con DonáFácil en tu entorno local.

## 📋 Prerrequisitos

- **Rust** (versión 1.70+)
- **Node.js** (versión 16+)
- **Stellar CLI** (versión 0.12+)
- **Freighter Wallet** (extensión de navegador)

## ⚡ Inicio Rápido

### 1. **Configurar el entorno**
```bash
# Clonar el repositorio
git clone https://github.com/iamjuampi/baf-crowdfunding-contract.git
cd baf-crowdfunding-contract

# Configurar Rust para WASM
rustup target add wasm32v1-none
```

### 2. **Configurar Freighter Wallet**
- Instala [Freighter](https://www.freighter.app/) en tu navegador
- Cambia a **TESTNET** en la configuración de Freighter
- Crea una nueva cuenta o importa una existente

### 3. **Obtener XLM de testnet**
```bash
./get_testnet_xlm.sh
```
Sigue las instrucciones para obtener XLM de testnet para las pruebas.

### 4. **Iniciar el frontend**
```bash
./start_frontend.sh
```
El frontend estará disponible en `http://localhost:3000`

## 🛒 **Funcionalidades del Frontend**

### **Carrito de Compra con DonáFácil**
- ✅ **Producto de ejemplo**: Vuelo Buenos Aires - Miami ($850 USD)
- ✅ **DonáFácil**: Checkbox que suma automáticamente 1% para donación
- ✅ **Pagos reales**: Integración completa con Stellar testnet
- ✅ **Freighter Wallet**: Conexión directa con la extensión
- ✅ **Balance en tiempo real**: Muestra el balance de XLM de tu wallet

### **Flujo de Pago Completo**
1. **Conectar Wallet**: Conecta Freighter configurado en testnet
2. **Ver Producto**: Producto con precio en USD y XLM
3. **DonáFácil**: Checkbox marcado por defecto suma 1%
4. **Confirmar Donación**: Modal de confirmación al desmarcar
5. **Pagar**: Transacción real en Stellar testnet
6. **Confirmación**: Hash de transacción y detalles del pago

## 🔧 Comandos Disponibles

### **Scripts Principales**
```bash
# Iniciar frontend con pagos reales
./start_frontend.sh

# Obtener XLM de testnet
./get_testnet_xlm.sh

# Interactuar con el contrato
./run_local.sh

# Auditoría de seguridad
./security_audit.sh

# Flujo completo de desarrollo
./dev_workflow.sh
```

### **Comandos del Contrato**
```bash
# Construir y desplegar
./run_local.sh build
./run_local.sh deploy

# Crear campaña
./run_local.sh create-campaign <creator_address> <goal_stroops> <min_donation_stroops>

# Obtener datos de campaña
./run_local.sh get-campaign <campaign_address>

# Contribuir a campaña
./run_local.sh contribute <contributor_address> <campaign_address> <amount_stroops>

# Ejecutar suite completa de pruebas
./run_local.sh test
```

## 💰 **Conversión XLM/Stroops**

- **1 XLM = 10,000,000 stroops**
- **1 USD ≈ 0.15 XLM** (aproximado para testnet)

### **Ejemplos de Conversión**
```bash
# $850 USD = 127.5 XLM = 1,275,000,000 stroops
# Donación 1% = $8.50 USD = 1.275 XLM = 12,750,000 stroops
# Total = $858.50 USD = 128.775 XLM = 1,287,750,000 stroops
```

## 🎯 **Direcciones de Testnet**

### **Cuentas de Prueba**
```bash
# Admin (ya configurado)
GDRDSX2ZOPTRCVWPBA55TXQVNRWM6RNLTLZ5YGVIJ5UXGCDPWXH4KQUL

# Test User (generar con stellar keys)
stellar keys generate --global test-user --network testnet --fund

# Contributor (generar con stellar keys)
stellar keys generate --global contributor --network testnet --fund
```

### **Contrato Desplegado**
```bash
# ID del contrato en testnet
CCNBIWS656R5CR2SJTQMIAMKPDSJS5V4QXLPMC6XIYJQ3GNVJMUHXZW4
```

## 🔐 **Configuración de Seguridad**

### **Freighter Wallet**
- ✅ Configurado en **TESTNET**
- ✅ Cuenta con XLM de testnet
- ✅ Permisos de conexión habilitados

### **Variables de Entorno**
```bash
# Stellar Testnet
TESTNET_URL=https://soroban-testnet.stellar.org
TESTNET_PASSPHRASE="Test SDF Network ; September 2015"

# DonáFácil
DONATION_PERCENTAGE=0.01  # 1%
DONATION_ADDRESS=GDRDSX2ZOPTRCVWPBA55TXQVNRWM6RNLTLZ5YGVIJ5UXGCDPWXH4KQUL
```

## 🧪 **Pruebas del Frontend**

### **Prueba Completa de Pago**
1. **Inicia el frontend**: `./start_frontend.sh`
2. **Conecta Freighter**: Asegúrate de estar en testnet
3. **Verifica balance**: Debe mostrar tu balance de XLM
4. **Prueba DonáFácil**: Marca/desmarca el checkbox
5. **Realiza pago**: Procesa una transacción real
6. **Verifica hash**: Confirma la transacción en testnet

### **Verificar Transacciones**
```bash
# En Stellar Laboratory (testnet)
https://laboratory.stellar.org/#explorer?network=testnet

# Buscar por hash de transacción
# Verificar estado: SUCCESS, FAILED, PENDING
```

## 🚨 **Solución de Problemas**

### **Error: "Freighter wallet no está disponible"**
```bash
# Solución: Instalar Freighter
# 1. Ve a https://www.freighter.app/
# 2. Instala la extensión para tu navegador
# 3. Configura en TESTNET
# 4. Recarga la página
```

### **Error: "Por favor cambia Freighter a TESTNET"**
```bash
# Solución: Cambiar red en Freighter
# 1. Abre Freighter
# 2. Ve a Settings → Network
# 3. Selecciona "Testnet"
# 4. Recarga la página
```

### **Error: "Insufficient balance"**
```bash
# Solución: Obtener XLM de testnet
./get_testnet_xlm.sh
# Sigue las instrucciones para obtener XLM
```

### **Error: "Transaction failed"**
```bash
# Posibles causas:
# 1. Balance insuficiente
# 2. Red incorrecta (debe ser testnet)
# 3. Fee insuficiente
# 4. Timeout de transacción
```

## 📚 **Recursos Adicionales**

### **Documentación**
- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Freighter Documentation](https://www.freighter.app/docs)

### **Herramientas**
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Stellar Quest](https://quest.stellar.org/)
- [Stellar Expert](https://stellar.expert/)

### **Comunidad**
- [Stellar Discord](https://discord.gg/stellarlumens)
- [Stellar Stack Exchange](https://stellar.stackexchange.com/)

## 🎉 **¡Listo para Desarrollar!**

Con esta configuración tienes:
- ✅ Frontend funcional con pagos reales
- ✅ Contrato desplegado en testnet
- ✅ DonáFácil completamente operativo
- ✅ Herramientas de desarrollo automatizadas
- ✅ Documentación completa

¡Disfruta desarrollando con Stellar y Soroban! 🚀 