"use client";

import { useState } from "react";
import { Search, MoreVertical, Plus, Filter, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from 'next/image';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  isGroup: boolean;
}

interface WhatsAppSidebarProps {
  contacts: Contact[];
  activeContactId: string | null;
  onContactSelect: (contactId: string) => void;
  onNewChat: () => void;
}

export function WhatsAppSidebar({
  contacts,
  activeContactId,
  onContactSelect,
  onNewChat
}: WhatsAppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white">
            {/* This would be the user's avatar */}
            <span className="font-semibold">U</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-200">
            <Archive className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-gray-200"
            onClick={onNewChat}
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Search */}
      <div className="p-2 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full py-2 pl-10 pr-4 bg-white rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-teal-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Filter className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-sm">No chats found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                className={cn(
                  "w-full flex items-center p-3 hover:bg-gray-50 transition-colors",
                  activeContactId === contact.id && "bg-gray-100"
                )}
                onClick={() => onContactSelect(contact.id)}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    <Image 
                      src={contact.avatar} 
                      alt={contact.name}
                      className="w-full h-full object-cover"
                      width={48}
                      height={48}
                    />
                  </div>
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-medium truncate">{contact.name}</p>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {contact.time}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-500 truncate pr-2">
                      {contact.lastMessage}
                    </p>
                    
                    {contact.unreadCount > 0 && (
                      <div className="bg-teal-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                        {contact.unreadCount > 9 ? '9+' : contact.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 