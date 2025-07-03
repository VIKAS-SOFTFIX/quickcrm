"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar,
  LayoutDashboard,
  Users,
  Settings,
  Mail,
  MessageSquare,
  Megaphone,
  Search,
  Headphones,
  CreditCard,
  UserPlus,
  Building2,
  PhoneCall,
  Video,
  BrainCircuit,
  BarChart,
  BarChart3,
  MessagesSquare,
  Ticket,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ChevronDown,
  Target,
  Globe,
  PieChart,
  FileText,
  MessageCircle,
  SendHorizontal,
  Share2,
  Shield,
  Lock
} from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isSubmenu?: boolean;
  isActive?: boolean;
}

const SidebarItem = ({ href, icon, label, isSubmenu = false, isActive: forcedActive }: SidebarItemProps) => {
  const pathname = usePathname();
  const { isExpanded } = useSidebar();
  const isActive = forcedActive !== undefined ? forcedActive : pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center space-x-3 py-2 rounded-lg transition-colors relative group",
        isSubmenu ? "pl-10" : "pl-4",
        isActive
          ? "bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-teal-700"
          : "hover:bg-teal-50 text-gray-600 hover:text-teal-700"
      )}
    >
      <span className="w-5 h-5 flex-shrink-0">{icon}</span>
      {isExpanded && (
        <span className={`text-sm font-medium transition-all ${isSubmenu ? "text-sm" : ""}`}>
          {label}
        </span>
      )}
      {!isExpanded && (
        <div className="absolute left-full ml-6 bg-white px-2 py-1 rounded-md shadow-md invisible opacity-0 translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all z-50">
          <span className="whitespace-nowrap text-sm">{label}</span>
        </div>
      )}
      {href.includes("coming-soon") && isExpanded && (
        <span className="ml-auto mr-4 text-xs bg-gradient-to-r from-teal-400 to-emerald-400 text-white px-2 py-0.5 rounded-full">
          Soon
        </span>
      )}
    </Link>
  );
};

const SidebarSection = ({ title }: { title: string }) => {
  const { isExpanded } = useSidebar();
  
  if (!isExpanded) return null;
  
  return (
    <div className="px-4 py-2">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {title}
      </h3>
    </div>
  );
};

export function Sidebar() {
  const { isExpanded, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    overview: true,
    pipeline: true,
    communications: true,
    marketing: true,
    seo: true,
    user_management: true,
    administration: true,
  });

  // Check if mobile and handle resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile && isExpanded) {
        toggleSidebar();
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded, toggleSidebar]);
  
  // Close sidebar on navigation on mobile
  useEffect(() => {
    if (isMobile && isExpanded) {
      toggleSidebar();
    }
  }, [pathname, isMobile, isExpanded, toggleSidebar]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Check if path is active or is a subpath
  const isPathActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <div 
        className={cn(
          "bg-white border-r border-gray-200 h-screen overflow-y-auto fixed left-0 top-0 transition-all duration-300 z-30",
          isExpanded ? "w-64" : "w-16",
          isExpanded && isMobile ? "shadow-xl" : ""
        )}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {isExpanded ? (
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                QuickCRM
              </span>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        <nav className="p-2 space-y-1">
          <SidebarSection title="Overview" />
          <SidebarItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarItem href="/calendar" icon={<Calendar size={20} />} label="Calendar" />

          <SidebarSection title="Pipeline" />
          <SidebarItem 
            href="/leads" 
            icon={<UserPlus size={20} />} 
            label="Leads" 
            isActive={isPathActive('/leads')}
          />
          <SidebarItem href="/enterprise-leads" icon={<Building2 size={20} />} label="Enterprise Leads" />
          <SidebarItem href="/demo-requests" icon={<Video size={20} />} label="Demo Requests" />
          <SidebarItem href="/callbacks" icon={<PhoneCall size={20} />} label="Callback Requests" />
          <SidebarItem href="/consultations" icon={<Headphones size={20} />} label="Expert Consultation" />

          <SidebarSection title="Communications" />
          <SidebarItem href="/email" icon={<Mail size={20} />} label="Email Box" />
          <SidebarItem href="/whatsapp" icon={<MessageSquare size={20} />} label="WhatsApp Chat" />

          <SidebarSection title="Marketing" />
          <SidebarItem href="/email-marketing" icon={<SendHorizontal size={20} />} label="Email Marketing" />
          <SidebarItem href="/coming-soon" icon={<MessageSquare size={20} />} label="WhatsApp Marketing" />
          <SidebarItem href="/coming-soon" icon={<Share2 size={20} />} label="Meta Ads" />
          <SidebarItem href="/coming-soon" icon={<BarChart3 size={20} />} label="Google Ads" />
          <SidebarItem href="/coming-soon" icon={<BarChart size={20} />} label="Analytics" />

          <SidebarSection title="SEO Tools" />
          <SidebarItem href="/coming-soon" icon={<Globe size={20} />} label="Google Business" />
          <SidebarItem
            href="/coming-soon"
            icon={<BrainCircuit size={20} />}
            label="AI SEO Automation"
          />
          <SidebarItem href="/coming-soon" icon={<Search size={20} />} label="SEO Analytics" />

          <SidebarSection title="User Management" />
          <SidebarItem 
            href="/user-management/users" 
            icon={<Users size={20} />} 
            label="Users" 
            isActive={isPathActive('/user-management/users')}
          />
          <SidebarItem 
            href="/user-management/roles" 
            icon={<Shield size={20} />} 
            label="Roles" 
            isActive={isPathActive('/user-management/roles')}
          />
          <SidebarItem 
            href="/user-management/permissions" 
            icon={<Lock size={20} />} 
            label="Permissions" 
            isActive={isPathActive('/user-management/permissions')}
          />

          <SidebarSection title="Administration" />
          <SidebarItem href="/settings" icon={<Settings size={20} />} label="Settings" />
          <SidebarItem href="/coming-soon" icon={<Ticket size={20} />} label="Support Tickets" />
          <SidebarItem href="/coming-soon" icon={<CreditCard size={20} />} label="Subscription" />
          <SidebarItem href="/coming-soon" icon={<HelpCircle size={20} />} label="Help & Support" />
        </nav>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isExpanded && isMobile && (
        <div 
          className="fixed inset-0 bg-black/20 z-20" 
          onClick={toggleSidebar}
        />
      )}
      
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 md:hidden z-50 bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-3 rounded-full shadow-lg"
      >
        {isExpanded ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </>
  );
} 