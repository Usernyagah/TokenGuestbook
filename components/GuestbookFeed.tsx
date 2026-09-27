"use client";

import { useState, useEffect, useCallback } from "react";

interface Message {
  id: number;
  address: string;
  message: string;
  timestamp: string;
  tokenBalance?: number;
  hasSpecialNft?: boolean;
}

interface GuestbookFeedProps {
  newMessage?: { message: string; address: string } | null;
}

// Placeholder data - will be replaced with actual blockchain data
const placeholderMessages: Message[] = [
  {
    id: 1,
    address: "SP3K8BC0PPEVCV7NZ6QSRWPV2W9BM5CDGEY8QTV0M",
    message: "Just minted my first token! This guestbook is amazing 🔥",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    tokenBalance: 500,
  },
  {
    id: 2,
    address: "SP2ZKJSM4V2Z5X8Y9Q0R1T2U3V4W5X6Y7Z8A9B0C1",
    message: "Building on Stacks is the future. Love the community!",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    hasSpecialNft: true,
  },
  {
    id: 3,
    address: "SP1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0",
    message: "Hello from the Stacks ecosystem! 🚀",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    tokenBalance: 1000,
  },
];

const AUTO_REFRESH_INTERVAL = 25000; // 25 seconds

// Placeholder hooks - will be replaced with Scaffold Stacks hooks
const useGuestbookMessages = (newMessage?: { message: string; address: string } | null) => {
  const [messages, setMessages] = useState<Message[]>(placeholderMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const refreshMessages = useCallback(async () => {
    setIsLoading(true);
    // Placeholder: Will use Scaffold Stacks hooks to fetch messages from blockchain
    setTimeout(() => {
      setIsLoading(false);
      setIsInitialLoad(false);
    }, 1000);
  }, []);

  // Optimistically add new message
  useEffect(() => {
    if (newMessage) {
      const optimisticMessage: Message = {
        id: Date.now(),
        address: newMessage.address,
        message: newMessage.message,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => {
        // Check if message already exists to prevent duplicates
        const exists = prev.some(m => 
          m.address === newMessage.address && 
          m.message === newMessage.message &&
          Math.abs(new Date(m.timestamp).getTime() - Date.now()) < 5000
        );
        if (exists) return prev;
        return [optimisticMessage, ...prev];
      });
      
      // Refresh after a short delay to sync with blockchain
      setTimeout(() => {
        refreshMessages();
      }, 2000);
    }
  }, [newMessage, refreshMessages]);

  // Auto-refresh every 25 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshMessages();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [refreshMessages]);

  return { messages, isLoading, isInitialLoad, refreshMessages };
};

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const copyToClipboard = async (text: string, onSuccess: () => void) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      onSuccess();
    }
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

// Loading skeleton component
const MessageSkeleton = () => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4 animate-shimmer">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-white/10 rounded w-24 animate-pulse" />
        <div className="h-3 bg-white/10 rounded w-16 animate-pulse" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-white/10 rounded w-full animate-pulse" />
      <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse" />
      <div className="h-4 bg-white/10 rounded w-4/6 animate-pulse" />
    </div>
  </div>
);

// Message card component
const MessageCard = ({ msg }: { msg: Message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(msg.address, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const hasBadge = msg.tokenBalance && msg.tokenBalance >= 500;
  const hasNftBadge = msg.hasSpecialNft;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-200 group animate-fade-in">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 font-semibold text-sm">
            {formatAddress(msg.address).slice(0, 2)}
          </div>
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white">
                  {formatAddress(msg.address)}
                </p>
                <button
                  onClick={handleCopy}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-white/10 rounded"
                  title="Copy address"
                >
                  {copied ? (
                    <span className="text-green-400 text-xs">✓</span>
                  ) : (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {formatTimestamp(msg.timestamp)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Badges */}
        <div className="flex items-center gap-2">
          {hasNftBadge && (
            <div className="px-2 py-1 rounded-full bg-white/10 border border-white/20 text-gray-300 text-xs font-medium flex items-center gap-1">
              <span>💎</span>
              <span className="hidden sm:inline">NFT Holder</span>
              <span className="sm:hidden">NFT</span>
            </div>
          )}
          {hasBadge && !hasNftBadge && (
            <div className="px-2 py-1 rounded-full bg-white/10 border border-white/20 text-gray-300 text-xs font-medium flex items-center gap-1">
              <span>⭐</span>
              <span className="hidden sm:inline">Top Holder</span>
              <span className="sm:hidden">Top</span>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{msg.message}</p>
    </div>
  );
};

export default function GuestbookFeed({ newMessage }: GuestbookFeedProps) {
  const { messages, isLoading, isInitialLoad, refreshMessages } = useGuestbookMessages(newMessage);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">
            Guestbook Messages
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </p>
        </div>
        <button
          onClick={refreshMessages}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <span className="hidden sm:inline">Refreshing...</span>
              <span className="sm:hidden">...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">↻</span>
            </>
          )}
        </button>
      </div>

      {/* Loading skeleton for initial load */}
      {isInitialLoad && isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <MessageSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {messages.map((msg) => (
              <MessageCard key={msg.id} msg={msg} />
            ))}
          </div>

          {messages.length === 0 && !isLoading && (
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-12 text-center animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center ring-2 ring-gray-700 ring-offset-2 ring-offset-gray-900">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No Messages Yet</h3>
              <p className="text-sm text-gray-500 mb-4">Be the first to leave a message!</p>
              <p className="text-xs text-gray-600">Connect your wallet and verify your token ownership to get started.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
