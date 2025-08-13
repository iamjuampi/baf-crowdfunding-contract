import React, { useState } from 'react';
import styled from 'styled-components';
import paymentService from './services/paymentService';

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: #f8f9fa;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #2c3e50;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #7f8c8d;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductSection = styled.div`
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const ProductCard = styled.div`
  border: 1px solid #e1e8ed;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ProductImage = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1.3rem;
`;

const ProductDescription = styled.p`
  color: #7f8c8d;
  margin: 0 0 10px 0;
  line-height: 1.5;
`;

const ProductPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #27ae60;
`;

const CartSection = styled.div`
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
`;

const CartTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 1.5rem;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #ecf0f1;
  
  &:last-child {
    border-bottom: none;
  }
`;

const CartItemLabel = styled.span`
  color: #7f8c8d;
`;

const CartItemValue = styled.span`
  font-weight: bold;
  color: #2c3e50;
`;

const TotalSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #ecf0f1;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 1.1rem;
`;

const FinalTotal = styled(TotalRow)`
  font-size: 1.3rem;
  font-weight: bold;
  color: #27ae60;
  border-top: 1px solid #ecf0f1;
  padding-top: 15px;
  margin-top: 15px;
`;

const DonationCheckbox = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #e9ecef;
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c3e50;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: #27ae60;
`;

const DonationInfo = styled.p`
  margin: 10px 0 0 0;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const PaymentButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-top: 20px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ConnectButton = styled(PaymentButton)`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  font-size: 1.2rem;
  padding: 20px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #2c3e50;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  
  &.primary {
    background: #e74c3c;
    color: white;
  }
  
  &.secondary {
    background: #95a5a6;
    color: white;
  }
`;

const Status = styled.div`
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
  font-weight: 500;
  
  &.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  &.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  &.info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }
`;

const WalletInfo = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  border-left: 4px solid #28a745;
`;

const BalanceInfo = styled.div`
  background: #e8f5e8;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  border-left: 4px solid #28a745;
`;

