import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StarknetConfig, jsonRpcProvider, voyager, argent, braavos } from '@starknet-react/core';
import { sepolia } from '@starknet-react/chains';
import App from './App.tsx';
import './index.css';
import './i18n';

const RPC_URL = import.meta.env.VITE_STARKNET_RPC_URL || 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/A_aQEk8ItXSiyZveFp_6y';

const sepoliaFixed = {
  ...sepolia,
  rpcUrls: {
    ...sepolia.rpcUrls,
    default: { http: [RPC_URL] },
    public: { http: [RPC_URL] },
  },
};

const chains = [sepoliaFixed];
const connectors = [argent(), braavos()];

const provider = jsonRpcProvider({
  rpc: () => ({ nodeUrl: RPC_URL }),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StarknetConfig chains={chains} provider={provider} connectors={connectors} explorer={voyager}>
      <App />
    </StarknetConfig>
  </StrictMode>,
);
