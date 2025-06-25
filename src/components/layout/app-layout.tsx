"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar-context";
import { AppHeader } from "@/components/layout/app-header";

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <AppHeader />
      <main 
        className={`transition-all duration-300 pt-16 ${
          isExpanded ? "sm:pl-16 md:pl-64" : "pl-16"
        }`}
      >
        <div className="max-w-[2000px] mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
} 