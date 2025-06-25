import { useState, useEffect, useMemo } from 'react';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  source: string;
  status: string;
  tags: string[];
  createdAt: Date;
  lastContactedAt?: Date;
  notes: string;
}

interface UseLeadsOptions {
  initialStatus?: string | 'all';
  pageSize?: number;
}

export function useLeads({ initialStatus, pageSize = 5 }: UseLeadsOptions = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [activeStatus, setActiveStatus] = useState<string | 'all'>(initialStatus || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Lead>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Generate more mock data for testing pagination
  const mockLeads: Lead[] = useMemo(() => {
    const baseLeads = [
      {
        id: "1",
        name: "John Smith",
        company: "Acme Inc",
        email: "john@acme.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, San Francisco, CA",
        website: "acme.com",
        source: "Website",
        status: "New",
        tags: ["Software", "Enterprise"],
        createdAt: new Date(2023, 5, 15),
        lastContactedAt: new Date(2023, 5, 20),
        notes: "Initial contact made through website form. Interested in enterprise solution."
      },
      {
        id: "2",
        name: "Jane Doe",
        company: "XYZ Corp",
        email: "jane@xyz.com",
        phone: "+1 (555) 987-6543",
        address: "456 Market St, New York, NY",
        website: "xyzcorp.com",
        source: "Referral",
        status: "Contacted",
        tags: ["Hardware", "SMB"],
        createdAt: new Date(2023, 5, 10),
        lastContactedAt: new Date(2023, 5, 18),
        notes: "Referred by existing client. Looking for hardware solutions for small business."
      },
      {
        id: "3",
        name: "Robert Johnson",
        company: "Tech Solutions",
        email: "robert@techsolutions.com",
        phone: "+1 (555) 456-7890",
        address: "789 Broadway, Chicago, IL",
        website: "techsolutions.com",
        source: "Trade Show",
        status: "Qualified",
        tags: ["Software", "Healthcare"],
        createdAt: new Date(2023, 4, 25),
        lastContactedAt: new Date(2023, 5, 15),
        notes: "Met at TechExpo. Interested in healthcare software solutions."
      },
      {
        id: "4",
        name: "Emily Williams",
        company: "Global Services",
        email: "emily@globalservices.com",
        phone: "+1 (555) 234-5678",
        address: "321 Park Ave, Boston, MA",
        website: "globalservices.com",
        source: "Email Campaign",
        status: "Proposal",
        tags: ["Consulting", "Enterprise"],
        createdAt: new Date(2023, 4, 20),
        lastContactedAt: new Date(2023, 5, 12),
        notes: "Responded to Q2 email campaign. Requested proposal for enterprise consulting services."
      },
      {
        id: "5",
        name: "Michael Brown",
        company: "Innovative Solutions",
        email: "michael@innovative.com",
        phone: "+1 (555) 876-5432",
        address: "654 Pine St, Seattle, WA",
        website: "innovative.com",
        source: "Social Media",
        status: "Negotiation",
        tags: ["Software", "Startup"],
        createdAt: new Date(2023, 4, 15),
        lastContactedAt: new Date(2023, 5, 10),
        notes: "Found us through LinkedIn. Startup looking for software solutions. Price negotiation in progress."
      },
      {
        id: "6",
        name: "Sarah Miller",
        company: "City Hospital",
        email: "sarah@cityhospital.org",
        phone: "+1 (555) 345-6789",
        address: "987 Oak St, Austin, TX",
        website: "cityhospital.org",
        source: "Referral",
        status: "Won",
        tags: ["Healthcare", "Enterprise"],
        createdAt: new Date(2023, 3, 10),
        lastContactedAt: new Date(2023, 5, 5),
        notes: "Referred by Dr. Johnson. Deal closed for enterprise healthcare solution."
      },
      {
        id: "7",
        name: "David Wilson",
        company: "Retail Chains Inc",
        email: "david@retailchains.com",
        phone: "+1 (555) 567-8901",
        address: "567 Elm St, Miami, FL",
        website: "retailchains.com",
        source: "Cold Call",
        status: "Lost",
        tags: ["Retail", "Enterprise"],
        createdAt: new Date(2023, 3, 5),
        lastContactedAt: new Date(2023, 4, 28),
        notes: "Lost to competitor due to pricing concerns."
      }
    ];
    
    // Generate additional leads for testing pagination
    const additionalLeads: Lead[] = [];
    const statuses = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
    const sources = ["Website", "Referral", "Trade Show", "Email Campaign", "Social Media", "Cold Call"];
    const companies = ["Tech Corp", "Global Industries", "Modern Solutions", "Digital Innovations", "Smart Systems", "Future Tech"];
    
    for (let i = 8; i <= 25; i++) {
      additionalLeads.push({
        id: i.toString(),
        name: `Lead ${i}`,
        company: companies[Math.floor(Math.random() * companies.length)],
        email: `lead${i}@example.com`,
        phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        address: `${Math.floor(100 + Math.random() * 900)} Example St, City, State`,
        website: `example${i}.com`,
        source: sources[Math.floor(Math.random() * sources.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        tags: ["Sample", `Tag${i}`],
        createdAt: new Date(2023, Math.floor(Math.random() * 6), Math.floor(1 + Math.random() * 28)),
        lastContactedAt: new Date(2023, Math.floor(Math.random() * 6), Math.floor(1 + Math.random() * 28)),
        notes: `This is a sample lead ${i} for testing pagination.`
      });
    }
    
    return [...baseLeads, ...additionalLeads];
  }, []);

  // Load leads on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLeads(mockLeads);
      setTotalLeads(mockLeads.length);
      setLoading(false);
    }, 500);
  }, [mockLeads]);

  // Filter leads based on active status and search query
  const filteredLeads = useMemo(() => {
    return mockLeads.filter((lead) => {
      // Filter by status
      const statusMatch = activeStatus === 'all' || lead.status.toLowerCase() === activeStatus.toLowerCase();
      
      // Filter by search query
      const searchLower = searchQuery.toLowerCase();
      const searchMatch = searchQuery === '' || 
        lead.name.toLowerCase().includes(searchLower) ||
        lead.company.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.phone.toLowerCase().includes(searchLower);
      
      return statusMatch && searchMatch;
    });
  }, [mockLeads, activeStatus, searchQuery]);

  // Sort filtered leads
  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === bValue) return 0;
      
      if (sortField === 'createdAt' || sortField === 'lastContactedAt') {
        const aDate = aValue as Date;
        const bDate = bValue as Date;
        return sortDirection === 'asc' 
          ? aDate.getTime() - bDate.getTime() 
          : bDate.getTime() - aDate.getTime();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  }, [filteredLeads, sortField, sortDirection]);

  // Paginate leads
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedLeads.slice(startIndex, endIndex);
  }, [sortedLeads, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredLeads.length / pageSize);
  }, [filteredLeads, pageSize]);

  // Handle sort change
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
    return mockLeads.find(lead => lead.id === id) || null;
  };

  // Update lead
  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, ...updates } : lead
    ));
  };

  return {
    leads: paginatedLeads,
    loading,
    totalLeads: filteredLeads.length,
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
    updateLead
  };
} 