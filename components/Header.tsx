"use client";

import { useState } from "react";

// Placeholder hooks - will be replaced with Scaffold Stacks hooks
const useWalletAddress = () => {
  const [address, setAddress] = useState<string | null>(null);
  return { address, setAddress };
};

const useConnectWallet = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    // Placeholder: Will use @stacks/connect for actual wallet connection
    setTimeout(() => {
      setIsConnecting(false);
    }, 1000);
  };

  const disconnect = () => {
    // Placeholder: Will disconnect wallet
  };

  return { connect, disconnect, isConnecting, error };
};

interface HeaderProps {
  onConnect: (connected: boolean, address: string | null) => void;
}

export default function Header({ onConnect }: HeaderProps) {
  const { address, setAddress } = useWalletAddress();
  const { connect, disconnect, isConnecting, error } = useConnectWallet();

  const handleConnect = async () => {
    if (address) {
      disconnect();
      setAddress(null);
      onConnect(false, null);
    } else {
      await connect();
      // Placeholder address - will be replaced with actual wallet address
      const placeholderAddress = "SP3K8BC0PPEVCV7NZ6QSRWPV2W9BM5CDGEY8QTV0M";
      setAddress(placeholderAddress);
      onConnect(true, placeholderAddress);
    }
  };

  return (
    <header className="border-b border-gray-800 bg-gray-950/70 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse-glow">
              <span className="text-white font-bold text-sm">TG</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Token Guestbook
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {error && (
              <span className="hidden sm:inline-block text-xs text-red-400 animate-fade-in">
                {error}
              </span>
            )}
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="group relative px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95"
            >
              {isConnecting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Connecting...</span>
                  <span className="sm:hidden">...</span>
                </span>
              ) : address ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="hidden sm:inline">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
                  <span className="sm:hidden">{`${address.slice(0, 4)}...`}</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="hidden sm:inline">Connect Wallet</span>
                  <span className="sm:hidden">Connect</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
