# BAF Crowdfunding Frontend

A modern React frontend for testing the BAF Crowdfunding Contract on Stellar's Soroban network.

## Features

- 🎨 Modern, responsive UI with gradient backgrounds
- 🔗 Real-time contract interaction
- 📊 Campaign progress visualization
- 💰 XLM/stroops conversion
- 🚀 Easy campaign creation and contribution
- 📱 Mobile-friendly design

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Stellar wallet (Freighter recommended for testing)

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

## Usage

### Connect Wallet

1. Click "Connect Wallet" to simulate wallet connection
2. The app will use a demo wallet for testing purposes
3. In production, integrate with Freighter or other Stellar wallets

### Create Campaign

1. Fill in the campaign details:
   - **Creator Address**: The Stellar address of the campaign creator
   - **Goal (XLM)**: The fundraising goal in XLM
   - **Minimum Donation (XLM)**: Minimum contribution amount
2. Click "Create Campaign"

### Contribute to Campaign

1. Select a campaign from the dropdown
2. Enter the contribution amount in XLM
3. Click "Contribute"

### View Campaigns

- See all active campaigns with progress bars
- View real-time fundraising progress
- Check if goals have been reached

## Contract Integration

The frontend integrates with the deployed contract at:
- **Contract ID**: `CCNBIWS656R5CR2SJTQMIAMKPDSJS5V4QXLPMC6XIYJQ3GNVJMUHXZW4`
- **Network**: Testnet
- **RPC URL**: `https://soroban-testnet.stellar.org`

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Project Structure

```
frontend/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── App.js              # Main React component
│   ├── index.js            # React entry point
│   ├── services/
│   │   └── contractService.js  # Contract interaction service
│   └── README.md           # This file
├── package.json            # Dependencies and scripts
└── README.md              # Project documentation
```

## Styling

The app uses styled-components for styling with:
- Modern gradient backgrounds
- Glassmorphism effects
- Responsive grid layouts
- Smooth animations and transitions

## Development

### Adding New Features

1. **New Contract Functions**: Add methods to `contractService.js`
2. **UI Components**: Create new styled components in `App.js`
3. **State Management**: Use React hooks for local state

### Testing

The app currently uses simulated contract calls for demo purposes. To integrate with real contracts:

1. Replace simulation calls with actual transaction signing
2. Integrate with Freighter wallet for transaction signing
3. Add proper error handling for network issues

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure you're using the correct RPC URL
2. **Contract Not Found**: Verify the contract ID is correct
3. **Network Issues**: Check your internet connection and RPC endpoint

### Build Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes as part of the BAF workshop.

## Support

For issues related to:
- **Frontend**: Check the React console for errors
- **Contract**: Use the `run_local.sh` script to test contract functions
- **Network**: Verify testnet connectivity 