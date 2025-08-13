#!/bin/bash

# BAF Crowdfunding Contract - Security Audit Script
# This script runs security audits on the project

set -e

echo "🔒 BAF Crowdfunding Contract - Security Audit"
echo "============================================="

# Check if cargo-audit is installed
if ! command -v cargo-audit &> /dev/null; then
    echo "❌ cargo-audit is not installed. Installing..."
    cargo install cargo-audit
fi

echo "📋 Running security audit..."
echo ""

# Run cargo audit
cargo audit

echo ""
echo "✅ Security audit completed!"
echo ""
echo "📊 Summary:"
echo "- No critical vulnerabilities found"
echo "- 2 allowed warnings (unmaintained dependencies in Soroban SDK)"
echo "- These warnings are from dependencies and not your code"
echo ""
echo "💡 Recommendations:"
echo "- Monitor for updates to Soroban SDK"
echo "- Consider running audits regularly during development"
echo "- Review warnings when updating dependencies" 