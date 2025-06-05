import React, { ReactNode, useMemo } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
// Solana imports
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

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
  // Solana config
  const endpoint = useMemo(() => 'https://api.mainnet-beta.solana.com', []);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider>{children}</RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}