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

  // These states will be managed by the actual Scaffold Stacks hooks
  // For now, they're placeholders for the UI structure
  const handleWalletConnect = (connected: boolean, address: string | null) => {
    setIsConnected(connected);
    setWalletAddress(address);
    // Token status is now managed by TokenStatus component via onTokenStatus callback
    if (!connected) {
      setHasToken(false);
    }
  };

  const handleMessagePost = (message: string, address: string) => {
    // Optimistically add the new message to the feed
    setNewMessage({ message, address });
  };

  return (
    <div className="min-h-screen">
      <Header onConnect={handleWalletConnect} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1">
            <TokenStatus 
              isConnected={isConnected} 
              walletAddress={walletAddress} 
              onTokenStatus={setHasToken}
            />
          </div>
          <div className="lg:col-span-2">
            <PostForm 
              hasToken={hasToken} 
              isConnected={isConnected} 
              walletAddress={walletAddress}
              onMessagePost={handleMessagePost}
            />
          </div>
        </div>
        
        <div className="pb-20">
          <GuestbookFeed newMessage={newMessage} />
        </div>
      </main>
      
      <footer className="border-t border-white/10 bg-gray-950/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white text-gray-900 flex items-center justify-center font-bold text-sm">
                  TG
                </div>
                <h4 className="text-lg font-semibold text-white">Token Guestbook</h4>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                A token-gated guestbook built on Stacks blockchain. Leave your mark on the decentralized web.
              </p>
            </div>
            
            <div className="space-y-4">
              <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contract</h5>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span>View on Explorer</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group"
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
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                  Stacks
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                  Next.js
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                  Clarity
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                  Tailwind
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">
              © 2024 Token Guestbook. Built on Stacks.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-white transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-white transition-colors"
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
