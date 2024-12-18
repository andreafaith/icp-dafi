#!/bin/bash

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "dfx is not installed. Please install it first."
    exit 1
fi

# Function to check if a command succeeded
check_command() {
    if [ $? -ne 0 ]; then
        echo "Error: $1"
        exit 1
    fi
}

# Setup identity and wallet
echo "Setting up identity and wallet..."

# Use existing deploy identity
echo "Using deploy identity..."
dfx identity use deploy-identity
check_command "Failed to use identity"

# Get principal
PRINCIPAL=$(dfx identity get-principal)
echo "Using principal: $PRINCIPAL"

# Check ICP balance
echo "Checking ICP balance..."
dfx ledger --network ic balance
check_command "Failed to check ICP balance"

# Check if wallet exists
if ! dfx identity get-wallet >/dev/null 2>&1; then
    echo "Creating new cycles wallet..."
    echo "Make sure you have at least 1.005 ICP in your account!"
    echo "Your principal ID is: $PRINCIPAL"
    read -p "Press enter to continue or Ctrl+C to cancel..."
    
    dfx ledger create-canister $PRINCIPAL --network ic --amount 1.005
    check_command "Failed to create cycles wallet"
fi

# Get wallet ID
WALLET_ID=$(dfx identity get-wallet)
echo "Using wallet: $WALLET_ID"

# Check wallet balance
echo "Checking wallet balance..."
dfx wallet --network ic balance
check_command "Failed to check wallet balance"

# Build the project
echo "Building project..."
dfx build --network ic
check_command "Failed to build project"

# Deploy KYC canister
echo "Deploying KYC canister..."
dfx deploy dafi_kyc --network ic
check_command "Failed to deploy KYC canister"
KYC_CANISTER_ID=$(dfx canister --network ic id dafi_kyc)
echo "KYC Canister ID: $KYC_CANISTER_ID"

# Deploy Asset canister
echo "Deploying Asset canister..."
dfx deploy dafi_asset --network ic
check_command "Failed to deploy Asset canister"
ASSET_CANISTER_ID=$(dfx canister --network ic id dafi_asset)
echo "Asset Canister ID: $ASSET_CANISTER_ID"

# Deploy Investment canister
echo "Deploying Investment canister..."
dfx deploy dafi_investment --network ic
check_command "Failed to deploy Investment canister"
INVESTMENT_CANISTER_ID=$(dfx canister --network ic id dafi_investment)
echo "Investment Canister ID: $INVESTMENT_CANISTER_ID"

# Deploy frontend
echo "Deploying frontend..."
dfx deploy dafi_frontend --network ic
check_command "Failed to deploy frontend"
FRONTEND_CANISTER_ID=$(dfx canister --network ic id dafi_frontend)
echo "Frontend Canister ID: $FRONTEND_CANISTER_ID"

# Create environment files
echo "Creating environment files..."

# Create .env.production for the frontend
cat > ./dafi-web3/.env.production << EOL
NEXT_PUBLIC_IC_HOST=https://ic0.app
NEXT_PUBLIC_KYC_CANISTER_ID=$KYC_CANISTER_ID
NEXT_PUBLIC_ASSET_CANISTER_ID=$ASSET_CANISTER_ID
NEXT_PUBLIC_INVESTMENT_CANISTER_ID=$INVESTMENT_CANISTER_ID
NEXT_PUBLIC_FRONTEND_CANISTER_ID=$FRONTEND_CANISTER_ID
# Using the official Internet Identity canister on mainnet
NEXT_PUBLIC_INTERNET_IDENTITY_URL=https://identity.ic0.app/#authorize
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=rdmx6-jaaaa-aaaaa-aaadq-cai
EOL

# Update canister IDs in the frontend constants
echo "Updating canister configuration..."
cat > ./dafi-web3/src/constants/canisters.ts << EOL
// Generated canister IDs from deployment
export const FRONTEND_CANISTER_ID = '$FRONTEND_CANISTER_ID';
export const KYC_CANISTER_ID = '$KYC_CANISTER_ID';
export const ASSET_CANISTER_ID = '$ASSET_CANISTER_ID';
export const INVESTMENT_CANISTER_ID = '$INVESTMENT_CANISTER_ID';

// Official Internet Identity canister ID on mainnet
export const INTERNET_IDENTITY_CANISTER_ID = 'rdmx6-jaaaa-aaaaa-aaadq-cai';

export const getInternetIdentityUrl = () => {
  return 'https://identity.ic0.app/#authorize';
};
EOL

echo "Deployment complete! Your canisters are now live on the IC mainnet."
echo ""
echo "Your dApp is now accessible at:"
echo "https://$FRONTEND_CANISTER_ID.ic0.app"
echo ""
echo "Canister IDs:"
echo "Frontend: $FRONTEND_CANISTER_ID"
echo "KYC: $KYC_CANISTER_ID"
echo "Asset: $ASSET_CANISTER_ID"
echo "Investment: $INVESTMENT_CANISTER_ID"
echo "Internet Identity: rdmx6-jaaaa-aaaaa-aaadq-cai (official mainnet canister)"
echo "Wallet: $WALLET_ID"
