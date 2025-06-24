"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Smile, 
  Paperclip, 
  Mic, 
  MoreVertical, 
  Search, 
  ArrowLeft,
  Send,
  Image,
  Camera,
  File,
  Check,
  CheckCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Message {
  id: string;
  text: string;
  time: Date;
  isOutgoing: boolean;
  status: 'sent' | 'delivered' | 'read';
  media?: {
    type: 'image' | 'video' | 'document';
    url: string;
    name?: string;
    size?: number;
  };
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
  isTyping?: boolean;
  isGroup: boolean;
  participants?: { id: string; name: string }[];
}

interface WhatsAppChatProps {
  contact: Contact | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
}

export function WhatsAppChat({
  contact,
  messages,
  onSendMessage,
  onBack
}: WhatsAppChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };
  
  const getStatusIcon = (status: 'sent' | 'delivered' | 'read') => {
    switch (status) {
      case 'sent':
        return <Check className="h-4 w-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-4 w-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const formatMessageTime = (date: Date) => {
    return format(date, "h:mm a");
  };
  
  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
          <Smile className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-lg font-medium">Select a chat to start messaging</p>
        <p className="text-sm text-gray-400 mt-2">
          Start a new conversation or continue an existing one
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center">
          <button 
            className="p-2 rounded-full hover:bg-gray-200 md:hidden"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img 
                src={contact.avatar} 
                alt={contact.name}
                className="w-full h-full object-cover"
              />
            </div>
            {contact.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-50"></div>
            )}
          </div>
          
          <div className="ml-3">
            <p className="font-medium">{contact.name}</p>
            <p className="text-xs text-gray-500">
              {contact.isTyping 
                ? 'typing...' 
                : contact.isOnline 
                  ? 'online' 
                  : contact.lastSeen 
                    ? `last seen ${format(contact.lastSeen, "h:mm a")}`
                    : ''}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-200">
            <Search className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4"
        style={{ backgroundImage: "url('/images/whatsapp-bg.png')" }}
      >
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.isOutgoing ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-lg p-3 relative",
                  message.isOutgoing 
                    ? "bg-teal-100 rounded-tr-none" 
                    : "bg-white rounded-tl-none"
                )}
              >
                {message.media && (
                  <div className="mb-2">
                    {message.media.type === 'image' && (
                      <div className="rounded-lg overflow-hidden">
                        <img 
                          src={message.media.url} 
                          alt="Image" 
                          className="max-w-full"
                        />
                      </div>
                    )}
                    {message.media.type === 'document' && (
                      <div className="flex items-center bg-white p-2 rounded">
                        <File className="h-6 w-6 text-gray-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium truncate">{message.media.name}</p>
                          <p className="text-xs text-gray-500">{message.media.size} KB</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <p className="text-sm">{message.text}</p>
                
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-500 mr-1">
                    {formatMessageTime(message.time)}
                  </span>
                  {message.isOutgoing && getStatusIcon(message.status)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message Input */}
      <div className="p-2 bg-gray-50">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <button
            type="button"
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200"
          >
            <Smile className="h-6 w-6" />
          </button>
          
          <button
            type="button"
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200"
          >
            <Paperclip className="h-6 w-6" />
          </button>
          
          <div className="flex-1 mx-2">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full py-2 px-4 bg-white rounded-full border-none focus:outline-none focus:ring-1 focus:ring-teal-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>
          
          <button
            type={newMessage.trim() ? "submit" : "button"}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200"
          >
            {newMessage.trim() ? (
              <Send className="h-6 w-6 text-teal-500" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 