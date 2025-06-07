import React, { useState, useRef, useEffect } from 'react';
// Solana
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// EVM (Base)
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Simple wallet icon for demo (replace with actual icons as needed)
const WALLET_ICONS = {
  solana: '🪙', // Replace with actual Solana icon
  evm: '🦊',    // Replace with actual EVM icon
};

export const WalletConnectButtons: React.FC = () => {
  const { publicKey } = useWallet();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<'solana' | 'evm'>('solana');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      <button
        style={{ fontSize: 28, background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Select Wallet"
      >
        {selected === 'solana' ? WALLET_ICONS.solana : WALLET_ICONS.evm}
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          top: '110%',
          left: 0,
          background: '#181c24',
          border: '1px solid #333',
          borderRadius: 8,
          zIndex: 1000,
          minWidth: 220,
          padding: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <div style={{ marginBottom: 12 }}>
            <button
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: selected === 'solana' ? '#222' : 'none', border: 'none', color: '#fff', cursor: 'pointer', width: '100%', padding: 8, borderRadius: 4, fontSize: 16 }}
              onClick={() => setSelected('solana')}
            >
              {WALLET_ICONS.solana} Solana
            </button>
            <button
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: selected === 'evm' ? '#222' : 'none', border: 'none', color: '#fff', cursor: 'pointer', width: '100%', padding: 8, borderRadius: 4, fontSize: 16 }}
              onClick={() => setSelected('evm')}
            >
              {WALLET_ICONS.evm} EVM
            </button>
          </div>
          <div>
            {selected === 'solana' ? (
              <div style={{ width: '100%' }}>
                {/* Only render WalletMultiButton here, never as a page */}
                <WalletMultiButton style={{ width: '100%' }} />
              </div>
            ) : (
              <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
            )}
          </div>
          {selected === 'solana' && publicKey && (
            <div style={{ fontSize: 12, marginTop: 4, color: '#aaa' }}>
              Solana: {publicKey.toBase58()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
