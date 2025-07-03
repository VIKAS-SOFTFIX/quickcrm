"use client";

import { AppLayout } from "@/components/layout/app-layout";

export default function UserManagementLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        {children}
      </div>
    </AppLayout>
  );
} 