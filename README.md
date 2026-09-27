# Token-Gated Guestbook

A modern, token-gated guestbook dapp built on Stacks using Next.js and Clarity.

## Features

- 🔐 **Token-Gated Access**: Only token holders can post messages
- 💼 **Wallet Connection**: Support for Leather and Xverse wallets
- 🎨 **Modern UI**: Clean, dark theme with Tailwind CSS
- 📱 **Mobile-Friendly**: Responsive design for all devices
- ⚡ **Fast**: Built with Next.js 14 and React 18
- ✨ **Polished UX**: Smooth transitions, loading states, and micro-interactions
- 🔄 **Auto-Refresh**: Messages auto-refresh every 25 seconds
- 📋 **Copy Addresses**: One-click address copying
- 🏆 **Badges**: Special badges for NFT holders and top token holders
- ⏱️ **Rate Limiting**: 30-second cooldown between posts

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Blockchain**: Stacks (Clarity)
- **Wallet**: @stacks/connect (Leather, Xverse)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with dark theme
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles and animations
├── components/
│   ├── Header.tsx          # Wallet connect header
│   ├── Hero.tsx            # Hero section
│   ├── TokenStatus.tsx     # Token ownership card
│   ├── PostForm.tsx        # Message posting form
│   └── GuestbookFeed.tsx   # Message feed display
└── package.json
```

## Components

### Header
- Sticky navigation bar with backdrop blur
- Wallet connect button (Leather/Xverse)
- Shows connected wallet address with status indicator
- Error state handling
- Mobile-responsive with icon-only mode on small screens

### Hero
- Animated gradient text
- "Now Live" status badge
- Feature badges with hover effects
- Smooth entrance animation

### TokenStatus
- Displays token ownership status (SIP-010 or SIP-009)
- Shows token balance or NFT ownership
- Visual feedback (granted/denied) with animations
- Loading states with optimistic UI
- Smooth transitions between states

### PostForm
- Token-gated message posting
- Character limit (280) with visual feedback
- Toast notifications for success/error
- 30-second rate limiting with countdown
- Loading states during submission
- Auto-clear after successful post
- Optimistic updates to feed

### GuestbookFeed
- List of all messages with newest first
- Truncated addresses with copy button
- Relative timestamps (e.g., "2 hours ago")
- Loading skeleton for initial load
- Empty state with helpful messaging
- Auto-refresh every 25 seconds
- Special badges for NFT holders and top token holders
- Smooth hover effects and animations

## UX Enhancements

### Animations
- Fade-in animations for content
- Slide-down for toasts and error banners
- Pulse effects for loading states
- Gradient animations for branding
- Scale effects on buttons and cards
- Smooth transitions throughout

### Loading States
- Skeleton loaders for message feed
- Spinners for buttons and status checks
- Optimistic UI updates
- Disabled states during operations

### Error Handling
- Error banner at top of page
- Toast notifications for form errors
- Graceful degradation
- Clear error messages

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly buttons
- Collapsible content on small screens
- Optimized spacing and typography

## Scaffold Stacks Integration

This project uses placeholder hooks that will be replaced with Scaffold Stacks hooks:

- `useWalletAddress` → Scaffold Stacks wallet hook
- `useConnectWallet` → Scaffold Stacks connection hook
- `useTokenBalance` → Scaffold Stacks token balance hook
- `useGuestbookMessages` → Scaffold Stacks contract read hook

## Development

### Build for Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Future Enhancements

- [ ] Integrate actual Scaffold Stacks hooks
- [ ] Add token contract configuration
- [ ] Implement real blockchain transactions
- [ ] Add message edit/delete functionality
- [ ] Add pagination to message feed
- [ ] Add user profiles
- [ ] Add message reactions/likes
- [ ] Add real-time updates via WebSocket
- [ ] Add message search/filtering
- [ ] Add multi-language support

## License

MIT
