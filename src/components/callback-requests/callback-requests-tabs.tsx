"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CallbackRequestsTabs() {
  const [activeTab, setActiveTab] = useState("all");
  
  return (
    <div className="mb-4">
      <Tabs defaultValue="all" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-3 sm:w-auto sm:inline-grid">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
} 