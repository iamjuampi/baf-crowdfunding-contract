# Local Development Guide

This guide will help you run and test the BAF Crowdfunding Contract locally.

## Prerequisites

- Rust toolchain installed
- Stellar CLI installed (`cargo install --locked stellar-cli@23.0.0`)
- WASM target installed (`rustup target add wasm32v1-none`)

## Quick Start

### 1. Setup Development Environment

Run the setup command to create test accounts, build the contract, and deploy it:

```bash
./run_local.sh setup
```

This will:
- Generate admin, test user, and contributor accounts
- Build and optimize the contract
- Deploy the contract to testnet
- Display all account addresses

### 2. Test the Contract

Run the full test suite to verify everything works:

```bash
./run_local.sh test
```

This will:
- Create a test campaign
- Get campaign data
- Contribute to the campaign
- Verify the updated campaign data

## Available Commands

### Build and Deploy

```bash
# Build and optimize the contract
./run_local.sh build

# Deploy the contract to testnet
./run_local.sh deploy
```

### Campaign Management

```bash
# Create a new campaign
./run_local.sh create-campaign <creator_address> <goal_stroops> <min_donation_stroops>

# Get campaign data
./run_local.sh get-campaign <campaign_address>

# Contribute to a campaign
./run_local.sh contribute <contributor_address> <campaign_address> <amount_stroops>

# Withdraw funds (creator only, when goal is reached)
./run_local.sh withdraw <creator_address>

# Refund contribution (when campaign fails)
./run_local.sh refund <contributor_address> <campaign_address>
```

## Examples

### Create a Campaign

```bash
# Create a campaign with 10 XLM goal and 1 XLM minimum donation
./run_local.sh create-campaign GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426 100000000 10000000
```

### Contribute to Campaign

```bash
# Contribute 2 XLM to a campaign
./run_local.sh contribute GCPPF35K2MDJT77HORBCVS34JIIZNRHYAVTQHJA6I6QPIGDH2XAD6SJ2 GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426 20000000
```

### Check Campaign Status

```bash
# Get current campaign data
./run_local.sh get-campaign GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426
```

## Contract Information

- **Contract ID**: `CCNBIWS656R5CR2SJTQMIAMKPDSJS5V4QXLPMC6XIYJQ3GNVJMUHXZW4`
- **Network**: Testnet
- **Token**: Native XLM (`CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`)

## Account Addresses

After running setup, you'll have these test accounts:

- **Admin**: `GDRDSX2ZOPTRCVWPBA55TXQVNRWM6RNLTLZ5YGVIJ5UXGCDPWXH4KQUL`
- **Test User**: `GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426`
- **Contributor**: `GCPPF35K2MDJT77HORBCVS34JIIZNRHYAVTQHJA6I6QPIGDH2XAD6SJ2`

## XLM to Stroops Conversion

| XLM | Stroops | Description |
|-----|---------|-------------|
| 1 XLM | 10,000,000 | 1 XLM = 10 million stroops |
| 5 XLM | 50,000,000 | 5 XLM in stroops |
| 10 XLM | 100,000,000 | 10 XLM in stroops |
| 100 XLM | 1,000,000,000 | 100 XLM in stroops |

## Troubleshooting

### Local Network Issues

If you encounter issues with the local network, the script uses testnet by default, which is more reliable for testing.

### Build Errors

If you get build errors, make sure you have:
- Rust 1.85+ installed
- WASM target installed: `rustup target add wasm32v1-none`
- Stellar CLI installed: `cargo install --locked stellar-cli@23.0.0`

### Permission Errors

Make sure the script is executable:
```bash
chmod +x run_local.sh
```

## Contract Functions

The contract supports the following functions:

1. **`__constructor`** - Initialize contract with admin and token
2. **`create_campaign`** - Create a new campaign
3. **`get_campaign`** - Get campaign data
4. **`contribute`** - Contribute to a campaign
5. **`withdraw`** - Withdraw funds (creator only, when goal reached)
6. **`refund`** - Refund contribution (when campaign fails)

## Next Steps

Once you're comfortable with the local development setup, you can:

1. Explore the contract source code in `contracts/baf-crowdfunding-contract/src/`
2. Add new features or modify existing functionality
3. Write comprehensive tests
4. Deploy to mainnet (after thorough testing and auditing) 