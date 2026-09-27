export default function Hero() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 animate-slide-up">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          <span>Now Live on Stacks</span>
        </div>
        
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight tracking-tight">
          Token-Gated Guestbook
        </h2>
        
        <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Leave your mark on the blockchain. Connect your wallet, verify your token ownership, 
          and share your message with the community.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3">
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
            <span className="mr-2">🔒</span>
            <span>Token-Gated Access</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
            <span className="mr-2">⛓️</span>
            <span>Built on Stacks</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
            <span className="mr-2">💎</span>
            <span>Premium Experience</span>
          </div>
        </div>
      </div>
    </section>
  );
}
