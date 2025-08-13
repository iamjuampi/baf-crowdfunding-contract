#!/bin/bash

# BAF Crowdfunding Contract - Development Workflow
# This script provides a comprehensive development workflow

set -e

echo "🚀 BAF Crowdfunding Contract - Development Workflow"
echo "=================================================="

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
if [ ! -f "Cargo.toml" ]; then
    print_error "Cargo.toml not found. Please run this script from the project root."
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install cargo-audit if not present
install_cargo_audit() {
    if ! command_exists cargo-audit; then
        print_status "Installing cargo-audit..."
        cargo install cargo-audit
        print_success "cargo-audit installed successfully"
    fi
}

# Function to install cargo-tarpaulin if not present
install_cargo_tarpaulin() {
    if ! command_exists cargo-tarpaulin; then
        print_status "Installing cargo-tarpaulin..."
        cargo install cargo-tarpaulin
        print_success "cargo-tarpaulin installed successfully"
    fi
}

# Function to run security audit
run_security_audit() {
    print_status "Running security audit..."
    install_cargo_audit
    cargo audit
    print_success "Security audit completed"
}

# Function to run code coverage
run_code_coverage() {
    print_status "Running code coverage analysis..."
    install_cargo_tarpaulin
    cargo tarpaulin --out Html --output-dir coverage
    print_success "Code coverage report generated in coverage/ directory"
}

# Function to build contract
build_contract() {
    print_status "Building contract..."
    cd contracts/baf-crowdfunding-contract
    cargo build --target wasm32v1-none --release
    print_success "Contract built successfully"
    
    print_status "Optimizing contract..."
    stellar contract optimize --wasm ../../target/wasm32v1-none/release/baf_crowdfunding_contract.wasm
    print_success "Contract optimized successfully"
    
    cd ../..
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    cargo test
    print_success "Tests completed"
}

# Function to format code
format_code() {
    print_status "Formatting code..."
    cargo fmt --all
    print_success "Code formatted"
}

# Function to check code style
check_code_style() {
    print_status "Checking code style..."
    cargo clippy -- -D warnings
    print_success "Code style check completed"
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend..."
    if [ -d "frontend" ]; then
        cd frontend
        if [ ! -d "node_modules" ]; then
            print_status "Installing frontend dependencies..."
            npm install
        fi
        print_status "Starting development server..."
        npm start &
        cd ..
        print_success "Frontend started at http://localhost:3000"
    else
        print_warning "Frontend directory not found"
    fi
}

# Function to deploy contract
deploy_contract() {
    print_status "Deploying contract to testnet..."
    if [ -f "target/wasm32v1-none/release/baf_crowdfunding_contract.optimized.wasm" ]; then
        stellar contract deploy \
            --wasm target/wasm32v1-none/release/baf_crowdfunding_contract.optimized.wasm \
            --source testnet-admin \
            --network testnet \
            -- \
            --admin GDRDSX2ZOPTRCVWPBA55TXQVNRWM6RNLTLZ5YGVIJ5UXGCDPWXH4KQUL \
            --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
        print_success "Contract deployed successfully"
    else
        print_error "Optimized contract not found. Run 'build' first."
    fi
}

# Main workflow function
full_workflow() {
    print_status "Starting full development workflow..."
    
    format_code
    check_code_style
    run_tests
    run_security_audit
    build_contract
    run_code_coverage
    
    print_success "Full workflow completed successfully!"
    echo ""
    echo "📊 Summary:"
    echo "- Code formatted and style checked"
    echo "- Tests passed"
    echo "- Security audit completed"
    echo "- Contract built and optimized"
    echo "- Code coverage report generated"
    echo ""
    echo "🚀 Next steps:"
    echo "- Review coverage report in coverage/ directory"
    echo "- Deploy contract: ./dev_workflow.sh deploy"
    echo "- Start frontend: ./dev_workflow.sh frontend"
}

# Parse command line arguments
case "$1" in
    "build")
        build_contract
        ;;
    "test")
        run_tests
        ;;
    "audit")
        run_security_audit
        ;;
    "coverage")
        run_code_coverage
        ;;
    "format")
        format_code
        ;;
    "style")
        check_code_style
        ;;
    "frontend")
        start_frontend
        ;;
    "deploy")
        deploy_contract
        ;;
    "full")
        full_workflow
        ;;
    *)
        echo "Usage: $0 {build|test|audit|coverage|format|style|frontend|deploy|full}"
        echo ""
        echo "Commands:"
        echo "  build     - Build and optimize the contract"
        echo "  test      - Run tests"
        echo "  audit     - Run security audit"
        echo "  coverage  - Generate code coverage report"
        echo "  format    - Format code"
        echo "  style     - Check code style with clippy"
        echo "  frontend  - Start frontend development server"
        echo "  deploy    - Deploy contract to testnet"
        echo "  full      - Run complete development workflow"
        echo ""
        echo "Examples:"
        echo "  $0 full      # Run complete workflow"
        echo "  $0 build     # Build contract only"
        echo "  $0 frontend  # Start frontend only"
        exit 1
        ;;
esac 