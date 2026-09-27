"use client";

import { useState, useEffect, useCallback } from "react";

type TokenType = 'SIP010' | 'SIP009' | 'NONE';

interface TokenCheckResult {
  hasAccess: boolean;
  tokenType: TokenType;
  balance?: number;
  ownsNft?: boolean;
  isLoading: boolean;
}

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
    
    setTimeout(() => {
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
}

const formatAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export default function TokenStatus({ isConnected, walletAddress, onTokenStatus }: TokenStatusProps) {
  const { result, checkToken, resetToken } = useTokenCheck();

  useEffect(() => {
    if (isConnected && walletAddress && !result.isLoading && result.tokenType === 'NONE') {
      checkToken(walletAddress);
    } else if (!isConnected && result.tokenType !== 'NONE') {
      resetToken();
    }
  }, [isConnected, walletAddress, result.isLoading, result.tokenType, checkToken, resetToken]);

  useEffect(() => {
    onTokenStatus(result.hasAccess);
  }, [result.hasAccess, onTokenStatus]);

  if (!isConnected) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-2xl">🔐</span>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white">Connect Your Wallet</h3>
            <p className="text-sm text-gray-500">Connect to check your token status</p>
          </div>
        </div>
      </div>
    );
  }

  if (result.isLoading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 font-semibold text-sm">
                {walletAddress ? formatAddress(walletAddress).slice(0, 2) : '..'}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {walletAddress ? formatAddress(walletAddress) : 'Connecting...'}
                </p>
                <p className="text-xs text-gray-500">Wallet connected</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
              Checking...
            </div>
          </div>
          <div className="flex items-center gap-3 pt-3 border-t border-white/10">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Verifying token ownership...</p>
          </div>
        </div>
      </div>
    );
  }

  if (result.hasAccess) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 sm:p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-lg">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {walletAddress ? formatAddress(walletAddress) : 'Unknown'}
                </p>
                <p className="text-xs text-gray-500">Wallet connected</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium">
              Access Granted
            </div>
          </div>
          
          <div className="pt-3 border-t border-green-500/20 space-y-2">
            {result.tokenType === 'SIP010' && result.balance !== undefined ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Token Balance:</span>
                <span className="text-sm font-semibold text-white">{result.balance} tokens</span>
              </div>
            ) : result.tokenType === 'SIP009' ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">NFT Ownership:</span>
                <span className="text-sm font-semibold text-white">Yes</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-lg">✕</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {walletAddress ? formatAddress(walletAddress) : 'Unknown'}
              </p>
              <p className="text-xs text-gray-500">Wallet connected</p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            Access Denied
          </div>
        </div>
        
        <div className="pt-3 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Token Balance:</span>
            <span className="text-sm font-semibold text-gray-500">0 tokens</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">NFT Ownership:</span>
            <span className="text-sm font-semibold text-gray-500">No</span>
          </div>
          <p className="text-xs text-gray-500 pt-2">
            You need to hold the minimum amount of token or own at least 1 NFT to post messages.
          </p>
        </div>
      </div>
    </div>
  );
}
