"use client";

import { useState, useEffect, useCallback } from "react";

// Token types for SIP-010 and SIP-009
type TokenType = 'SIP010' | 'SIP009' | 'NONE';

interface TokenCheckResult {
  hasAccess: boolean;
  tokenType: TokenType;
  balance?: number;
  ownsNft?: boolean;
  isLoading: boolean;
}

// Placeholder hooks - will be replaced with Scaffold Stacks hooks
const useTokenCheck = () => {
  const [result, setResult] = useState<TokenCheckResult>({
    hasAccess: false,
    tokenType: 'NONE',
    isLoading: false,
  });

  const checkToken = useCallback(async (address: string | null) => {
    if (!address) {
      setResult({
        hasAccess: false,
        tokenType: 'NONE',
        isLoading: false,
      });
      return;
    }
    
    setResult(prev => ({ ...prev, isLoading: true }));
    
    // Placeholder: Will use Scaffold Stacks hooks to check both SIP-010 token balance and SIP-009 NFT ownership
    // Simulating optimistic UI with delay
    setTimeout(() => {
      // Randomly choose between token or NFT for demo purposes
      const hasToken = Math.random() > 0.3;
      const isNft = Math.random() > 0.5;
      
      setResult({
        hasAccess: hasToken,
        tokenType: hasToken ? (isNft ? 'SIP009' : 'SIP010') : 'NONE',
        balance: hasToken && !isNft ? Math.floor(Math.random() * 1000) + 10 : undefined,
        ownsNft: hasToken && isNft,
        isLoading: false,
      });
    }, 1500);
  }, []);

  const resetToken = useCallback(() => {
    setResult({
      hasAccess: false,
      tokenType: 'NONE',
      isLoading: false,
    });
  }, []);

  return { result, checkToken, resetToken };
};

interface TokenStatusProps {
  isConnected: boolean;
  walletAddress: string | null;
  onTokenStatus: (hasToken: boolean) => void;
  onError?: (error: string) => void;
}

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function TokenStatus({ isConnected, walletAddress, onTokenStatus, onError }: TokenStatusProps) {
  const { result, checkToken, resetToken } = useTokenCheck();

  // Handle wallet connection/disconnection
  useEffect(() => {
    if (isConnected && walletAddress && !result.isLoading && result.tokenType === 'NONE') {
      checkToken(walletAddress);
    } else if (!isConnected && result.tokenType !== 'NONE') {
      resetToken();
    }
  }, [isConnected, walletAddress, result.isLoading, result.tokenType, checkToken, resetToken]);

  // Notify parent when token status changes
  useEffect(() => {
    onTokenStatus(result.hasAccess);
  }, [result.hasAccess, onTokenStatus]);

  if (!isConnected) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-gray-700 transition-all duration-300 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center ring-2 ring-gray-700 ring-offset-2 ring-offset-gray-900">
            <span className="text-2xl">🔐</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-300">Connect Your Wallet</h3>
            <p className="text-sm text-gray-500">Connect to check your token status</p>
          </div>
        </div>
      </div>
    );
  }

  // Optimistic loading state with address shown
  if (result.isLoading) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-purple-500/25 animate-pulse">
                {walletAddress ? formatAddress(walletAddress).slice(0, 2) : '..'}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {walletAddress ? formatAddress(walletAddress) : 'Connecting...'}
                </p>
                <p className="text-xs text-gray-500">Wallet connected</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium animate-pulse">
              Checking...
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-gray-800">
            <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Verifying SIP-010 token and SIP-009 NFT ownership...</p>
          </div>
        </div>
      </div>
    );
  }

  // User has access (either token or NFT)
  if (result.hasAccess) {
    return (
      <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6 sm:p-8 hover:border-green-500/50 transition-all duration-300 animate-fade-in shadow-lg shadow-green-500/10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25 animate-pulse-glow">
                <span className="text-lg">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {walletAddress ? formatAddress(walletAddress) : 'Unknown'}
                </p>
                <p className="text-xs text-gray-400">Wallet connected</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium">
              You can post
            </div>
          </div>
          
          <div className="pt-3 border-t border-green-500/20 space-y-2">
            {result.tokenType === 'SIP010' && result.balance !== undefined ? (
              <div className="flex items-center justify-between group">
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">SIP-010 Token Balance:</span>
                <span className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors">{result.balance} tokens</span>
              </div>
            ) : result.tokenType === 'SIP009' ? (
              <div className="flex items-center justify-between group">
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">SIP-009 NFT Ownership:</span>
                <span className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors">Yes</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // User does not have access
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-gray-700 transition-all duration-300 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center ring-2 ring-red-500/20 ring-offset-2 ring-offset-gray-900">
              <span className="text-lg">✕</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {walletAddress ? formatAddress(walletAddress) : 'Unknown'}
              </p>
              <p className="text-xs text-gray-500">Wallet connected</p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium">
            Need token to post
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">SIP-010 Token Balance:</span>
            <span className="text-sm font-semibold text-gray-500">0 tokens</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">SIP-009 NFT Ownership:</span>
            <span className="text-sm font-semibold text-gray-500">No</span>
          </div>
          <p className="text-xs text-gray-500 pt-2">
            You need to hold the minimum amount of SIP-010 token or own at least 1 SIP-009 NFT to post messages.
          </p>
        </div>
      </div>
    </div>
  );
}
