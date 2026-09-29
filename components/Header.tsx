"use client";

import { useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";

interface HeaderProps {
  onConnect: (connected: boolean, address: string | null) => void;
}

export default function Header({ onConnect }: HeaderProps) {
  const { address, isSignedIn, connectWallet, signOut, isLoading } = useWallet();

  const handleConnect = async () => {
    if (isSignedIn && address) {
      await signOut();
    } else {
      try {
        await connectWallet();
      } catch (error) {
        console.error('Connection error:', error);
      }
    }
  };

  // Notify parent of connection status changes
  useEffect(() => {
    const isConnected = isSignedIn && address !== null;
    if (isConnected && address) {
      onConnect(true, address);
    } else {
      onConnect(false, null);
    }
  }, [isSignedIn, address, onConnect]);

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
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-white text-gray-900 font-medium text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="hidden sm:inline">Connecting...</span>
              ) : isSignedIn && address ? (
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
