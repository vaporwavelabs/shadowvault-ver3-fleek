
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { mainnet, polygon, arbitrum, base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const WALLET_CONNECT_PROJECT_ID = '3fcc6b4468bd402da36573c66299f061';

const getAppMetadata = () => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shadowvault.io';
  return {
    name: 'Shadow Vault',
    description: 'Protocol-Level Administrative Enclave',
    url: origin,
    icons: ['https://cryptologos.cc/logos/ethereum-eth-logo.png']
  };
};

const config = createConfig({
  chains: [mainnet, polygon, arbitrum, base],
  connectors: [
    injected(),
    walletConnect({ 
      projectId: WALLET_CONNECT_PROJECT_ID,
      showQrModal: true,
      metadata: getAppMetadata()
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <App />
        </HashRouter>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
