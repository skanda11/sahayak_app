
"use client";

import React, { Suspense, useEffect, useState } from 'react';
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
import { Home, LogOut, User, Settings, Users, BookOpen } from 'lucide-react';
import { Logo } from '../icons';
import { getStudentById } from '@/lib/mock-data';

function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [userName, setUserName] = useState('Teacher');
  const [userRole, setUserRole] = useState('teacher');

  useEffect(() => {
    const role = searchParams.get('role') || 'teacher';
    const studentId = searchParams.get('studentId');

    if (role === 'student' && studentId) {
      setUserRole('student');
      getStudentById(studentId).then((student) => {
        if (student) setUserName(student.name);
      });
    } else {
      setUserRole('teacher');
      setUserName('Teacher');
    }
  }, [searchParams]);

  const navItems = [
    { href: `/`, icon: Home, label: 'Dashboard' },
    { href: `/student-view?studentId=student-1`, icon: User, label: 'Student 1 View' },
    { href: `/student-view?studentId=student-2`, icon: User, label: 'Student 2 View' },
  ];

  const userDetails = {
    name: userName,
    avatar: userName.charAt(0).toUpperCase()
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <span className="text-lg font-semibold">Sahayak</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={item.href === '/' ? pathname === item.href : pathname.includes('/student-view') && searchParams.get('studentId') === item.href.split('=')[1]}
                  tooltip={{
                    children: item.label,
                  }}
                >
                  <Link href={item.label.startsWith('Student') ? `/student-view?studentId=${item.href.split('studentId=')[1]}` : `/`}>
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
                  <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="top" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><User className="mr-2 h-4 w-4" /><span>Profile</span></DropdownMenuItem>
              <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /><span>Settings</span></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                <h1 className="font-headline text-lg font-semibold capitalize">
                  {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
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
    <Suspense>
      <AppLayoutClient>{children}</AppLayoutClient>
    </Suspense>
  )
}
