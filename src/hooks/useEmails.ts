import { useState, useEffect, useMemo } from 'react';

export interface EmailAccount {
  id: string;
  email: string;
  name: string;
  provider: 'gmail' | 'outlook' | 'yahoo' | 'custom';
  isConnected: boolean;
  lastSynced?: Date;
  unreadCount: number;
  color: string;
}

export interface Email {
  id: string;
  accountId: string;
  from: {
    email: string;
    name: string;
  };
  to: Array<{
    email: string;
    name?: string;
  }>;
  cc?: Array<{
    email: string;
    name?: string;
  }>;
  bcc?: Array<{
    email: string;
    name?: string;
  }>;
  subject: string;
  body: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  labels: string[];
  attachments: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }>;
  date: Date;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam' | 'archive' | string;
}

interface UseEmailsOptions {
  initialFolder?: string;
  initialAccountId?: string;
  pageSize?: number;
}

export function useEmails({ initialFolder = 'inbox', initialAccountId, pageSize = 20 }: UseEmailsOptions = {}) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmails, setTotalEmails] = useState(0);
  const [activeFolder, setActiveFolder] = useState<string>(initialFolder);
  const [activeAccountId, setActiveAccountId] = useState<string | undefined>(initialAccountId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  
  // Mock email accounts
  const mockAccounts: EmailAccount[] = useMemo(() => [
    {
      id: '1',
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      provider: 'gmail',
      isConnected: true,
      lastSynced: new Date(),
      unreadCount: 12,
      color: '#DB4437'
    },
    {
      id: '2',
      email: 'marketing@acmecorp.com',
      name: 'Marketing',
      provider: 'outlook',
      isConnected: true,
      lastSynced: new Date(),
      unreadCount: 5,
      color: '#0078D4'
    },
    {
      id: '3',
      email: 'support@acmecorp.com',
      name: 'Customer Support',
      provider: 'custom',
      isConnected: true,
      lastSynced: new Date(),
      unreadCount: 28,
      color: '#5F6368'
    }
  ], []);
  
  // Mock email data
  const mockEmails: Email[] = useMemo(() => {
    const emails: Email[] = [];
    
    // Generate mock emails for each account
    mockAccounts.forEach(account => {
      // Inbox emails
      for (let i = 0; i < 15; i++) {
        emails.push({
          id: `${account.id}-inbox-${i}`,
          accountId: account.id,
          from: {
            email: `sender${i}@example.com`,
            name: `Sender ${i}`
          },
          to: [{
            email: account.email,
            name: account.name
          }],
          subject: `Email subject ${i} for ${account.name}`,
          body: `<p>This is the body of email ${i} for ${account.name}. It contains some <strong>formatted text</strong> and can be quite long.</p>`,
          isRead: i % 3 !== 0, // Make some emails unread
          isStarred: i % 5 === 0, // Make some emails starred
          isArchived: false,
          labels: i % 4 === 0 ? ['important'] : [],
          attachments: i % 7 === 0 ? [{
            id: `attachment-${i}`,
            name: `document-${i}.pdf`,
            size: 1024 * 1024 * 2, // 2MB
            type: 'application/pdf',
            url: '#'
          }] : [],
          date: new Date(Date.now() - i * 60 * 60 * 1000), // Hours ago
          folder: 'inbox'
        });
      }
      
      // Sent emails
      for (let i = 0; i < 10; i++) {
        emails.push({
          id: `${account.id}-sent-${i}`,
          accountId: account.id,
          from: {
            email: account.email,
            name: account.name
          },
          to: [{
            email: `recipient${i}@example.com`,
            name: `Recipient ${i}`
          }],
          subject: `Sent email ${i} from ${account.name}`,
          body: `<p>This is a sent email ${i} from ${account.name}.</p>`,
          isRead: true,
          isStarred: false,
          isArchived: false,
          labels: [],
          attachments: [],
          date: new Date(Date.now() - i * 120 * 60 * 1000), // Hours ago
          folder: 'sent'
        });
      }
      
      // Draft emails
      for (let i = 0; i < 3; i++) {
        emails.push({
          id: `${account.id}-draft-${i}`,
          accountId: account.id,
          from: {
            email: account.email,
            name: account.name
          },
          to: [{
            email: `draft-recipient${i}@example.com`,
            name: `Draft Recipient ${i}`
          }],
          subject: i === 0 ? '' : `Draft ${i}`,
          body: `<p>This is a draft email ${i}.</p>`,
          isRead: true,
          isStarred: false,
          isArchived: false,
          labels: [],
          attachments: [],
          date: new Date(Date.now() - i * 30 * 60 * 1000), // Hours ago
          folder: 'drafts'
        });
      }
    });
    
    return emails;
  }, [mockAccounts]);
  
  // Filter emails based on current state
  const filteredEmails = useMemo(() => {
    let result = [...mockEmails];
    
    // Filter by account if selected
    if (activeAccountId) {
      result = result.filter(email => email.accountId === activeAccountId);
    }
    
    // Filter by folder
    result = result.filter(email => email.folder === activeFolder);
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(email => 
        email.subject.toLowerCase().includes(query) ||
        email.from.email.toLowerCase().includes(query) ||
        email.from.name.toLowerCase().includes(query) ||
        email.body.toLowerCase().includes(query)
      );
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return result;
  }, [mockEmails, activeAccountId, activeFolder, searchQuery]);
  
  // Paginate emails
  const paginatedEmails = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredEmails.slice(startIndex, startIndex + pageSize);
  }, [filteredEmails, currentPage, pageSize]);
  
  // Calculate total pages
  const totalPages = useMemo(() => 
    Math.ceil(filteredEmails.length / pageSize),
    [filteredEmails, pageSize]
  );
  
  // Load emails (simulating API call)
  useEffect(() => {
    setLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      setEmails(paginatedEmails);
      setAccounts(mockAccounts);
      setTotalEmails(filteredEmails.length);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [paginatedEmails, filteredEmails, mockAccounts]);
  
  // Toggle email selection
  const toggleEmailSelection = (emailId: string) => {
    setSelectedEmails(prev => {
      if (prev.includes(emailId)) {
        return prev.filter(id => id !== emailId);
      } else {
        return [...prev, emailId];
      }
    });
  };
  
  // Select all displayed emails
  const selectAllEmails = () => {
    if (selectedEmails.length === paginatedEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(paginatedEmails.map(email => email.id));
    }
  };
  
  // Mark emails as read/unread
  const markAsRead = (emailIds: string[], read = true) => {
    setEmails(prev => 
      prev.map(email => 
        emailIds.includes(email.id) ? { ...email, isRead: read } : email
      )
    );
  };
  
  // Star/unstar emails
  const toggleStar = (emailId: string) => {
    setEmails(prev => 
      prev.map(email => 
        email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
      )
    );
  };
  
  // Move emails to folder
  const moveToFolder = (emailIds: string[], folder: string) => {
    setEmails(prev => 
      prev.map(email => 
        emailIds.includes(email.id) ? { ...email, folder } : email
      )
    );
    
    // Clear selection after moving
    setSelectedEmails([]);
  };
  
  // Add new email account
  const addEmailAccount = (account: Omit<EmailAccount, 'id' | 'isConnected' | 'unreadCount'>) => {
    const newAccount: EmailAccount = {
      id: Date.now().toString(),
      ...account,
      isConnected: true,
      lastSynced: new Date(),
      unreadCount: 0
    };
    
    setAccounts(prev => [...prev, newAccount]);
  };
  
  // Remove email account
  const removeEmailAccount = (accountId: string) => {
    setAccounts(prev => prev.filter(account => account.id !== accountId));
    
    // If the active account is removed, clear the active account
    if (activeAccountId === accountId) {
      setActiveAccountId(undefined);
    }
  };
  
  // Get unread count for a specific folder and account
  const getUnreadCount = (folder: string, accountId?: string) => {
    return mockEmails.filter(email => 
      (!accountId || email.accountId === accountId) && 
      email.folder === folder && 
      !email.isRead
    ).length;
  };
  
  return {
    emails,
    accounts,
    loading,
    totalEmails,
    currentPage,
    setCurrentPage,
    totalPages,
    activeFolder,
    setActiveFolder,
    activeAccountId,
    setActiveAccountId,
    searchQuery,
    setSearchQuery,
    selectedEmails,
    toggleEmailSelection,
    selectAllEmails,
    markAsRead,
    toggleStar,
    moveToFolder,
    addEmailAccount,
    removeEmailAccount,
    getUnreadCount
  };
} 