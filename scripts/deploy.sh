#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to print status
print_status() {
    echo -e "${YELLOW}===> $1${NC}"
}

# Function to check command success
check_success() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Success${NC}"
    else
        echo -e "${RED}✗ Failed${NC}"
        exit 1
    fi
}

# Environment setup
print_status "Setting up environment..."
if [ "$1" == "production" ]; then
    export DFX_NETWORK=ic
    export NODE_ENV=production
else
    export DFX_NETWORK=local
    export NODE_ENV=development
fi

# Install dependencies
print_status "Installing dependencies..."
npm install
check_success

# Build frontend
print_status "Building frontend..."
npm run build
check_success

# Start local replica if in development
if [ "$DFX_NETWORK" == "local" ]; then
    print_status "Starting local replica..."
    dfx start --background
    check_success
fi

# Deploy canisters
print_status "Deploying canisters..."

# Deploy backend canisters
print_status "Deploying backend canisters..."
dfx deploy dafi_backend
check_success

dfx deploy dafi_assets
check_success

dfx deploy dafi_ledger
check_success

dfx deploy dafi_oracle
check_success

# Deploy frontend canister
print_status "Deploying frontend canister..."
dfx deploy dafi_frontend
check_success

# Generate canister IDs
print_status "Generating canister declarations..."
dfx generate
check_success

# Set up environment variables
print_status "Setting up environment variables..."
BACKEND_CANISTER_ID=$(dfx canister id dafi_backend)
ASSETS_CANISTER_ID=$(dfx canister id dafi_assets)
LEDGER_CANISTER_ID=$(dfx canister id dafi_ledger)
ORACLE_CANISTER_ID=$(dfx canister id dafi_oracle)
FRONTEND_CANISTER_ID=$(dfx canister id dafi_frontend)

# Create or update .env files
if [ "$DFX_NETWORK" == "ic" ]; then
    cat > .env.production << EOF
NEXT_PUBLIC_DFX_NETWORK=ic
NEXT_PUBLIC_BACKEND_CANISTER_ID=$BACKEND_CANISTER_ID
NEXT_PUBLIC_ASSETS_CANISTER_ID=$ASSETS_CANISTER_ID
NEXT_PUBLIC_LEDGER_CANISTER_ID=$LEDGER_CANISTER_ID
NEXT_PUBLIC_ORACLE_CANISTER_ID=$ORACLE_CANISTER_ID
NEXT_PUBLIC_FRONTEND_CANISTER_ID=$FRONTEND_CANISTER_ID
EOF
else
    cat > .env.development << EOF
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_BACKEND_CANISTER_ID=$BACKEND_CANISTER_ID
NEXT_PUBLIC_ASSETS_CANISTER_ID=$ASSETS_CANISTER_ID
NEXT_PUBLIC_LEDGER_CANISTER_ID=$LEDGER_CANISTER_ID
NEXT_PUBLIC_ORACLE_CANISTER_ID=$ORACLE_CANISTER_ID
NEXT_PUBLIC_FRONTEND_CANISTER_ID=$FRONTEND_CANISTER_ID
EOF
fi

# Performance optimizations
print_status "Applying performance optimizations..."

# Configure asset canister memory
dfx canister update-settings dafi_assets --memory-allocation 2G
check_success

# Configure compute allocation
dfx canister update-settings dafi_backend --compute-allocation 25
check_success

# Configure frontend caching
dfx canister update-settings dafi_frontend --controllers "(principal \"$FRONTEND_CANISTER_ID\")"
check_success

# Security configurations
print_status "Applying security configurations..."

# Set controllers
dfx canister update-settings dafi_backend --controllers "(principal \"$BACKEND_CANISTER_ID\")"
check_success

# Configure access controls
dfx canister call dafi_backend setupAccessControl
check_success

# Print deployment information
print_status "Deployment complete! Canister IDs:"
echo "Backend: $BACKEND_CANISTER_ID"
echo "Assets: $ASSETS_CANISTER_ID"
echo "Ledger: $LEDGER_CANISTER_ID"
echo "Oracle: $ORACLE_CANISTER_ID"
echo "Frontend: $FRONTEND_CANISTER_ID"

if [ "$DFX_NETWORK" == "ic" ]; then
    echo -e "\n${GREEN}Your application is now live on the Internet Computer!${NC}"
    echo "Frontend URL: https://$FRONTEND_CANISTER_ID.ic0.app"
else
    echo -e "\n${GREEN}Your application is running locally!${NC}"
    echo "Frontend URL: http://127.0.0.1:8000?canisterId=$FRONTEND_CANISTER_ID"
fi
