export default function Hero() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 animate-slide-up">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-6 animate-fade-in">
          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
          <span>Now Live on Stacks</span>
        </div>
        
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient leading-tight">
          Token-Gated Guestbook
        </h2>
        
        <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
          Leave your mark on the blockchain. Connect your wallet, verify your token ownership, 
          and share your message with the community.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <div className="group px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 cursor-default">
            <span className="mr-2">🔒</span>
            <span>Token-Gated Access</span>
          </div>
          <div className="group px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 cursor-default">
            <span className="mr-2">⛓️</span>
            <span>Built on Stacks</span>
          </div>
          <div className="group px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 cursor-default">
            <span className="mr-2">💎</span>
            <span>Premium Experience</span>
          </div>
        </div>
      </div>
    </section>
  );
}
