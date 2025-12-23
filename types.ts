
export enum ChainId {
  ETHEREUM = 1,
  POLYGON = 137,
  ARBITRUM = 42161,
  BASE = 8453
}

export interface TokenBalance {
  symbol: string;
  name: string;
  amount: string;
  valueUsd: number;
  icon: string;
}

export interface Transaction {
  hash: string;
  type: 'send' | 'receive' | 'swap' | 'recovery';
  status: 'confirmed' | 'pending' | 'failed';
  amount: string;
  symbol: string;
  timestamp: number;
  address: string;
}

export interface RecoveryFactor {
  id: string;
  type: 'email' | 'biometric' | 'guardian' | 'nft';
  name: string;
  status: 'active' | 'pending' | 'not-set';
  description: string;
}

export interface UserSession {
  isAuthenticated: boolean;
  email?: string;
  address?: string;
  lastActive: number;
}
