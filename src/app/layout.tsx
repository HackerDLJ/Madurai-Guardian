
import type {Metadata} from 'next';
import './globals.css';
import { NavBar } from '@/components/nav-bar';
import { TopBar } from '@/components/top-bar';
import { Toaster } from '@/components/ui/toaster';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground flex flex-col min-h-screen">
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
