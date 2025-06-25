"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Bell, 
  MessageSquare, 
  HelpCircle, 
  Settings,
  LogOut,
  ChevronDown,
  User,
  BrainCircuit,
  X,
  Send
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar-context";
import { Loader } from "@/components/ui/loader";
import { useLoading } from "@/components/layout/loading-provider";
import { Button } from "@/components/ui/button";
import { useAI } from "@/hooks/useAI";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { isExpanded } = useSidebar();
  const { isLoading } = useLoading();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // AI Assistant state
  const [showAssistant, setShowAssistant] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hello! I'm your QuickIQ AI assistant. How can I help you today?" },
  ]);
  const { generateContent, isProcessing } = useAI();

  const handleAssistantSubmit = async (e: React.FormEvent) => {
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
  
  // Mock notifications
  const notifications = [
    {
      id: '1',
      type: 'message',
      content: 'New message from John Doe',
      time: '5 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'lead',
      content: 'New lead assigned to you',
      time: '1 hour ago',
      read: false
    },
    {
      id: '3',
      type: 'task',
      content: 'Task "Follow up with client" is due tomorrow',
      time: '3 hours ago',
      read: true
    },
    {
      id: '4',
      type: 'system',
      content: 'System maintenance scheduled for tonight',
      time: 'Yesterday',
      read: true
    }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <>
      <header 
        className={`bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-0 z-10 transition-all duration-300 ${
          isExpanded ? "sm:pl-16 md:pl-64" : "pl-16"
        }`}
      >
        <div className="h-full flex items-center justify-between px-4">
          {/* Search */}
          <div className="relative w-64 lg:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-1">
            {/* Loading indicator */}
            {isLoading && (
              <div className="mr-2 bg-teal-50 px-3 py-1 rounded-full flex items-center">
                <Loader size="sm" type="ai" />
                <span className="ml-2 text-xs text-teal-700">Processing</span>
              </div>
            )}
            
            {/* AI Assistant */}
            <button 
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative"
              onClick={() => setShowAssistant(true)}
            >
              <BrainCircuit className="h-5 w-5" />
            </button>
            
            {/* Help */}
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
              <HelpCircle className="h-5 w-5" />
            </button>
            
            {/* Messages */}
            <Link href="/email" className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full"></span>
            </Link>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-medium">Notifications</h3>
                    <button className="text-xs text-teal-600 hover:text-teal-800">
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-teal-50' : ''
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${!notification.read ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
                          <div className="flex-1">
                            <p className="text-sm">{notification.content}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-200">
                    <Link href="/notifications" className="text-sm text-teal-600 hover:text-teal-800">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile */}
            <div className="relative ml-2">
              <button 
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-medium">
                  JD
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </button>
              
              {/* Profile dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <div className="font-medium">John Doe</div>
                    <div className="text-sm text-gray-500">john.doe@example.com</div>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm">Your Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">Settings</span>
                    </Link>
                    <button
                      className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* AI Assistant Modal */}
      {showAssistant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500">
                  <BrainCircuit className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">QuickIQ</h3>
              </div>
              <button 
                onClick={() => setShowAssistant(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
            
            {/* Input form */}
            <form onSubmit={handleAssistantSubmit} className="p-4 border-t flex gap-2">
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
          </div>
        </div>
      )}
    </>
  );
}