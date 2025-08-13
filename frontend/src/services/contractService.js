import { SorobanRpc, Contract, xdr } from 'soroban-client';

// Contract configuration
const CONTRACT_ID = 'CCNBIWS656R5CR2SJTQMIAMKPDSJS5V4QXLPMC6XIYJQ3GNVJMUHXZW4';
const NETWORK_URL = 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

class ContractService {
  constructor() {
    this.server = new SorobanRpc.Server(NETWORK_URL);
    this.contract = new Contract(CONTRACT_ID);
  }

  // Helper function to convert XLM to stroops
  xlmToStroops(xlm) {
    return Math.floor(xlm * 10000000);
  }

  // Helper function to convert stroops to XLM
  stroopsToXlm(stroops) {
    return stroops / 10000000;
  }

  // Helper function to convert address string to XDR
  addressToXDR(address) {
    return xdr.ScAddress.scAddressTypeAccount(
      xdr.PublicKey.publicKeyTypeEd25519(
        xdr.Uint256.fromString(address)
      )
    );
  }

  // Helper function to convert i128 to XDR
  i128ToXDR(value) {
    return xdr.ScVal.scvI128(
      xdr.Int128Parts.fromString(value.toString())
    );
  }

  // Get campaign data
  async getCampaign(campaignAddress) {
    try {
      const result = await this.server.simulateTransaction({
        resourceConfig: {
          instructionLeeway: 1000000,
        },
        networkPassphrase: NETWORK_PASSPHRASE,
        transaction: new SorobanRpc.TransactionBuilder(
          new SorobanRpc.Account("", "0"),
          {
            fee: "100",
            networkPassphrase: NETWORK_PASSPHRASE,
          }
        )
          .addOperation(
            this.contract.call("get_campaign", this.addressToXDR(campaignAddress))
          )
          .setTimeout(30)
          .build(),
      });

      if (result.result && result.result.retval) {
        const campaignData = result.result.retval;
        return {
          goal: this.stroopsToXlm(parseInt(campaignData.goal)),
          minDonation: this.stroopsToXlm(parseInt(campaignData.min_donation)),
          totalRaised: this.stroopsToXlm(parseInt(campaignData.total_raised)),
          supporters: parseInt(campaignData.supporters)
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting campaign:', error);
      throw error;
    }
  }

  // Create a new campaign (admin only)
  async createCampaign(creatorAddress, goalXLM, minDonationXLM) {
    try {
      const goal = this.xlmToStroops(goalXLM);
      const minDonation = this.xlmToStroops(minDonationXLM);

      const result = await this.server.simulateTransaction({
        resourceConfig: {
          instructionLeeway: 1000000,
        },
        networkPassphrase: NETWORK_PASSPHRASE,
        transaction: new SorobanRpc.TransactionBuilder(
          new SorobanRpc.Account("", "0"),
          {
            fee: "100",
            networkPassphrase: NETWORK_PASSPHRASE,
          }
        )
          .addOperation(
            this.contract.call(
              "create_campaign",
              this.addressToXDR(creatorAddress),
              this.i128ToXDR(goal),
              this.i128ToXDR(minDonation)
            )
          )
          .setTimeout(30)
          .build(),
      });

      return result;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  // Contribute to a campaign
  async contribute(contributorAddress, campaignAddress, amountXLM) {
    try {
      const amount = this.xlmToStroops(amountXLM);

      const result = await this.server.simulateTransaction({
        resourceConfig: {
          instructionLeeway: 1000000,
        },
        networkPassphrase: NETWORK_PASSPHRASE,
        transaction: new SorobanRpc.TransactionBuilder(
          new SorobanRpc.Account("", "0"),
          {
            fee: "100",
            networkPassphrase: NETWORK_PASSPHRASE,
          }
        )
          .addOperation(
            this.contract.call(
              "contribute",
              this.addressToXDR(contributorAddress),
              this.addressToXDR(campaignAddress),
              this.i128ToXDR(amount)
            )
          )
          .setTimeout(30)
          .build(),
      });

      return result;
    } catch (error) {
      console.error('Error contributing:', error);
      throw error;
    }
  }

  // Withdraw funds (creator only)
  async withdraw(creatorAddress) {
    try {
      const result = await this.server.simulateTransaction({
        resourceConfig: {
          instructionLeeway: 1000000,
        },
        networkPassphrase: NETWORK_PASSPHRASE,
        transaction: new SorobanRpc.TransactionBuilder(
          new SorobanRpc.Account("", "0"),
          {
            fee: "100",
            networkPassphrase: NETWORK_PASSPHRASE,
          }
        )
          .addOperation(
            this.contract.call("withdraw", this.addressToXDR(creatorAddress))
          )
          .setTimeout(30)
          .build(),
      });

      return result;
    } catch (error) {
      console.error('Error withdrawing:', error);
      throw error;
    }
  }

  // Refund contribution
  async refund(contributorAddress, campaignAddress) {
    try {
      const result = await this.server.simulateTransaction({
        resourceConfig: {
          instructionLeeway: 1000000,
        },
        networkPassphrase: NETWORK_PASSPHRASE,
        transaction: new SorobanRpc.TransactionBuilder(
          new SorobanRpc.Account("", "0"),
          {
            fee: "100",
            networkPassphrase: NETWORK_PASSPHRASE,
          }
        )
          .addOperation(
            this.contract.call(
              "refund",
              this.addressToXDR(contributorAddress),
              this.addressToXDR(campaignAddress)
            )
          )
          .setTimeout(30)
          .build(),
      });

      return result;
    } catch (error) {
      console.error('Error refunding:', error);
      throw error;
    }
  }

  // Get network information
  getNetworkInfo() {
    return {
      contractId: CONTRACT_ID,
      networkUrl: NETWORK_URL,
      networkPassphrase: NETWORK_PASSPHRASE
    };
  }
}

export default new ContractService(); 