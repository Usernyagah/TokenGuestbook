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
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-3xl">🔒</span>
          </div>
          <h3 className="text-base font-semibold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-sm text-gray-500">Connect your wallet to post messages</p>
        </div>
      </div>
    );
  }

  if (!hasToken) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 opacity-50">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-3xl">🚫</span>
          </div>
          <h3 className="text-base font-semibold text-white mb-2">Token Required</h3>
          <p className="text-sm text-gray-500 mb-4">You need to hold the required token to post messages</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Minimum token balance OR</p>
            <p>• At least 1 NFT</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 relative">
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

      <h3 className="text-lg font-semibold text-white mb-4">Post a Message</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts with the community..."
            className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isNearLimit && charsRemaining >= 0
                ? 'border-yellow-500/30 focus:ring-yellow-500/20'
                : charsRemaining < 0
                ? 'border-red-500/30 focus:ring-red-500/20'
                : 'border-white/10 focus:ring-white/20'
            }`}
            rows={4}
            maxLength={280}
            disabled={isSubmitting}
          />
          <div className="absolute bottom-3 right-3 text-xs font-medium transition-colors duration-200">
            {charsRemaining < 0 ? (
              <span className="text-red-400">{Math.abs(charsRemaining)} over</span>
            ) : isNearLimit ? (
              <span className="text-yellow-400">{charsRemaining}</span>
            ) : (
              <span className="text-gray-500">{charsRemaining}</span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          {remainingCooldown > 0 && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <span>⏱️</span>
              <span>Wait {Math.ceil(remainingCooldown / 1000)}s to post again</span>
            </span>
          )}
          <button
            type="submit"
            disabled={isFormDisabled}
            className="ml-auto px-6 py-2.5 rounded-lg bg-white text-gray-900 font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 disabled:hover:bg-white"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
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
              <span className="hidden sm:inline">Post Message</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
