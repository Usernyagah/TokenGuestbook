"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TokenStatus from "@/components/TokenStatus";
import PostForm from "@/components/PostForm";
import GuestbookFeed from "@/components/GuestbookFeed";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [newMessage, setNewMessage] = useState<{ message: string; address: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // These states will be managed by the actual Scaffold Stacks hooks
  // For now, they're placeholders for the UI structure
  const handleWalletConnect = (connected: boolean, address: string | null) => {
    setIsConnected(connected);
    setWalletAddress(address);
    setError(null);
    // Token status is now managed by TokenStatus component via onTokenStatus callback
    if (!connected) {
      setHasToken(false);
    }
  };

  const handleMessagePost = (message: string, address: string) => {
    // Optimistically add the new message to the feed
    setNewMessage({ message, address });
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div className="min-h-screen">
      <Header onConnect={handleWalletConnect} />
      
      {/* Error banner */}
      {error && (
        <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-3 animate-slide-down">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-400">
              <span className="text-lg">⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-1">
            <TokenStatus 
              isConnected={isConnected} 
              walletAddress={walletAddress} 
              onTokenStatus={setHasToken}
              onError={handleError}
            />
          </div>
          <div className="lg:col-span-2">
            <PostForm 
              hasToken={hasToken} 
              isConnected={isConnected} 
              walletAddress={walletAddress}
              onMessagePost={handleMessagePost}
              onError={handleError}
            />
          </div>
        </div>
        
        <div className="pb-16">
          <GuestbookFeed newMessage={newMessage} onError={handleError} />
        </div>
      </main>
      
      <footer className="border-t border-gray-800 bg-gray-950/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TG</span>
                </div>
                <h4 className="text-lg font-semibold text-white">Token Guestbook</h4>
              </div>
              <p className="text-sm text-gray-500">
                A token-gated guestbook built on Stacks blockchain. Leave your mark on the decentralized web.
              </p>
            </div>
            
            <div className="space-y-4">
              <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contract</h5>
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-colors group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span>View on Explorer</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-colors group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Contract Code</span>
                </a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Built With</h5>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-400 hover:border-purple-500/50 transition-colors">
                  Stacks
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-400 hover:border-purple-500/50 transition-colors">
                  Next.js
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-400 hover:border-purple-500/50 transition-colors">
                  Clarity
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-400 hover:border-purple-500/50 transition-colors">
                  Tailwind
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">
              © 2024 Token Guestbook. Built on Stacks.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-purple-400 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-purple-400 transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-purple-400 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