function App() {
  const [wallet, setWallet] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationEnabled, setDonationEnabled] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [balance, setBalance] = useState('0');

  // Product data
  const product = {
    id: 1,
    name: "Vuelo Buenos Aires - Miami",
    description: "Vuelo directo en clase económica, incluye equipaje de mano. Fecha: 15 de Diciembre 2024",
    price: 850, // USD
    image: "✈️"
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      setStatus('Conectando a Freighter wallet...');
      
      const walletInfo = await paymentService.connectWallet();
      setWallet(walletInfo);
      setConnected(true);
      
      // Get balance
      const accountBalance = await paymentService.getBalance(walletInfo.publicKey);
      setBalance(accountBalance);
      
      setStatus('Conectado a Freighter wallet exitosamente!', 'success');
    } catch (error) {
      setStatus(`Error conectando wallet: ${error.message}`, 'error');
    } finally {
      setLoading(false);
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

  const calculateTotal = () => {
    const amounts = paymentService.calculatePaymentAmounts(product.price, donationEnabled);
    return amounts;
  };

  const processPayment = async () => {
    try {
      setLoading(true);
      setStatus('Procesando pago con Stellar...');
      
      const amounts = calculateTotal();
      
      // Process real payment
      const result = await paymentService.processPayment(amounts, donationEnabled);
      
      setTransactionHash(result.hash);
      setShowPaymentModal(true);
      setStatus('Pago procesado exitosamente en testnet!', 'success');
      
      // Update balance
      if (wallet?.publicKey) {
        const newBalance = await paymentService.getBalance(wallet.publicKey);
        setBalance(newBalance);
      }
    } catch (error) {
      setStatus(`Error procesando pago: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setTransactionHash('');
  };

  const amounts = calculateTotal();

  return (
    <Container>
      <Header>
        <Title>🛒 Carrito de Compra</Title>
        <Subtitle>Paga con Stellar de forma segura y rápida</Subtitle>
      </Header>

      {!connected ? (
        <div style={{ textAlign: 'center', background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2>Conecta tu Wallet</h2>
          <p>Conecta tu wallet de Stellar para continuar con la compra.</p>
          <p><strong>Recomendado:</strong> Instala <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer">Freighter</a> para la mejor experiencia.</p>
          <p><strong>Importante:</strong> Asegúrate de que Freighter esté configurado en <strong>TESTNET</strong>.</p>
          <ConnectButton onClick={connectWallet} disabled={loading}>
            {loading ? 'Conectando...' : 'Conectar Freighter Wallet'}
          </ConnectButton>
        </div>
      ) : (
        <>
          <WalletInfo>
            <p><strong>Wallet:</strong> {wallet?.publicKey}</p>
            <p><strong>Red:</strong> {wallet?.network}</p>
            <p><strong>Estado:</strong> Conectado</p>
          </WalletInfo>

          <BalanceInfo>
            <p><strong>Balance XLM:</strong> {paymentService.formatXLM(balance)} XLM</p>
            <p><strong>Balance USD:</strong> {paymentService.formatUSD(balance / 0.15)}</p>
          </BalanceInfo>

          <MainContent>
            <ProductSection>
              <h2>Producto</h2>
              <ProductCard>
                <ProductImage>{product.image}</ProductImage>
                <ProductInfo>
                  <ProductTitle>{product.name}</ProductTitle>
                  <ProductDescription>{product.description}</ProductDescription>
                  <ProductPrice>{paymentService.formatUSD(product.price)}</ProductPrice>
                </ProductInfo>
              </ProductCard>
            </ProductSection>

            <CartSection>
              <CartTitle>Resumen de Compra</CartTitle>
              
              <CartItem>
                <CartItemLabel>Subtotal USD</CartItemLabel>
                <CartItemValue>{paymentService.formatUSD(amounts.baseAmountUSD)}</CartItemValue>
              </CartItem>

              <CartItem>
                <CartItemLabel>Subtotal XLM</CartItemLabel>
                <CartItemValue>{paymentService.formatXLM(amounts.baseAmount)} XLM</CartItemValue>
              </CartItem>

              <DonationCheckbox>
                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    checked={donationEnabled}
                    onChange={handleDonationToggle}
                  />
                  <div>
                    <strong>DonáFácil</strong>
                    <DonationInfo>Suma un 1% adicional para donación. ¡Ayuda a hacer el mundo mejor!</DonationInfo>
                  </div>
                </CheckboxContainer>
              </DonationCheckbox>

              {donationEnabled && (
                <>
                  <CartItem>
                    <CartItemLabel>Donación USD (1%)</CartItemLabel>
                    <CartItemValue>{paymentService.formatUSD(amounts.donationAmountUSD)}</CartItemValue>
                  </CartItem>
                  <CartItem>
                    <CartItemLabel>Donación XLM (1%)</CartItemLabel>
                    <CartItemValue>{paymentService.formatXLM(amounts.donationAmount)} XLM</CartItemValue>
                  </CartItem>
                </>
              )}

              <TotalSection>
                <TotalRow>
                  <CartItemLabel>Total USD</CartItemLabel>
                  <CartItemValue>{paymentService.formatUSD(amounts.totalAmountUSD)}</CartItemValue>
                </TotalRow>
                <FinalTotal>
                  <CartItemLabel>Total XLM</CartItemLabel>
                  <CartItemValue>{paymentService.formatXLM(amounts.totalAmount)} XLM</CartItemValue>
                </FinalTotal>
              </TotalSection>

              <PaymentButton onClick={processPayment} disabled={loading}>
                {loading ? 'Procesando...' : 'Pagar con Stellar'}
              </PaymentButton>
            </CartSection>
          </MainContent>
        </>
      )}

      {/* Donation Confirmation Modal */}
      {showDonationModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>¿Estás seguro de que NO querés donar?</ModalTitle>
            <p>Al desmarcar DonáFácil, no se sumará el 1% adicional a tu compra.</p>
            <ModalButtons>
              <ModalButton className="secondary" onClick={cancelDonationDisable}>
                NO
              </ModalButton>
              <ModalButton className="primary" onClick={confirmDonationDisable}>
                SÍ
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>¡Compra Confirmada!</ModalTitle>
            <p>Tu pago ha sido procesado exitosamente en Stellar testnet.</p>
            <p><strong>Hash de Transacción:</strong></p>
            <p style={{ fontFamily: 'monospace', background: '#f8f9fa', padding: '10px', borderRadius: '5px', wordBreak: 'break-all' }}>
              {transactionHash}
            </p>
            <p><strong>Monto Total:</strong> {paymentService.formatXLM(amounts.totalAmount)} XLM</p>
            <p><strong>Donación:</strong> {donationEnabled ? 'Sí' : 'No'}</p>
            <ModalButtons>
              <ModalButton className="primary" onClick={closePaymentModal}>
                Cerrar
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}

      {status && (
        <Status className={status.includes('Error') ? 'error' : status.includes('exitosamente') ? 'success' : 'info'}>
          {status}
        </Status>
      )}
    </Container>
  );
}

export default App; 