"use client";

import { useState } from "react";
import { useWhatsApp, WhatsAppContact } from "@/hooks/useWhatsApp";
import { WhatsAppSidebar } from "@/components/whatsapp/whatsapp-sidebar";
import { WhatsAppChat } from "@/components/whatsapp/whatsapp-chat";
import { NewChatModal } from "@/components/whatsapp/new-chat-modal";

export default function WhatsAppPage() {
  const {
    contacts,
    messages,
    activeContact,
    activeContactId,
    setActiveContactId,
    sendMessage,
    createChat,
    markAsRead,
    loading
  } = useWhatsApp();
  
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);
  
  const handleContactSelect = (contactId: string) => {
    setActiveContactId(contactId);
    markAsRead(contactId);
    setIsMobileSidebarOpen(false);
  };
  
  const handleBackToList = () => {
    setIsMobileSidebarOpen(true);
  };
  
  const handleNewChat = () => {
    setIsNewChatModalOpen(true);
  };
  
  const handleCreateChat = (contact: Omit<WhatsAppContact, 'id' | 'lastMessage' | 'time' | 'unreadCount'>) => {
    const newContactId = createChat(contact);
    setIsNewChatModalOpen(false);
  };
  
  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };
  
  return (
    <div className="p-4 h-[calc(100vh-64px)] overflow-hidden">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex">
        {/* WhatsApp Sidebar (hidden on mobile when viewing a chat) */}
        <div className={`${!isMobileSidebarOpen ? 'hidden md:block' : 'block'} w-full md:w-1/3 lg:w-1/4 h-full`}>
          <WhatsAppSidebar
            contacts={contacts}
            activeContactId={activeContactId}
            onContactSelect={handleContactSelect}
            onNewChat={handleNewChat}
          />
        </div>
        
        {/* Chat Area */}
        <div className={`${isMobileSidebarOpen ? 'hidden md:block' : 'block'} flex-1 h-full`}>
          <WhatsAppChat
            contact={activeContact}
            messages={messages}
            onSendMessage={handleSendMessage}
            onBack={handleBackToList}
          />
        </div>
      </div>
      
      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleCreateChat}
        existingContacts={contacts}
      />
    </div>
  );
} 