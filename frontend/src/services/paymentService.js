import { SorobanRpc, TransactionBuilder, Operation, Asset } from 'soroban-client';

// Stellar Testnet Configuration
const TESTNET_URL = 'https://soroban-testnet.stellar.org';
const TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015';

// DonáFácil configuration
const DONATION_PERCENTAGE = 0.01; // 1%
const DONATION_ADDRESS = 'GDRDSX2ZOPTRCVWPBA55TXQVNRWM6RNLTLZ5YGVIJ5UXGCDPWXH4KQUL'; // Admin address

class PaymentService {
  constructor() {
    this.server = new SorobanRpc.Server(TESTNET_URL);
    this.networkPassphrase = TESTNET_PASSPHRASE;
  }

  // Check if Freighter is available
  isFreighterAvailable() {
    return typeof window.freighterApi !== 'undefined';
  }

  // Connect to Freighter wallet
  async connectWallet() {
    if (!this.isFreighterAvailable()) {
      throw new Error('Freighter wallet no está disponible. Por favor instala la extensión.');
    }

    try {
      const isConnected = await window.freighterApi.isConnected();
      if (!isConnected) {
        await window.freighterApi.connect();
      }
      
      const publicKey = await window.freighterApi.getPublicKey();
      const network = await window.freighterApi.getNetwork();
      
      if (network !== 'TESTNET') {
        throw new Error('Por favor cambia Freighter a TESTNET');
      }

      return {
        publicKey,
        isConnected: true,
        network
      };
    } catch (error) {
      throw new Error(`Error conectando Freighter: ${error.message}`);
    }
  }

  // Get account balance
  async getBalance(publicKey) {
    try {
      const account = await this.server.getAccount(publicKey);
      return account.balances.find(balance => balance.asset_type === 'native')?.balance || '0';
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  // Calculate payment amounts
  calculatePaymentAmounts(baseAmount, includeDonation = true) {
    const baseAmountXLM = baseAmount * 0.15; // Convert USD to XLM (approximate)
    const donationAmount = includeDonation ? baseAmountXLM * DONATION_PERCENTAGE : 0;
    const totalAmount = baseAmountXLM + donationAmount;

    return {
      baseAmount: baseAmountXLM,
      donationAmount,
      totalAmount,
      baseAmountUSD: baseAmount,
      donationAmountUSD: baseAmount * DONATION_PERCENTAGE,
      totalAmountUSD: baseAmount * (1 + DONATION_PERCENTAGE)
    };
  }

  // Create and send payment transaction
  async processPayment(amounts, includeDonation = true) {
    if (!this.isFreighterAvailable()) {
      throw new Error('Freighter wallet no está disponible');
    }

    try {
      const publicKey = await window.freighterApi.getPublicKey();
      
      // Get account details
      const account = await this.server.getAccount(publicKey);
      
      // Create transaction
      const transaction = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: this.networkPassphrase
      });

      // Add base payment operation
      transaction.addOperation(
        Operation.payment({
          destination: DONATION_ADDRESS, // For demo, sending to admin
          asset: Asset.native(),
          amount: amounts.baseAmount.toFixed(7)
        })
      );

      // Add donation operation if enabled
      if (includeDonation && amounts.donationAmount > 0) {
        transaction.addOperation(
          Operation.payment({
            destination: DONATION_ADDRESS,
            asset: Asset.native(),
            amount: amounts.donationAmount.toFixed(7)
          })
        );
      }

      // Set timeout
      transaction.setTimeout(30);

      // Build transaction
      const builtTransaction = transaction.build();

      // Sign with Freighter
      const signedTransaction = await window.freighterApi.signTransaction(
        builtTransaction.toXDR(),
        this.networkPassphrase
      );

      // Submit transaction
      const response = await this.server.sendTransaction(signedTransaction);
      
      if (response.status === 'PENDING') {
        // Wait for transaction to be confirmed
        const result = await this.waitForTransaction(response.hash);
        return {
          success: true,
          hash: response.hash,
          result,
          amounts
        };
      } else {
        throw new Error(`Transaction failed: ${response.status}`);
      }

    } catch (error) {
      throw new Error(`Error procesando pago: ${error.message}`);
    }
  }

  // Wait for transaction confirmation
  async waitForTransaction(hash, timeout = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const response = await this.server.getTransaction(hash);
        if (response.status === 'SUCCESS') {
          return response;
        } else if (response.status === 'FAILED') {
          throw new Error('Transaction failed');
        }
        // Wait 2 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        // Transaction might not be available yet, continue waiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    throw new Error('Transaction timeout');
  }

  // Get transaction details
  async getTransactionDetails(hash) {
    try {
      const response = await this.server.getTransaction(hash);
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo detalles de transacción: ${error.message}`);
    }
  }

  // Format XLM amount
  formatXLM(amount) {
    return parseFloat(amount).toFixed(7);
  }

  // Format USD amount
  formatUSD(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}

const paymentService = new PaymentService();
export default paymentService; 