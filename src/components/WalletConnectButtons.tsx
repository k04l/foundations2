import React from 'react';
// Solana
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// EVM (Base)
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const WalletConnectButtons: React.FC = () => {
  const { publicKey } = useWallet();
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {/* Solana Wallet Connect */}
      <div>
        <WalletMultiButton />
        {publicKey && (
          <div style={{ fontSize: 12, marginTop: 4 }}>
            Solana: {publicKey.toBase58()}
          </div>
        )}
      </div>
      {/* EVM (Base) Wallet Connect */}
      <div>
        <ConnectButton />
      </div>
    </div>
  );
};
