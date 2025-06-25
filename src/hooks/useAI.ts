"use client";

import { useState } from 'react';
import { useLoading } from '@/components/layout/loading-provider';

interface UseAIOptions {
  processingMessage?: string;
  processingTime?: number;
}

export function useAI() {
  const { startAIProcessing, endAIProcessing } = useLoading();
  const [isProcessing, setIsProcessing] = useState(false);
  
  /**
   * Process data with AI
   * @param data The data to process
   * @param options Options for AI processing
   * @returns The processed data
   */
  const processWithAI = async <T,>(
    data: T, 
    processor: (data: T) => Promise<T> | T,
    options: UseAIOptions = {}
  ): Promise<T> => {
    const { 
      processingMessage = "AI is processing your data...",
      processingTime = 0
    } = options;
    
    try {
      setIsProcessing(true);
      startAIProcessing(processingMessage);
      
      // If processingTime is specified, add a minimum processing time
      // This is useful for UI feedback even if the actual processing is fast
      const startTime = Date.now();
      
      // Process the data
      const result = await processor(data);
      
      // Ensure minimum processing time if specified
      if (processingTime > 0) {
        const elapsed = Date.now() - startTime;
        if (elapsed < processingTime) {
          await new Promise(resolve => setTimeout(resolve, processingTime - elapsed));
        }
      }
      
      return result;
    } finally {
      endAIProcessing();
      setIsProcessing(false);
    }
  };
  
  /**
   * Generate content with AI
   * @param prompt The prompt to generate content from
   * @param options Options for AI processing
   * @returns The generated content
   */
  const generateContent = async (
    prompt: string,
    options: UseAIOptions = {}
  ): Promise<string> => {
    return processWithAI(
      prompt,
      async (prompt) => {
        // In a real app, this would call an AI API
        // For demo purposes, we'll just return a mock response
        const mockResponses = [
          "I've analyzed the data and found some interesting patterns.",
          "Based on historical trends, I recommend focusing on these key areas.",
          "The AI model suggests these improvements for your business.",
          "After processing your request, here are the insights I've generated."
        ];
        
        return mockResponses[Math.floor(Math.random() * mockResponses.length)];
      },
      {
        processingMessage: options.processingMessage || "Generating content with AI...",
        processingTime: options.processingTime || 2000
      }
    );
  };
  
  return {
    isProcessing,
    processWithAI,
    generateContent
  };
} 