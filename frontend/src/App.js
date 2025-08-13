import React, { useState } from 'react';
import { Server, Networks, TransactionBuilder, Operation, Asset } from '@stellar/stellar-sdk';

function App() {
  console.log('App component is rendering with shopping cart!');
  
  const [donationEnabled, setDonationEnabled] = useState(true);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  // Product data
  const product = {
    name: "Vuelo Buenos Aires - Miami",
    description: "Vuelo directo en clase económica, incluye equipaje de mano. Fecha: 15 de Diciembre 2024",
    price: 850, // USD
    image: "✈️"
  };

  // Calculate amounts
  const baseAmountUSD = product.price;
  const baseAmountXLM = baseAmountUSD * 0.15; // Approximate conversion
  const donationAmountUSD = donationEnabled ? baseAmountUSD * 0.01 : 0;
  const donationAmountXLM = donationEnabled ? baseAmountXLM * 0.01 : 0;
  const totalAmountUSD = baseAmountUSD + donationAmountUSD;
  const totalAmountXLM = baseAmountXLM + donationAmountXLM;

  // Check if Freighter is installed - improved detection
  const isFreighterInstalled = () => {
    return typeof window !== 'undefined' && 
           (window.freighterApi || 
            window.freighter || 
            document.querySelector('script[src*="freighter"]'));
  };

  // Connect to Freighter - improved connection
  const connectWallet = async () => {
    try {
      console.log('Attempting to connect to Freighter...');
      
      // Check multiple possible Freighter APIs
      let freighterApi = null;
      
      if (window.freighterApi) {
        freighterApi = window.freighterApi;
        console.log('Found freighterApi');
      } else if (window.freighter) {
        freighterApi = window.freighter;
        console.log('Found freighter');
      } else {
        console.log('Freighter not found, checking for extension...');
        
        // Try to detect if Freighter extension is installed
        const isInstalled = await checkFreighterExtension();
        if (!isInstalled) {
          alert('Freighter Wallet no está instalado. Por favor instala la extensión desde https://www.freighter.app/');
          return;
        }
        
        // Wait a bit and try again
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (window.freighterApi) {
          freighterApi = window.freighterApi;
        } else if (window.freighter) {
          freighterApi = window.freighter;
        }
      }

      if (!freighterApi) {
        alert('No se pudo conectar con Freighter Wallet. Asegúrate de que esté instalado y activo.');
        return;
      }

      // Check connection status
      let isConnected = false;
      try {
        isConnected = await freighterApi.isConnected();
      } catch (e) {
        console.log('isConnected not available, trying to connect directly');
      }

      if (!isConnected) {
        try {
          await freighterApi.connect();
          console.log('Connected to Freighter');
        } catch (e) {
          console.log('Connect failed, trying alternative method');
          // Some versions don't have connect method
        }
      }

      // Get public key
      const publicKey = await freighterApi.getPublicKey();
      console.log('Got public key:', publicKey);
      setWalletAddress(publicKey);
      setWalletConnected(true);

      // Get balance
      await updateBalance(publicKey);
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert(`Error al conectar con Freighter Wallet: ${error.message}`);
    }
  };

  // Check if Freighter extension is installed
  const checkFreighterExtension = async () => {
    try {
      // Try to inject a script to detect Freighter
      const script = document.createElement('script');
      script.src = 'chrome-extension://ajamhkmhgnjfhnhmlbmmhkmhkmhkmhkm/scripts/inpage.js';
      document.head.appendChild(script);
      
      // Wait for potential injection
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return window.freighterApi || window.freighter;
    } catch (e) {
      return false;
    }
  };

  // Update wallet balance
  const updateBalance = async (address) => {
    try {
      const server = new Server('https://horizon-testnet.stellar.org');
      const account = await server.loadAccount(address);
      const xlmBalance = account.balances.find(b => b.asset_type === 'native');
      setWalletBalance(parseFloat(xlmBalance.balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
      setWalletBalance(0);
    }
  };

  // Process payment with Stellar Contract
  const processPayment = async () => {
    if (!walletConnected) {
      alert('Por favor conecta tu wallet primero');
      return;
    }

    setIsProcessing(true);
    try {
      // Get Freighter API
      const freighterApi = window.freighterApi || window.freighter;
      
      // Initialize Stellar server
      const server = new Server('https://horizon-testnet.stellar.org');
      
      // Load account to get sequence number
      const account = await server.loadAccount(walletAddress);
      
      // Contract parameters
      const contractId = 'CARUYQDY6POZSMUFCGJZCHFMQIDTMAO35JWWPJAYUWCUHOHAZDOJC2UC';
      const contributor = 'GBG4WISAIK5PVGXSIHF7PGLPYT4SBTK7PUQIN76WONJIBJRYPSI2ZM3I';
      const campaignAddress = 'GBAPH22BDWNPPKY3Q7PUS2EY34TPRWJ53OGYKGZ55TSCQBGTQZ2AW66V';
      const amount = '500'; // Amount in stroops
      
      // Create contract invoke operation
      const contractOp = Operation.invokeHostFunction({
        hostFunction: {
          type: 'InvokeContract',
          contractId: contractId,
          functionName: 'contribute',
          args: [
            // Contributor address
            { type: 'Address', address: { type: 'Account', accountId: contributor } },
            // Campaign address  
            { type: 'Address', address: { type: 'Account', accountId: campaignAddress } },
            // Amount
            { type: 'I128', i128: { lo: amount, hi: 0 } }
          ]
        },
        auth: []
      });

      // Build transaction
      const transaction = new TransactionBuilder(account, {
        fee: '100000', // Higher fee for contract operations
        networkPassphrase: Networks.TESTNET
      })
        .addOperation(contractOp)
        .setTimeout(30)
        .build();

      // Sign transaction with Freighter
      const signedTransaction = await freighterApi.signTransaction(
        transaction.toXDR(),
        Networks.TESTNET
      );

      // Submit transaction
      const response = await server.submitTransaction(signedTransaction);
      console.log('Contract transaction submitted:', response.hash);
      
      setTransactionHash(response.hash);
      setShowSuccessModal(true);
      
      // Update balance
      await updateBalance(walletAddress);
      
    } catch (error) {
      console.error('Error processing contract payment:', error);
      alert('Error al procesar el pago del contrato: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDonationToggle = () => {
    if (donationEnabled) {
      setShowDonationModal(true);
    } else {
      setDonationEnabled(true);
    }
  };

  const confirmDonationDisable = () => {
    setDonationEnabled(false);
    setShowDonationModal(false);
  };

  const cancelDonationDisable = () => {
    setShowDonationModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setTransactionHash('');
  };

  return (
    <div style={{ 
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh',
      background: '#f8f9fa'
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: '30px',
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#2c3e50' }}>
          🛒 Carrito de Compra
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#7f8c8d' }}>
          Paga con Stellar de forma segura y rápida
        </p>
      </header>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '30px'
      }}>
        {/* Product Section */}
        <div style={{
          background: 'white',
          borderRadius: '10px',
          padding: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2>Producto</h2>
          <div style={{
            border: '1px solid #e1e8ed',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem'
            }}>
              {product.image}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '1.3rem' }}>
                {product.name}
              </h3>
              <p style={{ color: '#7f8c8d', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                {product.description}
              </p>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
                ${baseAmountUSD.toFixed(2)} USD
              </div>
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <div style={{
          background: 'white',
          borderRadius: '10px',
          padding: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          height: 'fit-content',
          position: 'sticky',
          top: '20px'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '1.5rem' }}>
            Resumen de Compra
          </h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 0',
            borderBottom: '1px solid #ecf0f1'
          }}>
            <span style={{ color: '#7f8c8d' }}>Subtotal USD</span>
            <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>${baseAmountUSD.toFixed(2)}</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 0',
            borderBottom: '1px solid #ecf0f1'
          }}>
            <span style={{ color: '#7f8c8d' }}>Subtotal XLM</span>
            <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{baseAmountXLM.toFixed(2)} XLM</span>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '2px solid #e9ecef'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 500,
              color: '#2c3e50'
            }}>
              <input
                type="checkbox"
                checked={donationEnabled}
                onChange={handleDonationToggle}
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: '#27ae60'
                }}
              />
              <div>
                <strong>DonáFácil</strong>
                <p style={{ margin: '10px 0 0 0', color: '#7f8c8d', fontSize: '0.9rem' }}>
                  Suma un 1% adicional para donación. ¡Ayuda a hacer el mundo mejor!
                </p>
              </div>
            </label>
          </div>

          {donationEnabled && (
            <>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 0',
                borderBottom: '1px solid #ecf0f1'
              }}>
                <span style={{ color: '#7f8c8d' }}>Donación USD (1%)</span>
                <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>${donationAmountUSD.toFixed(2)}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 0',
                borderBottom: '1px solid #ecf0f1'
              }}>
                <span style={{ color: '#7f8c8d' }}>Donación XLM (1%)</span>
                <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{donationAmountXLM.toFixed(2)} XLM</span>
              </div>
            </>
          )}

          <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '2px solid #ecf0f1'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              fontSize: '1.1rem'
            }}>
              <span style={{ color: '#7f8c8d' }}>Total USD</span>
              <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>${totalAmountUSD.toFixed(2)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: '#27ae60',
              borderTop: '1px solid #ecf0f1',
              paddingTop: '15px',
              marginTop: '15px'
            }}>
              <span style={{ color: '#7f8c8d' }}>Total XLM</span>
              <span>{totalAmountXLM.toFixed(2)} XLM</span>
            </div>
          </div>

          {/* Wallet Status */}
          {walletConnected && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: '#e8f5e8',
              borderRadius: '8px',
              border: '1px solid #27ae60'
            }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#27ae60' }}>
                <strong>Wallet Conectada:</strong> {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 8)}
              </p>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#27ae60' }}>
                <strong>Saldo:</strong> {walletBalance.toFixed(2)} XLM
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <button 
            onClick={walletConnected ? processPayment : connectWallet}
            disabled={isProcessing}
            style={{
              width: '100%',
              background: isProcessing ? '#95a5a6' : 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
              color: 'white',
              border: 'none',
              padding: '15px',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              marginTop: '20px'
            }}
          >
            {isProcessing ? 'Procesando Pago...' : 'Pagar'}
          </button>
        </div>
      </div>

      {/* Donation Confirmation Modal */}
      {showDonationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>
              ¿Estás seguro de que NO querés donar?
            </h3>
            <p>Al desmarcar DonáFácil, no se sumará el 1% adicional a tu compra.</p>
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              marginTop: '20px'
            }}>
              <button 
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  background: '#95a5a6',
                  color: 'white'
                }}
                onClick={cancelDonationDisable}
              >
                NO
              </button>
              <button 
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  background: '#e74c3c',
                  color: 'white'
                }}
                onClick={confirmDonationDisable}
              >
                SÍ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '20px'
            }}>
              ✅
            </div>
            <h3 style={{ margin: '0 0 20px 0', color: '#27ae60' }}>
              ¡Contrato Ejecutado!
            </h3>
            <p style={{ margin: '0 0 15px 0', color: '#7f8c8d' }}>
              La transacción del contrato ha sido procesada exitosamente en la red Stellar testnet.
            </p>
            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              wordBreak: 'break-all'
            }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#7f8c8d' }}>
                <strong>Transaction Hash:</strong>
              </p>
              <p style={{ margin: '0', fontSize: '0.8rem', color: '#2c3e50', fontFamily: 'monospace' }}>
                {transactionHash}
              </p>
            </div>
            <button 
              onClick={closeSuccessModal}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 600,
                background: '#27ae60',
                color: 'white'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 