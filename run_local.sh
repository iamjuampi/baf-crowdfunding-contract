#!/bin/bash

# BAF Crowdfunding Contract - Local Development Script
# This script helps you run and test the crowdfunding contract

set -e

CONTRACT_ID="CCNBIWS656R5CR2SJTQMIAMKPDSJS5V4QXLPMC6XIYJQ3GNVJMUHXZW4"
NETWORK="testnet"

echo "🚀 BAF Crowdfunding Contract - Local Development"
echo "================================================"

case "$1" in
    "build")
        echo "📦 Building contract..."
        cd contracts/baf-crowdfunding-contract
        stellar contract build
        stellar contract optimize --wasm ../../target/wasm32v1-none/release/baf_crowdfunding_contract.wasm
        echo "✅ Build complete!"
        ;;
    
    "deploy")
        echo "🚀 Deploying contract to $NETWORK..."
        stellar contract deploy \
            --wasm target/wasm32v1-none/release/baf_crowdfunding_contract.optimized.wasm \
            --source testnet-admin \
            --network $NETWORK \
            -- \
            --admin GDRDSX2ZOPTRCVWPBA55TXQVNRWM6RNLTLZ5YGVIJ5UXGCDPWXH4KQUL \
            --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
        ;;
    
    "create-campaign")
        if [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
            echo "❌ Usage: $0 create-campaign <creator_address> <goal_stroops> <min_donation_stroops>"
            echo "   Example: $0 create-campaign GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426 100000000 10000000"
            exit 1
        fi
        echo "📝 Creating campaign..."
        stellar contract invoke \
            --id $CONTRACT_ID \
            --source testnet-admin \
            --network $NETWORK \
            -- \
            create_campaign \
            --creator $2 \
            --goal $3 \
            --min_donation $4
        ;;
    
    "get-campaign")
        if [ -z "$2" ]; then
            echo "❌ Usage: $0 get-campaign <campaign_address>"
            echo "   Example: $0 get-campaign GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426"
            exit 1
        fi
        echo "📊 Getting campaign data..."
        stellar contract invoke \
            --id $CONTRACT_ID \
            --source testnet-admin \
            --network $NETWORK \
            -- \
            get_campaign \
            --campaign_address $2
        ;;
    
    "contribute")
        if [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
            echo "❌ Usage: $0 contribute <contributor_address> <campaign_address> <amount_stroops>"
            echo "   Example: $0 contribute GCPPF35K2MDJT77HORBCVS34JIIZNRHYAVTQHJA6I6QPIGDH2XAD6SJ2 GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426 20000000"
            exit 1
        fi
        echo "💰 Contributing to campaign..."
        stellar contract invoke \
            --id $CONTRACT_ID \
            --source contributor \
            --network $NETWORK \
            -- \
            contribute \
            --contributor $2 \
            --campaign_address $3 \
            --amount $4
        ;;
    
    "withdraw")
        if [ -z "$2" ]; then
            echo "❌ Usage: $0 withdraw <creator_address>"
            echo "   Example: $0 withdraw GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426"
            exit 1
        fi
        echo "💸 Withdrawing funds..."
        stellar contract invoke \
            --id $CONTRACT_ID \
            --source test-user \
            --network $NETWORK \
            -- \
            withdraw \
            --creator $2
        ;;
    
    "refund")
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "❌ Usage: $0 refund <contributor_address> <campaign_address>"
            echo "   Example: $0 refund GCPPF35K2MDJT77HORBCVS34JIIZNRHYAVTQHJA6I6QPIGDH2XAD6SJ2 GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426"
            exit 1
        fi
        echo "🔄 Processing refund..."
        stellar contract invoke \
            --id $CONTRACT_ID \
            --source contributor \
            --network $NETWORK \
            -- \
            refund \
            --contributor $2 \
            --campaign_address $3
        ;;
    
    "test")
        echo "🧪 Running full test suite..."
        echo "1. Creating test campaign..."
        ./run_local.sh create-campaign GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426 100000000 10000000
        
        echo "2. Getting campaign data..."
        ./run_local.sh get-campaign GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426
        
        echo "3. Contributing to campaign..."
        ./run_local.sh contribute GCPPF35K2MDJT77HORBCVS34JIIZNRHYAVTQHJA6I6QPIGDH2XAD6SJ2 GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426 20000000
        
        echo "4. Getting updated campaign data..."
        ./run_local.sh get-campaign GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426
        
        echo "✅ Test suite completed!"
        ;;
    
    "setup")
        echo "🔧 Setting up development environment..."
        echo "1. Generating admin account..."
        stellar keys generate --global testnet-admin --network testnet --fund
        
        echo "2. Generating test user account..."
        stellar keys generate --global test-user --network testnet --fund
        
        echo "3. Generating contributor account..."
        stellar keys generate --global contributor --network testnet --fund
        
        echo "4. Building contract..."
        ./run_local.sh build
        
        echo "5. Deploying contract..."
        ./run_local.sh deploy
        
        echo "✅ Setup complete!"
        echo ""
        echo "📋 Account addresses:"
        echo "Admin: $(stellar keys address testnet-admin)"
        echo "Test User: $(stellar keys address test-user)"
        echo "Contributor: $(stellar keys address contributor)"
        ;;
    
    *)
        echo "Usage: $0 {build|deploy|create-campaign|get-campaign|contribute|withdraw|refund|test|setup}"
        echo ""
        echo "Commands:"
        echo "  build           - Build and optimize the contract"
        echo "  deploy          - Deploy the contract to testnet"
        echo "  create-campaign - Create a new campaign"
        echo "  get-campaign    - Get campaign data"
        echo "  contribute      - Contribute to a campaign"
        echo "  withdraw        - Withdraw funds from a successful campaign"
        echo "  refund          - Refund contribution from failed campaign"
        echo "  test            - Run full test suite"
        echo "  setup           - Complete setup (accounts + build + deploy)"
        echo ""
        echo "Examples:"
        echo "  $0 setup"
        echo "  $0 create-campaign GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426 100000000 10000000"
        echo "  $0 get-campaign GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426"
        echo "  $0 contribute GCPPF35K2MDJT77HORBCVS34JIIZNRHYAVTQHJA6I6QPIGDH2XAD6SJ2 GDJTRJM4HWG2D4HRFJDQR3MP5LHM7EDBKW6WIYP4TR6N6GL7KBBFV426 20000000"
        exit 1
        ;;
esac 