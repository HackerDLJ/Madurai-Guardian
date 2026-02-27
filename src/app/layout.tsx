import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NavBar } from '@/components/nav-bar';
import { TopBar } from '@/components/top-bar';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Madurai Guardian',
  description: 'AI-powered citizen-centric urban cleanliness ecosystem for Madurai.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased bg-background text-foreground flex flex-col min-h-screen")}>
        <TopBar />
        <main className="flex-1 pb-24 pt-4 px-4 max-w-lg mx-auto w-full">
          {children}
        </main>
        <NavBar />
        <Toaster />
      </body>
    </html>
  );
}
