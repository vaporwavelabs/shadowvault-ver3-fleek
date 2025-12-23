
import React from 'react';
import { 
  ShieldCheck, 
  ArrowUpRight, 
  History, 
  LayoutDashboard,
  Coins,
  Fingerprint,
  Mail,
  UserCheck,
  Image as ImageIcon,
  WalletCards,
  RefreshCcw
} from 'lucide-react';

export const CHAINS = [
  { id: 1, name: 'Ethereum', color: 'bg-blue-500' },
  { id: 137, name: 'Polygon', color: 'bg-purple-600' },
  { id: 42161, name: 'Arbitrum', color: 'bg-blue-400' },
  { id: 8453, name: 'Base', color: 'bg-blue-700' },
];

export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/wallets', label: 'Wallets', icon: <WalletCards size={20} /> },
  { path: '/assets', label: 'Assets', icon: <Coins size={20} /> },
  { path: '/swap', label: 'Swap', icon: <RefreshCcw size={20} /> },
  { path: '/send', label: 'Send', icon: <ArrowUpRight size={20} /> },
  { path: '/history', label: 'History', icon: <History size={20} /> },
  { path: '/recovery', label: 'Recovery', icon: <ShieldCheck size={20} /> },
];

export const MOCK_TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', amount: '1.24', valueUsd: 2845.20, icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { symbol: 'USDC', name: 'USD Coin', amount: '1,250.00', valueUsd: 1250.00, icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', amount: '0.045', valueUsd: 2205.00, icon: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png' },
  { symbol: 'LINK', name: 'Chainlink', amount: '125.0', valueUsd: 1875.00, icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png' },
];

export const MOCK_WALLETS = [
  { id: 'w1', name: 'Main Vault', address: '0x742d...44e', balance: '$8,245.20', chain: 'Ethereum', active: true },
  { id: 'w2', name: 'DeFi Shadow', address: '0x123a...bc9', balance: '$1,120.50', chain: 'Base', active: false },
  { id: 'w3', name: 'Legacy Factor', address: '0x987f...321', balance: '$45.00', chain: 'Polygon', active: false },
];

export const RECOVERY_FACTORS = [
  { id: '1', type: 'biometric', name: 'Primary Passkey', description: 'Device secure enclave (FaceID/TouchID)', status: 'active', icon: <Fingerprint size={20} /> },
  { id: '2', type: 'guardian', name: 'Social Guardian 1', description: 'On-chain trustee approval', status: 'active', icon: <UserCheck size={20} /> },
  { id: '3', type: 'guardian', name: 'Social Guardian 2', description: 'On-chain trustee approval', status: 'pending', icon: <UserCheck size={20} /> },
  { id: '4', type: 'nft', name: 'Shadow Key NFT', description: 'ERC-721 Gateway Proof', status: 'not-set', icon: <ImageIcon size={20} /> },
  { id: '5', type: 'email', name: 'ZK-Email Recovery', description: 'Encrypted email proof of ownership', status: 'active', icon: <Mail size={20} /> },
];
