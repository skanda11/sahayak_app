"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, LogOut, FileQuestion, User, Settings, Shield } from 'lucide-react';
import { Logo } from '../icons';

function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';

  const navItems = [
    { href: `/dashboard`, icon: Home, label: 'Dashboard' },
    { href: `/concept-clarification`, icon: FileQuestion, label: 'Concept Clarifier' },
  ];

  const getHref = (href: string) => {
    return `${href}?role=${role}`;
  }

  const getUserDetails = () => {
    switch(role) {
      case 'teacher':
        return { name: 'Dr. Smith', avatar: 'S' };
      case 'admin':
        return { name: 'Admin User', avatar: 'A' };
      case 'student':
      default:
        return { name: 'Alex Johnson', avatar: 'A' };
    }
  }

  const userDetails = getUserDetails();
  const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <span className="text-lg font-semibold">AcademiaTrack</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={currentPath.startsWith(getHref(item.href))}
                  tooltip={{
                    children: item.label,
                  }}
                >
                  <Link href={getHref(item.href)}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-12 w-full justify-start gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="profile avatar" />
                  <AvatarFallback>{userDetails.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{userDetails.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{role}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="top" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><User className="mr-2 h-4 w-4" /><span>Profile</span></DropdownMenuItem>
              <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /><span>Settings</span></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/"><LogOut className="mr-2 h-4 w-4" /><span>Log out</span></Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                <h1 className="font-headline text-lg font-semibold capitalize">
                  {role === 'admin' && pathname.includes('dashboard') ? 'Admin Dashboard' : pathname.split('/').pop()?.replace(/-/g, ' ')}
                </h1>
            </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppLayoutClient>{children}</AppLayoutClient>
    </Suspense>
  )
}
