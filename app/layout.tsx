import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Cpu } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JoePro.ai - AI Innovation Hub",
  description: "Your cyberpunk gateway to cutting-edge AI tools, custom agents, and real-time tech intelligence.",
  keywords: ["AI", "OpenAI", "xAI", "Agents", "Tech News", "Cyberpunk"],
  authors: [{ name: "JoePro.ai" }],
  openGraph: {
    title: "JoePro.ai - AI Innovation Hub",
    description: "Your cyberpunk gateway to cutting-edge AI tools, custom agents, and real-time tech intelligence.",
    type: "website",
    url: "https://joepro.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "JoePro.ai - AI Innovation Hub",
    description: "Your cyberpunk gateway to cutting-edge AI tools, custom agents, and real-time tech intelligence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <Cpu className="w-6 h-6 text-neon-cyan group-hover:animate-pulse" />
                <span className="text-xl font-bold">
                  <span className="neon-text-pink">Joe</span>
                  <span className="neon-text-cyan">Pro</span>
                  <span className="text-white">.ai</span>
                </span>
              </Link>

              {/* Nav Links */}
              <div className="flex items-center gap-6">
                <Link 
                  href="/apps" 
                  className="text-gray-300 hover:text-neon-cyan transition-colors"
                >
                  Apps
                </Link>
                <Link 
                  href="/agents" 
                  className="text-gray-300 hover:text-neon-purple transition-colors"
                >
                  Agents
                </Link>
                <Link 
                  href="/feeds" 
                  className="text-gray-300 hover:text-neon-pink transition-colors"
                >
                  Feeds
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="pt-16">
          {children}
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-gray-800 glass mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-neon-cyan" />
                <span className="text-sm text-gray-400">
                  © 2025 JoePro.ai - Powered by Next.js & AI
                </span>
              </div>
              <div className="flex gap-4 text-sm text-gray-400">
                <a href="/api/gadgets/latest" className="hover:text-neon-cyan transition-colors">
                  API
                </a>
                <span>•</span>
                <a href="https://github.com" className="hover:text-neon-cyan transition-colors">
                  GitHub
                </a>
                <span>•</span>
                <a href="https://vercel.com" className="hover:text-neon-cyan transition-colors">
                  Deploy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}