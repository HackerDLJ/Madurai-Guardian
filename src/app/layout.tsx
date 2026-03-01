import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { TopBar } from '@/components/top-bar';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Madurai Guardian | iOS 26',
  description: 'AI-powered citizen-centric urban cleanliness ecosystem for Madurai.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(roboto.variable, "font-body antialiased bg-background text-foreground min-h-screen selection:bg-primary/30")}>
        <FirebaseClientProvider>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset className="flex flex-col bg-background/0 relative overflow-hidden">
              {/* Dynamic iOS 26 Ambient Glows */}
              <div className="fixed top-[-20%] left-[-10%] w-[80%] h-[80%] bg-primary/10 rounded-full blur-[160px] pointer-events-none animate-pulse duration-[12s]" />
              <div className="fixed bottom-[-15%] right-[-20%] w-[70%] h-[70%] bg-secondary/10 rounded-full blur-[160px] pointer-events-none animate-pulse duration-[10s]" />
              <div className="fixed top-[40%] right-[10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
              <div className="fixed bottom-[30%] left-[20%] w-[30%] h-[30%] bg-destructive/5 rounded-full blur-[140px] pointer-events-none" />
              
              <TopBar />
              <main className="flex-1 px-10 pb-20 pt-10 max-w-7xl mx-auto w-full relative z-10 transition-all duration-700 ease-in-out">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}