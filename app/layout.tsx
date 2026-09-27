import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Token-Gated Guestbook | Stacks Blockchain",
  description: "A token-gated guestbook built on Stacks. Connect your wallet, verify your token ownership, and share your message with the community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <div className="animate-fade-in">
          {children}
        </div>
      </body>
    </html>
  );
}
