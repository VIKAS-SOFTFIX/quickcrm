import { useState, useEffect, useMemo } from 'react';

export interface Lead {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  assignedTo: {
    id: string;
    name: string;
    avatar?: string;
  };
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  source: string;
  value: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  lastContact?: Date;
}

interface UseLeadsOptions {
  initialStatus?: Lead['status'] | 'all';
  pageSize?: number;
}

export function useLeads({ initialStatus, pageSize = 10 }: UseLeadsOptions = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [activeStatus, setActiveStatus] = useState<Lead['status'] | 'all'>(initialStatus || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Lead>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Mock data for demonstration
  const mockLeads: Lead[] = useMemo(() => [
    {
      id: '1',
      name: 'John Smith',
      company: 'Acme Corp',
      contact: 'CEO',
      email: 'john@acmecorp.com',
      phone: '(555) 123-4567',
      assignedTo: {
        id: '101',
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
      },
      status: 'new',
      source: 'Website',
      value: 15000,
      notes: 'Interested in our enterprise plan',
      createdAt: new Date('2023-06-15'),
      updatedAt: new Date('2023-06-15'),
    },
    {
      id: '2',
      name: 'Emily Davis',
      company: 'TechGiant Inc',
      contact: 'Marketing Director',
      email: 'emily@techgiant.com',
      phone: '(555) 987-6543',
      assignedTo: {
        id: '102',
        name: 'Michael Chen',
        avatar: '/avatars/michael.jpg',
      },
      status: 'contacted',
      source: 'LinkedIn',
      value: 25000,
      notes: 'Had initial call, follow up next week',
      createdAt: new Date('2023-06-10'),
      updatedAt: new Date('2023-06-14'),
      lastContact: new Date('2023-06-14'),
    },
    {
      id: '3',
      name: 'Robert Johnson',
      company: 'Global Services Ltd',
      contact: 'CTO',
      email: 'robert@globalservices.com',
      phone: '(555) 456-7890',
      assignedTo: {
        id: '103',
        name: 'Jessica Lee',
        avatar: '/avatars/jessica.jpg',
      },
      status: 'qualified',
      source: 'Referral',
      value: 50000,
      notes: 'Needs custom integration solution',
      createdAt: new Date('2023-06-05'),
      updatedAt: new Date('2023-06-12'),
      lastContact: new Date('2023-06-12'),
    },
    {
      id: '4',
      name: 'Lisa Wang',
      company: 'Innovative Solutions',
      contact: 'CEO',
      email: 'lisa@innovative.com',
      phone: '(555) 789-0123',
      assignedTo: {
        id: '101',
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
      },
      status: 'proposal',
      source: 'Conference',
      value: 75000,
      notes: 'Proposal sent, awaiting feedback',
      createdAt: new Date('2023-05-28'),
      updatedAt: new Date('2023-06-10'),
      lastContact: new Date('2023-06-10'),
    },
    {
      id: '5',
      name: 'David Wilson',
      company: 'MegaCorp',
      contact: 'Procurement Manager',
      email: 'david@megacorp.com',
      phone: '(555) 234-5678',
      assignedTo: {
        id: '102',
        name: 'Michael Chen',
        avatar: '/avatars/michael.jpg',
      },
      status: 'won',
      source: 'Website',
      value: 120000,
      notes: 'Contract signed, implementation starting next month',
      createdAt: new Date('2023-05-15'),
      updatedAt: new Date('2023-06-08'),
      lastContact: new Date('2023-06-08'),
    },
    {
      id: '6',
      name: 'Maria Rodriguez',
      company: 'StartUp Ventures',
      contact: 'Founder',
      email: 'maria@startup.com',
      phone: '(555) 345-6789',
      assignedTo: {
        id: '103',
        name: 'Jessica Lee',
        avatar: '/avatars/jessica.jpg',
      },
      status: 'new',
      source: 'Email Campaign',
      value: 10000,
      notes: 'Looking for affordable solution',
      createdAt: new Date('2023-06-16'),
      updatedAt: new Date('2023-06-16'),
    },
    {
      id: '7',
      name: 'Thomas Brown',
      company: 'Local Business Inc',
      contact: 'Owner',
      email: 'thomas@localbusiness.com',
      phone: '(555) 456-7890',
      assignedTo: {
        id: '101',
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
      },
      status: 'contacted',
      source: 'Google Ads',
      value: 5000,
      notes: 'Scheduled demo for next week',
      createdAt: new Date('2023-06-12'),
      updatedAt: new Date('2023-06-15'),
      lastContact: new Date('2023-06-15'),
    },
    {
      id: '8',
      name: 'James Miller',
      company: 'Enterprise Corp',
      contact: 'IT Director',
      email: 'james@enterprise.com',
      phone: '(555) 567-8901',
      assignedTo: {
        id: '102',
        name: 'Michael Chen',
        avatar: '/avatars/michael.jpg',
      },
      status: 'qualified',
      source: 'LinkedIn',
      value: 80000,
      notes: 'Needs enterprise-level solution',
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2023-06-11'),
      lastContact: new Date('2023-06-11'),
    },
    {
      id: '9',
      name: 'Jennifer Lee',
      company: 'Creative Designs',
      contact: 'Creative Director',
      email: 'jennifer@creativedesigns.com',
      phone: '(555) 678-9012',
      assignedTo: {
        id: '103',
        name: 'Jessica Lee',
        avatar: '/avatars/jessica.jpg',
      },
      status: 'proposal',
      source: 'Referral',
      value: 30000,
      notes: 'Proposal under review',
      createdAt: new Date('2023-05-20'),
      updatedAt: new Date('2023-06-09'),
      lastContact: new Date('2023-06-09'),
    },
    {
      id: '10',
      name: 'Michael Thompson',
      company: 'Thompson & Co',
      contact: 'CEO',
      email: 'michael@thompson.com',
      phone: '(555) 789-0123',
      assignedTo: {
        id: '101',
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
      },
      status: 'won',
      source: 'Conference',
      value: 100000,
      notes: 'Deal closed, implementation in progress',
      createdAt: new Date('2023-05-10'),
      updatedAt: new Date('2023-06-05'),
      lastContact: new Date('2023-06-05'),
    },
    {
      id: '11',
      name: 'Sarah Adams',
      company: 'Adams Consulting',
      contact: 'Principal',
      email: 'sarah@adamsconsulting.com',
      phone: '(555) 890-1234',
      assignedTo: {
        id: '102',
        name: 'Michael Chen',
        avatar: '/avatars/michael.jpg',
      },
      status: 'lost',
      source: 'Website',
      value: 45000,
      notes: 'Chose competitor solution due to pricing',
      createdAt: new Date('2023-05-25'),
      updatedAt: new Date('2023-06-07'),
      lastContact: new Date('2023-06-07'),
    },
    {
      id: '12',
      name: 'Daniel Kim',
      company: 'Kim Technologies',
      contact: 'CTO',
      email: 'daniel@kimtech.com',
      phone: '(555) 901-2345',
      assignedTo: {
        id: '103',
        name: 'Jessica Lee',
        avatar: '/avatars/jessica.jpg',
      },
      status: 'new',
      source: 'Email Campaign',
      value: 60000,
      notes: 'Interested in AI features',
      createdAt: new Date('2023-06-17'),
      updatedAt: new Date('2023-06-17'),
    },
  ], []);

  // Filter and sort leads based on current state
  const filteredLeads = useMemo(() => {
    let result = [...mockLeads];
    
    // Filter by status
    if (activeStatus !== 'all') {
      result = result.filter(lead => lead.status === activeStatus);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(lead => 
        lead.name.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query)
      );
    }
    
    // Sort
    result.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      // Handle potentially undefined values
      if (fieldA === undefined && fieldB === undefined) return 0;
      if (fieldA === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (fieldB === undefined) return sortDirection === 'asc' ? 1 : -1;
      
      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [mockLeads, activeStatus, searchQuery, sortField, sortDirection]);

  // Paginate leads
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLeads.slice(startIndex, startIndex + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = useMemo(() => 
    Math.ceil(filteredLeads.length / pageSize),
    [filteredLeads, pageSize]
  );

  // Load leads (simulating API call)
  useEffect(() => {
    setLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      setLeads(paginatedLeads);
      setTotalLeads(filteredLeads.length);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [paginatedLeads, filteredLeads]);

  // Handle sorting
  const handleSort = (field: keyof Lead) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get lead by ID
  const getLeadById = (id: string) => {
    return mockLeads.find(lead => lead.id === id);
  };

  // Update lead
  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === id ? { ...lead, ...updates, updatedAt: new Date() } : lead
      )
    );
  };

  // Assign lead to team member
  const assignLead = (leadId: string, assigneeId: string, assigneeName: string, assigneeAvatar?: string) => {
    updateLead(leadId, {
      assignedTo: {
        id: assigneeId,
        name: assigneeName,
        avatar: assigneeAvatar
      }
    });
  };

  return {
    leads,
    loading,
    totalLeads,
    currentPage,
    setCurrentPage,
    totalPages,
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    handleSort,
    getLeadById,
    updateLead,
    assignLead
  };
} 