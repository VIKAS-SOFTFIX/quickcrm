"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export interface WhatsAppContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  isGroup: boolean;
  lastSeen?: Date;
  isTyping?: boolean;
  participants?: { id: string; name: string }[];
}

export interface WhatsAppMessage {
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

export function useWhatsApp() {
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [messages, setMessages] = useState<Record<string, WhatsAppMessage[]>>({});
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch mock contacts and messages
  useEffect(() => {
    const mockContacts: WhatsAppContact[] = [
      {
        id: '1',
        name: 'John Smith',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        lastMessage: 'Hey, how are you doing?',
        time: '10:30 AM',
        unreadCount: 2,
        isOnline: true,
        isGroup: false,
        lastSeen: new Date()
      },
      {
        id: '2',
        name: 'Marketing Team',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        lastMessage: 'Alice: The campaign is ready for review',
        time: 'Yesterday',
        unreadCount: 0,
        isOnline: false,
        isGroup: true,
        participants: [
          { id: 'a1', name: 'Alice' },
          { id: 'b2', name: 'Bob' },
          { id: 'c3', name: 'Charlie' }
        ]
      },
      {
        id: '3',
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        lastMessage: 'Let me check and get back to you',
        time: 'Yesterday',
        unreadCount: 0,
        isOnline: true,
        isGroup: false,
        isTyping: true
      },
      {
        id: '4',
        name: 'Tech Support',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
        lastMessage: 'Your ticket #45678 has been resolved',
        time: 'Monday',
        unreadCount: 0,
        isOnline: false,
        isGroup: false
      },
      {
        id: '5',
        name: 'David Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
        lastMessage: 'The invoice has been paid',
        time: '08/15/23',
        unreadCount: 0,
        isOnline: false,
        isGroup: false
      }
    ];
    
    const mockMessages: Record<string, WhatsAppMessage[]> = {
      '1': [
        {
          id: '101',
          text: 'Hey, how are you doing?',
          time: new Date(Date.now() - 3600000),
          isOutgoing: false,
          status: 'read'
        },
        {
          id: '102',
          text: 'I\'m good, thanks! How about you?',
          time: new Date(Date.now() - 3500000),
          isOutgoing: true,
          status: 'read'
        },
        {
          id: '103',
          text: 'Great! I wanted to ask about the project timeline.',
          time: new Date(Date.now() - 3400000),
          isOutgoing: false,
          status: 'read'
        },
        {
          id: '104',
          text: 'Sure, I can send you the updated schedule.',
          time: new Date(Date.now() - 3300000),
          isOutgoing: true,
          status: 'read'
        },
        {
          id: '105',
          text: 'Here\'s the document with all the details.',
          time: new Date(Date.now() - 3200000),
          isOutgoing: true,
          status: 'read',
          media: {
            type: 'document',
            url: '#',
            name: 'Project_Timeline.pdf',
            size: 2540
          }
        }
      ],
      '2': [
        {
          id: '201',
          text: 'Hi team, here\'s the latest marketing report',
          time: new Date(Date.now() - 86400000),
          isOutgoing: false,
          status: 'read'
        },
        {
          id: '202',
          text: 'Thanks for sharing!',
          time: new Date(Date.now() - 85000000),
          isOutgoing: true,
          status: 'read'
        },
        {
          id: '203',
          text: 'The campaign is ready for review',
          time: new Date(Date.now() - 84000000),
          isOutgoing: false,
          status: 'read'
        }
      ],
      '3': [
        {
          id: '301',
          text: 'Do you have the latest sales numbers?',
          time: new Date(Date.now() - 172800000),
          isOutgoing: true,
          status: 'read'
        },
        {
          id: '302',
          text: 'Yes, here\'s a screenshot of the dashboard',
          time: new Date(Date.now() - 171800000),
          isOutgoing: false,
          status: 'read',
          media: {
            type: 'image',
            url: 'https://via.placeholder.com/300x200',
            name: 'Dashboard.png',
            size: 1240
          }
        },
        {
          id: '303',
          text: 'Let me check and get back to you',
          time: new Date(Date.now() - 171700000),
          isOutgoing: false,
          status: 'read'
        }
      ]
    };
    
    setContacts(mockContacts);
    setMessages(mockMessages);
    setLoading(false);
  }, []);
  
  // Get active contact
  const activeContact = activeContactId 
    ? contacts.find(contact => contact.id === activeContactId) || null
    : null;
  
  // Get messages for active contact
  const activeMessages = activeContactId && messages[activeContactId] 
    ? messages[activeContactId] 
    : [];
  
  // Send a new message
  const sendMessage = (text: string) => {
    if (!activeContactId) return;
    
    const newMessage: WhatsAppMessage = {
      id: uuidv4(),
      text,
      time: new Date(),
      isOutgoing: true,
      status: 'sent'
    };
    
    // Add message to the conversation
    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));
    
    // Update contact's last message
    setContacts(prev => 
      prev.map(contact => 
        contact.id === activeContactId
          ? { 
              ...contact, 
              lastMessage: text,
              time: 'Just now'
            }
          : contact
      )
    );
    
    // Simulate message status changes
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeContactId]: prev[activeContactId].map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      }));
    }, 1000);
    
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeContactId]: prev[activeContactId].map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        )
      }));
    }, 2000);
    
    // Simulate reply for demo purposes
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const contact = contacts.find(c => c.id === activeContactId);
        if (contact) {
          // Show typing indicator
          setContacts(prev => 
            prev.map(c => 
              c.id === activeContactId ? { ...c, isTyping: true } : c
            )
          );
          
          // Add reply after delay
          setTimeout(() => {
            const replies = [
              "Thanks for the message!",
              "I'll get back to you soon.",
              "Got it, thanks!",
              "Let me check on that.",
              "Perfect, thank you!"
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            
            const replyMessage: WhatsAppMessage = {
              id: uuidv4(),
              text: randomReply,
              time: new Date(),
              isOutgoing: false,
              status: 'read'
            };
            
            setMessages(prev => ({
              ...prev,
              [activeContactId]: [...prev[activeContactId], replyMessage]
            }));
            
            setContacts(prev => 
              prev.map(c => 
                c.id === activeContactId
                  ? { 
                      ...c, 
                      lastMessage: randomReply,
                      time: 'Just now',
                      isTyping: false
                    }
                  : c
              )
            );
          }, 2000);
        }
      }, 3000);
    }
  };
  
  // Create a new chat
  const createChat = (contact: Omit<WhatsAppContact, 'id' | 'lastMessage' | 'time' | 'unreadCount'>) => {
    const newContact: WhatsAppContact = {
      ...contact,
      id: uuidv4(),
      lastMessage: '',
      time: 'New chat',
      unreadCount: 0
    };
    
    setContacts(prev => [newContact, ...prev]);
    setActiveContactId(newContact.id);
    
    return newContact.id;
  };
  
  // Mark messages as read
  const markAsRead = (contactId: string) => {
    if (!contactId) return;
    
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId
          ? { ...contact, unreadCount: 0 }
          : contact
      )
    );
  };
  
  return {
    contacts,
    messages: activeMessages,
    activeContact,
    activeContactId,
    setActiveContactId,
    sendMessage,
    createChat,
    markAsRead,
    loading
  };
} 