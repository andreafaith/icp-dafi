#!/bin/bash

# Install dfx
echo "Installing dfx..."
DFX_VERSION=0.14.1
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Start dfx in the background
echo "Starting dfx..."
dfx start --background

# Wait for dfx to start
sleep 5

# Deploy Internet Identity canister
echo "Deploying Internet Identity canister..."
dfx deploy internet_identity

# Deploy other canisters
echo "Deploying other canisters..."
dfx deploy dafi_kyc
dfx deploy dafi_asset
dfx deploy dafi_investment
dfx deploy dafi_frontend

echo "Setup complete! Your local development environment is ready."
