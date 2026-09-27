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
    <header className="border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-gray-900 flex items-center justify-center font-bold text-sm">
              TG
            </div>
            <h1 className="text-lg font-semibold text-white">
              Token Guestbook
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {error && (
              <span className="hidden sm:inline-block text-xs text-red-400">
                {error}
              </span>
            )}
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="px-4 py-2 rounded-lg bg-white text-gray-900 font-medium text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Connecting...</span>
                  <span className="sm:hidden">...</span>
                </span>
              ) : address ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="hidden sm:inline">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
                  <span className="sm:hidden">{`${address.slice(0, 4)}...`}</span>
                </span>
              ) : (
                <span className="hidden sm:inline">Connect Wallet</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
