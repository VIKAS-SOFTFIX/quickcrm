"use client";

import React, { createContext, useState, useContext, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { FullPageLoader, AIProcessingLoader } from "@/components/ui/loader";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  startApiRequest: () => void;
  endApiRequest: () => void;
  startAIProcessing: (message?: string) => void;
  endAIProcessing: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiProcessingMessage, setAIProcessingMessage] = useState<string | undefined>(undefined);
  
  // Combine all loading states
  const isLoading = isPending || isApiLoading;
  
  const startApiRequest = () => {
    setIsApiLoading(true);
  };
  
  const endApiRequest = () => {
    setIsApiLoading(false);
  };
  
  const startAIProcessing = (message?: string) => {
    setAIProcessingMessage(message);
    setIsAIProcessing(true);
  };
  
  const endAIProcessing = () => {
    setIsAIProcessing(false);
  };
  
  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading, 
        setIsLoading: setIsApiLoading,
        startApiRequest,
        endApiRequest,
        startAIProcessing,
        endAIProcessing
      }}
    >
      {isApiLoading && <FullPageLoader text="Loading data..." />}
      {isAIProcessing && <AIProcessingLoader text={aiProcessingMessage} />}
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}; 