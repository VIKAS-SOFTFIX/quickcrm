"use client";

import { useState } from "react";
import { X, Search, Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppContact } from "@/hooks/useWhatsApp";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (contact: Omit<WhatsAppContact, 'id' | 'lastMessage' | 'time' | 'unreadCount'>) => void;
  existingContacts: WhatsAppContact[];
}

export function NewChatModal({
  isOpen,
  onClose,
  onCreateChat,
  existingContacts
}: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState<'main' | 'new-contact'>('main');
  const [newContact, setNewContact] = useState({
    name: "",
    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
    isOnline: false,
    isGroup: false
  });
  
  // Mock contacts that could be added
  const suggestedContacts = [
    {
      name: 'Emma Thompson',
      avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
      isOnline: true,
      isGroup: false
    },
    {
      name: 'Michael Brown',
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      isOnline: false,
      isGroup: false
    },
    {
      name: 'Sales Team',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
      isOnline: true,
      isGroup: true,
      participants: [
        { id: 'd4', name: 'Daniel' },
        { id: 'e5', name: 'Emily' },
        { id: 'f6', name: 'Frank' }
      ]
    }
  ];
  
  // Filter out contacts that already exist
  const filteredContacts = suggestedContacts.filter(contact => 
    !existingContacts.some(existing => existing.name === contact.name) &&
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateNewContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContact.name.trim()) {
      onCreateChat(newContact);
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {step === 'main' ? (
          <>
            <div className="flex justify-between items-center p-4 bg-teal-600 text-white">
              <h2 className="text-lg font-semibold">New Chat</h2>
              <button 
                className="p-1 rounded-full hover:bg-teal-500"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-3 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search contacts"
                  className="w-full py-2 pl-10 pr-4 bg-white rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-teal-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <button
                className="w-full flex items-center p-3 hover:bg-gray-50"
                onClick={() => setStep('new-contact')}
              >
                <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white">
                  <UserPlus className="h-6 w-6" />
                </div>
                <span className="ml-3 font-medium">New Contact</span>
              </button>
              
              <button
                className="w-full flex items-center p-3 hover:bg-gray-50"
              >
                <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white">
                  <Users className="h-6 w-6" />
                </div>
                <span className="ml-3 font-medium">New Group</span>
              </button>
              
              <div className="border-t border-gray-200 mt-2 pt-2">
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-500">SUGGESTED CONTACTS</h3>
                
                {filteredContacts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No contacts found
                  </div>
                ) : (
                  filteredContacts.map((contact, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center p-3 hover:bg-gray-50"
                      onClick={() => {
                        onCreateChat(contact);
                        onClose();
                      }}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                          <img 
                            src={contact.avatar} 
                            alt={contact.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {contact.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="ml-3">
                        <p className="font-medium">{contact.name}</p>
                        {contact.isGroup && (
                          <p className="text-xs text-gray-500">
                            {contact.participants?.map(p => p.name).join(', ')}
                          </p>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center p-4 bg-teal-600 text-white">
              <h2 className="text-lg font-semibold">New Contact</h2>
              <button 
                className="p-1 rounded-full hover:bg-teal-500"
                onClick={() => setStep('main')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateNewContact} className="p-4">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                    <img 
                      src={newContact.avatar} 
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Contact name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    value={newContact.avatar}
                    onChange={(e) => setNewContact(prev => ({ ...prev, avatar: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isGroup"
                    checked={newContact.isGroup}
                    onChange={(e) => setNewContact(prev => ({ ...prev, isGroup: e.target.checked }))}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isGroup" className="ml-2 block text-sm text-gray-700">
                    This is a group
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('main')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                >
                  Create Contact
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 