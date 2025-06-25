"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BrainCircuit, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAI } from "@/hooks/useAI";
import { Button } from "@/components/ui/button";

interface AiAssistantProps {
  className?: string;
}

export function AiAssistant({ className }: AiAssistantProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" },
  ]);
  const { generateContent, isProcessing } = useAI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;

    // Add user message
    const userMessage = query;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setQuery("");

    try {
      // Generate AI response with our useAI hook
      const aiResponse = await generateContent(userMessage, {
        processingMessage: "Analyzing your request...",
        processingTime: 2500
      });
      
      // Add AI response to messages
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse }
      ]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error processing your request." }
      ]);
    }
  };

  return (
    <Card className={cn("p-6 flex flex-col h-[400px]", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500">
          <BrainCircuit className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold">AI Assistant</h3>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
        {messages.map((message, i) => (
          <div
            key={i}
            className={cn(
              "p-3 rounded-lg max-w-[80%]",
              message.role === "user"
                ? "bg-teal-500 text-white ml-auto"
                : "bg-gray-100 text-gray-800"
            )}
          >
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask your AI assistant..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          disabled={isProcessing}
        />
        <Button
          type="submit"
          className="p-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg"
          isLoading={isProcessing}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </Card>
  );
} 