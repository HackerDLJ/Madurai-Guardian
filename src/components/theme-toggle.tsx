
'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl liquid-glass border-none group h-11 w-11 shrink-0">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl liquid-glass border-white/10 mt-2 min-w-[120px]">
        <DropdownMenuItem onClick={() => setTheme('light')} className="gap-3 rounded-xl focus:bg-primary/20 cursor-pointer">
          <Sun className="h-4 w-4" /> <span className="text-xs font-bold uppercase tracking-widest">Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-3 rounded-xl focus:bg-primary/20 cursor-pointer">
          <Moon className="h-4 w-4" /> <span className="text-xs font-bold uppercase tracking-widest">Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="gap-3 rounded-xl focus:bg-primary/20 cursor-pointer">
          <Monitor className="h-4 w-4" /> <span className="text-xs font-bold uppercase tracking-widest">System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
