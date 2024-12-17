# DAFI Deployment Guide

## Overview
This guide outlines the steps to deploy the DAFI platform on the Internet Computer (IC) network.

## Prerequisites

1. **Development Environment**
   - Node.js (v16 or higher)
   - DFX CLI (latest version)
   - Git
   - VS Code or preferred IDE

2. **Required Accounts**
   - Internet Computer account
   - Cycles wallet
   - GitHub account (for CI/CD)

## Local Development Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-org/dafi-web3.git
   cd dafi-web3
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Local Development**
   ```bash
   # Start local IC replica
   dfx start --background

   # Deploy canisters
   dfx deploy

   # Start Next.js development server
   npm run dev
   ```

## Smart Contract Deployment

1. **Prepare Canisters**
   ```bash
   # Build canisters
   dfx build

   # Check canister status
   dfx canister status asset
   dfx canister status investment
   dfx canister status return
   ```

2. **Deploy to IC Network**
   ```bash
   # Deploy to mainnet
   dfx deploy --network ic

   # Verify deployment
   dfx canister --network ic status asset
   ```

3. **Update Environment Variables**
   ```bash
   NEXT_PUBLIC_IC_HOST=https://ic0.app
   NEXT_PUBLIC_ASSET_CANISTER_ID=<asset-canister-id>
   NEXT_PUBLIC_INVESTMENT_CANISTER_ID=<investment-canister-id>
   NEXT_PUBLIC_RETURN_CANISTER_ID=<return-canister-id>
   ```

## Frontend Deployment

1. **Build Frontend**
   ```bash
   # Build Next.js application
   npm run build

   # Test production build
   npm run start
   ```

2. **Deploy to IC**
   ```bash
   # Deploy frontend assets
   dfx deploy --network ic frontend
   ```

## Database Setup

1. **MongoDB Configuration**
   ```bash
   # Set MongoDB connection string
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/dafi
   ```

2. **Initialize Database**
   ```bash
   # Run database migrations
   npm run db:migrate

   # Seed initial data
   npm run db:seed
   ```

## Security Configuration

1. **Configure Authentication**
   ```bash
   # Generate JWT secret
   JWT_SECRET=<your-secure-secret>

   # Set token expiration
   JWT_EXPIRATION=24h
   ```

2. **Setup Rate Limiting**
   ```bash
   # Configure Redis for rate limiting
   REDIS_URL=redis://<username>:<password>@<host>:<port>
   ```

## Monitoring Setup

1. **Configure Logging**
   ```bash
   # Setup logging service
   LOGGING_SERVICE=<service-url>
   LOG_LEVEL=info
   ```

2. **Setup Monitoring**
   ```bash
   # Configure monitoring service
   MONITORING_SERVICE=<service-url>
   ALERT_WEBHOOK=<webhook-url>
   ```

## CI/CD Pipeline

1. **GitHub Actions Setup**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Deploy to IC
           run: |
             dfx deploy --network ic
   ```

2. **Environment Secrets**
   - Add required secrets to GitHub repository
   - Configure deployment credentials

## Post-Deployment Verification

1. **Verify Smart Contracts**
   ```bash
   # Check canister status
   dfx canister --network ic status asset
   dfx canister --network ic status investment
   dfx canister --network ic status return
   ```

2. **Test API Endpoints**
   ```bash
   # Test user registration
   curl -X POST https://api.dafi.network/api/users/farmer

   # Test asset creation
   curl -X POST https://api.dafi.network/api/assets
   ```

3. **Monitor Logs**
   - Check application logs
   - Monitor error rates
   - Track performance metrics

## Troubleshooting

### Common Issues

1. **Canister Deployment Failures**
   ```bash
   # Check canister logs
   dfx canister --network ic logs <canister-id>

   # Verify cycles balance
   dfx wallet --network ic balance
   ```

2. **Frontend Issues**
   ```bash
   # Clear build cache
   rm -rf .next
   npm run build

   # Check for JavaScript errors
   npm run lint
   ```

3. **Database Connection Issues**
   ```bash
   # Test database connection
   npm run db:test

   # Check connection string
   echo $MONGODB_URI
   ```

## Maintenance

### Regular Tasks

1. **Update Dependencies**
   ```bash
   # Check for updates
   npm outdated

   # Update packages
   npm update
   ```

2. **Backup Data**
   ```bash
   # Backup database
   npm run db:backup

   # Export canister state
   dfx canister --network ic call asset exportState
   ```

3. **Monitor Resources**
   ```bash
   # Check cycles balance
   dfx wallet --network ic balance

   # Monitor canister memory
   dfx canister --network ic status asset
   ```

## Support

For support and questions:
- GitHub Issues: [DAFI Issues](https://github.com/your-org/dafi-web3/issues)
- Documentation: [DAFI Docs](https://docs.dafi.network)
- Community: [DAFI Discord](https://discord.gg/dafi)
