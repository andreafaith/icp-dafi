# DAFI (Decentralized Agricultural Finance Initiative)

A Web3 platform revolutionizing agricultural financing through blockchain technology and DeFi on the Internet Computer Protocol.

## Features Overview

### Implemented Features

#### Core Platform Features
- Modern, responsive UI with Material-UI components
- Dark theme with custom color palette (#132A13)
- Secure authentication system
- Role-based access control (Farmer/Investor)
- Navigation system with proper routing

#### Farmer Features
- Farm profile creation and management
- Asset tokenization interface
- Farm details and metrics display
- Investment proposal submission
- Farm analytics dashboard

#### Investor Features
- Investment portfolio overview
- Farm project browsing and filtering
- Investment opportunity analysis
- Transaction history tracking
- Portfolio performance metrics

#### UI Components
- Hero Section with animated elements
- Team Section with member profiles
- Timeline Section for roadmap
- How It Works Section
- Problem Section highlighting agricultural challenges
- Tokenization Section explaining the process
- CTA Sections for user engagement
- Stats display for platform metrics
- Responsive navigation header
- Wallet connection integration

### Planned Features (To Be Implemented)

#### Smart Contract Integration
- Asset tokenization smart contracts
- Investment smart contracts
- Automated return distribution
- Escrow system for investments

#### Advanced Features
- Real-time IoT data integration
- AI-powered risk assessment
- Automated compliance checks
- Cross-border payment solutions
- Secondary market for tokens
- Yield farming opportunities

#### Additional Features
- Multi-language support
- Advanced analytics dashboard
- Mobile app version
- Notification system
- Document verification system

## Tech Stack

- Frontend: Next.js 14
- UI Framework: Material-UI (MUI)
- Styling: Emotion CSS-in-JS
- Blockchain: Internet Computer Protocol (ICP)
- State Management: React Context
- Authentication: Internet Identity
- Web3 Integration: ICP SDK

## Prerequisites

- Node.js 18+ and npm
- Internet Computer SDK (dfx)
- Internet Identity
- Visual Studio Code (recommended)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd dafi-web3
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Copy `.env.local.example` to `.env.local`
- Update the variables with your configuration

4. Start the ICP local network:
```bash
dfx start --clean
```

5. Deploy the canisters:
```bash
dfx deploy
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
dafi-web3/
├── src/
│   ├── pages/           # Next.js pages
│   │   ├── index.tsx    # Homepage
│   │   ├── learn-more/  # Learn More page
│   │   ├── get-started/ # Role selection
│   │   ├── farms/       # Farm management
│   │   ├── invest/      # Investment platform
│   │   └── ...
│   ├── components/      # Reusable components
│   │   ├── common/      # Shared components
│   │   ├── farmer/      # Farmer-specific components
│   │   └── investor/    # Investor-specific components
│   ├── contexts/        # React contexts
│   ├── declarations/    # ICP declarations
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Utility functions
├── public/              # Static files
└── ...config files
```

## Key Components

### Layout Components
- `Layout.tsx`: Main layout wrapper with navigation
- `Header.tsx`: Navigation header with authentication
- `Footer.tsx`: Site footer with links and info

### Feature Components
- `HeroSection.tsx`: Landing page hero section
- `TeamSection.tsx`: Team member display
- `Timeline.tsx`: Project roadmap
- `TokenizationSection.tsx`: Tokenization process
- `ProblemSection.tsx`: Agricultural challenges
- `Stats.tsx`: Platform statistics

### Authentication
- `AuthContext.tsx`: Authentication state management
- `Web3Context.tsx`: Web3 connection management
- `ProtectedRoute.tsx`: Route protection HOC

## Development Guidelines

1. **Code Style**
   - Use TypeScript for type safety
   - Follow React best practices
   - Use functional components with hooks
   - Implement proper error handling

2. **Component Structure**
   - Keep components focused and reusable
   - Use proper prop typing
   - Implement error boundaries
   - Add loading states

3. **State Management**
   - Use React Context for global state
   - Keep component state local when possible
   - Implement proper data fetching

4. **Testing**
   - Write unit tests for utilities
   - Add component tests
   - Implement E2E tests for critical flows

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Project Link: [https://github.com/your_username/dafi-web3](https://github.com/your_username/dafi-web3)
