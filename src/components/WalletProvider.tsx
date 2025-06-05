import React, { ReactNode } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.reown.com
const projectId = 'f43eace0bc0c0b77eb139b7ba34b2b42';

// 2. Create a metadata object - optional
const metadata = {
  name: 'Bernoullia',
  description: 'AppKit Example',
  url: 'http://localhost:5173',
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

// 3. Set the networks
const networks = [mainnet, arbitrum];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 5. Create modal (guard against double init)
let appKitInitialized = false;
if (!appKitInitialized) {
  createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata,
    features: {
      analytics: true,
    },
  });
  appKitInitialized = true;
}

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={networks}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}