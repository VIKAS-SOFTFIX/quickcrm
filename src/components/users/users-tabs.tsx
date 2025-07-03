"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UsersTabsProps {
  onRoleChange: (role: string) => void;
  currentRole: string;
}

export function UsersTabs({ onRoleChange, currentRole }: UsersTabsProps) {
  
  return (
    <div className="mb-4">
      <Tabs defaultValue="all" onValueChange={onRoleChange} value={currentRole}>
        <TabsList className="grid grid-cols-5 md:grid-cols-6 sm:w-auto sm:inline-grid">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="manager">Manager</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
} 