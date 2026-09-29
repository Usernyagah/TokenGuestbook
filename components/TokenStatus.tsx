"use client";

import { useEffect } from "react";
import { useTokenBalance, useCanPost } from '@/src/generated/hooks';

interface TokenStatusProps {
  isConnected: boolean;
  walletAddress: string | null;
  onTokenStatus: (hasToken: boolean) => void;
}

const formatAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export default function TokenStatus({ isConnected, walletAddress, onTokenStatus }: TokenStatusProps) {
  const { balance, isLoading: balanceLoading, error: balanceError } = useTokenBalance(walletAddress);
  const { canPost, isLoading: canPostLoading, error: canPostError } = useCanPost(walletAddress);

  const isLoading = balanceLoading || canPostLoading;
  const hasAccess = balance !== null && balance > BigInt(0);
  const hasPostingPermission = canPost === true;

  useEffect(() => {
    onTokenStatus(hasAccess);
  }, [hasAccess, onTokenStatus]);

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

  if (isLoading) {
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

  if (hasAccess && hasPostingPermission) {
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
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Token Balance:</span>
              <span className="text-sm font-semibold text-white">{balance?.toString() || '0'} tokens</span>
            </div>
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
            <span className="text-sm font-semibold text-gray-500">{balance?.toString() || '0'} tokens</span>
          </div>
          {balanceError && (
            <p className="text-xs text-red-400 pt-2">
              Error checking token status: {balanceError}
            </p>
          )}
          <p className="text-xs text-gray-500 pt-2">
            You need to hold at least 1 token to post messages.
          </p>
        </div>
      </div>
    </div>
  );
}
