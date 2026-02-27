import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { NavBar } from '@/components/nav-bar';
import { TopBar } from '@/components/top-bar';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
});

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
      <body className={cn(roboto.variable, "font-body antialiased bg-background text-foreground flex flex-col min-h-screen")}>
        <TopBar />
        <main className="flex-1 pb-32 pt-2 px-4 max-w-lg mx-auto w-full">
          {children}
        </main>
        <NavBar />
        <Toaster />
      </body>
    </html>
  );
}