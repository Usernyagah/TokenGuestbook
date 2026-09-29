"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { request, disconnect } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';

interface WalletContextType {
  address: string | null;
  isSignedIn: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  signOut: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const NETWORK = new StacksTestnet();

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing connection on mount
  useEffect(() => {
    const storedAddress = localStorage.getItem('stacks_address');
    if (storedAddress) {
      setAddress(storedAddress);
      setIsSignedIn(true);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await request(
        {
          forceWalletSelect: true,
        },
        'getAddresses',
        {
          network: 'testnet',
        }
      ) as any;
      
      if (response.addresses && response.addresses.length > 0) {
        const stxAddress = response.addresses.find((addr: any) => addr.symbol === 'STX' || !addr.symbol);
        if (stxAddress) {
          setAddress(stxAddress.address);
          setIsSignedIn(true);
          localStorage.setItem('stacks_address', stxAddress.address);
        }
      }
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    disconnect();
    setAddress(null);
    setIsSignedIn(false);
    localStorage.removeItem('stacks_address');
  }, []);

  const disconnectWallet = useCallback(() => {
    disconnect();
    setAddress(null);
    setIsSignedIn(false);
    localStorage.removeItem('stacks_address');
  }, []);

  return (
    <WalletContext.Provider value={{ address, isSignedIn, isLoading, connectWallet, disconnect: disconnectWallet, signOut }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
