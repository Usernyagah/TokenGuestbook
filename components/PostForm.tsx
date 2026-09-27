"use client";

import { useState, useEffect, useCallback } from "react";

interface PostFormProps {
  hasToken: boolean;
  isConnected: boolean;
  walletAddress: string | null;
  onMessagePost?: (message: string, address: string) => void;
}

interface ToastMessage {
  type: 'success' | 'error';
  message: string;
  id: number;
}

const RATE_LIMIT_SECONDS = 30;
const STORAGE_KEY = 'guestbook_last_post_time';

const getLastPostTime = (walletAddress: string | null): number => {
  if (!walletAddress) return 0;
  if (typeof window === 'undefined') return 0;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return 0;
    const parsed = JSON.parse(data);
    return parsed[walletAddress] || 0;
  } catch {
    return 0;
  }
};

const setLastPostTime = (walletAddress: string | null): void => {
  if (!walletAddress) return;
  if (typeof window === 'undefined') return;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : {};
    parsed[walletAddress] = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // Silently fail if localStorage is not available
  }
};

const getRemainingCooldown = (walletAddress: string | null): number => {
  const lastPost = getLastPostTime(walletAddress);
  const elapsed = Date.now() - lastPost;
  const remaining = RATE_LIMIT_SECONDS * 1000 - elapsed;
  return Math.max(0, remaining);
};

export default function PostForm({ hasToken, isConnected, walletAddress, onMessagePost }: PostFormProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [remainingCooldown, setRemainingCooldown] = useState(0);

  // Update cooldown countdown
  useEffect(() => {
    if (!isConnected || !walletAddress) {
      setRemainingCooldown(0);
      return;
    }

    const updateCooldown = () => {
      const remaining = getRemainingCooldown(walletAddress);
      setRemainingCooldown(remaining);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);

    return () => clearInterval(interval);
  }, [isConnected, walletAddress]);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setToast({ type, message, id });
    setTimeout(() => {
      setToast(prev => prev?.id === id ? null : prev);
    }, 3000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!hasToken) {
      showToast('error', 'You need to hold the required token to post messages');
      return;
    }
    if (!walletAddress) {
      showToast('error', 'Please connect your wallet');
      return;
    }
    if (remainingCooldown > 0) {
      showToast('error', `Please wait ${Math.ceil(remainingCooldown / 1000)} seconds before posting again`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Placeholder: Will use Scaffold Stacks hooks to post message to blockchain
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Optimistic update - add message to feed immediately
      if (onMessagePost) {
        onMessagePost(message, walletAddress);
      }

      // Update rate limit
      setLastPostTime(walletAddress);
      setRemainingCooldown(RATE_LIMIT_SECONDS * 1000);

      // Clear form and show success
      setMessage("");
      showToast('success', 'Message posted successfully!');
    } catch (error) {
      showToast('error', 'Failed to post message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = !hasToken || !message.trim() || isSubmitting || remainingCooldown > 0;
  const charsRemaining = 280 - message.length;
  const isNearLimit = charsRemaining <= 20;

  if (!isConnected) {
    return (
      <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-gray-700 transition-all duration-300 animate-fade-in">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center ring-2 ring-gray-700 ring-offset-2 ring-offset-gray-900">
            <span className="text-3xl">🔒</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Connect Your Wallet</h3>
          <p className="text-sm text-gray-500">Connect your wallet to post messages</p>
        </div>
      </div>
    );
  }

  if (!hasToken) {
    return (
      <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 sm:p-8 opacity-60 hover:opacity-70 transition-all duration-300 animate-fade-in">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center ring-2 ring-red-500/20 ring-offset-2 ring-offset-gray-900">
            <span className="text-3xl">🚫</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Token Required</h3>
          <p className="text-sm text-gray-500 mb-4">You need to hold the required token to post messages</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Minimum SIP-010 token balance OR</p>
            <p>• At least 1 SIP-009 NFT</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8 relative hover:border-gray-600 transition-all duration-300 shadow-lg">
      {/* Toast Notification */}
      {toast && (
        <div className={`absolute top-4 right-4 left-4 sm:left-auto sm:w-80 px-4 py-3 rounded-lg shadow-xl z-10 animate-slide-down backdrop-blur-sm ${
          toast.type === 'success' 
            ? 'bg-green-500/90 border border-green-500/30 text-green-100' 
            : 'bg-red-500/90 border border-red-500/30 text-red-100'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{toast.type === 'success' ? '✓' : '✕'}</span>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
        Post a Message
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts with the community..."
            className={`w-full px-4 py-3 bg-gray-950/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              isNearLimit && charsRemaining >= 0
                ? 'border-yellow-500/50 focus:ring-yellow-500/50'
                : charsRemaining < 0
                ? 'border-red-500/50 focus:ring-red-500/50'
                : 'border-gray-700 focus:ring-purple-500/50'
            }`}
            rows={4}
            maxLength={280}
            disabled={isSubmitting}
          />
          <div className="absolute bottom-3 right-3 text-xs font-medium transition-colors duration-300">
            {charsRemaining < 0 ? (
              <span className="text-red-400 animate-pulse">{Math.abs(charsRemaining)} over</span>
            ) : isNearLimit ? (
              <span className="text-yellow-400">{charsRemaining}</span>
            ) : (
              <span className="text-gray-500">{charsRemaining}</span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          {remainingCooldown > 0 && (
            <span className="text-xs text-yellow-400 flex items-center gap-1 animate-pulse">
              <span>⏱️</span>
              <span>Wait {Math.ceil(remainingCooldown / 1000)}s to post again</span>
            </span>
          )}
          <button
            type="submit"
            disabled={isFormDisabled}
            className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="hidden sm:inline">Posting...</span>
                <span className="sm:hidden">...</span>
              </span>
            ) : remainingCooldown > 0 ? (
              <span className="flex items-center justify-center gap-2">
                <span className="text-lg">⏱️</span>
                <span className="hidden sm:inline">{Math.ceil(remainingCooldown / 1000)}s cooldown</span>
                <span className="sm:hidden">{Math.ceil(remainingCooldown / 1000)}s</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span className="hidden sm:inline">Post Message</span>
                <span className="sm:hidden">Post</span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
