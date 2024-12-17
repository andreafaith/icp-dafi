#!/bin/bash

# Create directories if they don't exist
mkdir -p public/images/features
mkdir -p public/images/wallets

# Download placeholder images (using Unsplash for demo purposes)
curl -L "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e" -o public/images/features/tokenization.jpg
curl -L "https://images.unsplash.com/photo-1639762681485-074b7f938ba0" -o public/images/features/smart-contracts.jpg
curl -L "https://images.unsplash.com/photo-1542744173-8e7e53415bb0" -o public/images/features/monitoring.jpg
curl -L "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6" -o public/images/features/returns.jpg

# Download wallet icons
curl -L "https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg" -o public/images/wallets/metamask-logo.svg
curl -L "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg" -o public/images/wallets/walletconnect-logo.svg

echo "All images downloaded successfully!"
