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
      <body className={cn(roboto.variable, "font-body antialiased bg-background text-foreground min-h-screen")}>
        <FirebaseClientProvider>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset className="flex flex-col bg-background/0 relative overflow-hidden">
              {/* Background Glows for Liquid Glass Effect */}
              <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="fixed top-[30%] right-[10%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
              
              <TopBar />
              <main className="flex-1 px-10 pb-20 pt-8 max-w-7xl mx-auto w-full relative z-10">
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