"use client";

import { useState } from "react";
import { Email, EmailAccount } from "@/hooks/useEmails";
import { 
  CheckSquare, 
  Square, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Trash2, 
  MailOpen, 
  Mail, 
  Archive,
  Loader2,
  Search,
  AlertCircle,
  Inbox
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface EmailListProps {
  emails: Email[];
  loading: boolean;
  selectedEmails: string[];
  onSelectEmail: (emailId: string) => void;
  onSelectAllEmails: () => void;
  onEmailClick: (emailId: string) => void;
  onToggleStar: (emailId: string) => void;
  onMarkAsRead: (emailIds: string[], read: boolean) => void;
  onMoveToTrash: (emailIds: string[]) => void;
  onMoveToArchive: (emailIds: string[]) => void;
  accounts: EmailAccount[];
  activeFolder: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function EmailList({
  emails,
  loading,
  selectedEmails,
  onSelectEmail,
  onSelectAllEmails,
  onEmailClick,
  onToggleStar,
  onMarkAsRead,
  onMoveToTrash,
  onMoveToArchive,
  accounts,
  activeFolder,
  currentPage,
  totalPages,
  onPageChange,
  searchQuery,
  onSearchChange
}: EmailListProps) {
  const [hoveredEmailId, setHoveredEmailId] = useState<string | null>(null);
  
  const getAccountColor = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account?.color || '#5F6368';
  };
  
  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account?.name || 'Unknown';
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const emailDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (emailDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (now.getFullYear() === date.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };
  
  const formatAttachmentSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  const allSelected = emails.length > 0 && selectedEmails.length === emails.length;
  const someSelected = selectedEmails.length > 0 && selectedEmails.length < emails.length;
  
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 rounded-md hover:bg-gray-100"
            onClick={onSelectAllEmails}
          >
            {allSelected ? (
              <CheckSquare className="h-5 w-5 text-teal-600" />
            ) : someSelected ? (
              <div className="h-5 w-5 border-2 border-gray-400 rounded-sm flex items-center justify-center">
                <div className="h-2 w-2 bg-gray-400"></div>
              </div>
            ) : (
              <Square className="h-5 w-5 text-gray-400" />
            )}
          </button>
          
          {selectedEmails.length > 0 ? (
            <>
              <button 
                className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
                onClick={() => onMarkAsRead(selectedEmails, true)}
                title="Mark as read"
              >
                <MailOpen className="h-5 w-5" />
              </button>
              <button 
                className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
                onClick={() => onMarkAsRead(selectedEmails, false)}
                title="Mark as unread"
              >
                <Mail className="h-5 w-5" />
              </button>
              <button 
                className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
                onClick={() => onMoveToArchive(selectedEmails)}
                title="Archive"
              >
                <Archive className="h-5 w-5" />
              </button>
              <button 
                className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
                onClick={() => onMoveToTrash(selectedEmails)}
                title="Delete"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-500">
                {selectedEmails.length} selected
              </span>
            </>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {currentPage} of {totalPages}
          </span>
          <button
            className={cn(
              "p-1 rounded-md",
              currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100 text-gray-700"
            )}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className={cn(
              "p-1 rounded-md",
              currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100 text-gray-700"
            )}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 text-teal-500 animate-spin mb-2" />
            <p className="text-gray-500">Loading emails...</p>
          </div>
        ) : emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            {searchQuery ? (
              <>
                <Search className="h-12 w-12 mb-2 text-gray-400" />
                <p className="text-lg font-medium">No results found</p>
                <p className="text-sm">Try a different search term</p>
              </>
            ) : activeFolder === 'inbox' ? (
              <>
                <Inbox className="h-12 w-12 mb-2 text-gray-400" />
                <p className="text-lg font-medium">Your inbox is empty</p>
                <p className="text-sm">No emails to display</p>
              </>
            ) : (
              <>
                <AlertCircle className="h-12 w-12 mb-2 text-gray-400" />
                <p className="text-lg font-medium">No emails in this folder</p>
                <p className="text-sm">This folder is empty</p>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {emails.map(email => (
              <div 
                key={email.id}
                className={cn(
                  "flex px-4 py-3 hover:bg-gray-50 cursor-pointer relative",
                  !email.isRead && "bg-teal-50",
                  selectedEmails.includes(email.id) && "bg-teal-100"
                )}
                onMouseEnter={() => setHoveredEmailId(email.id)}
                onMouseLeave={() => setHoveredEmailId(null)}
                onClick={() => onEmailClick(email.id)}
              >
                <div className="flex items-center pr-3" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="p-1 rounded-md hover:bg-gray-200"
                    onClick={() => onSelectEmail(email.id)}
                  >
                    {selectedEmails.includes(email.id) ? (
                      <CheckSquare className="h-5 w-5 text-teal-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <button 
                    className="p-1 rounded-md hover:bg-gray-200 ml-1"
                    onClick={() => onToggleStar(email.id)}
                  >
                    <Star 
                      className={cn(
                        "h-5 w-5",
                        email.isStarred ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                      )}
                    />
                  </button>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    {/* Account indicator */}
                    <div 
                      className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                      style={{ backgroundColor: getAccountColor(email.accountId) }}
                    />
                    
                    {/* From */}
                    <div className={cn(
                      "font-medium truncate",
                      !email.isRead && "font-semibold"
                    )}>
                      {activeFolder === 'sent' ? (
                        <span>To: {email.to.map(t => t.name || t.email).join(', ')}</span>
                      ) : (
                        <span>{email.from.name || email.from.email}</span>
                      )}
                    </div>
                    
                    {/* Date */}
                    <div className="ml-auto pl-2 text-sm text-gray-500 flex-shrink-0">
                      {formatDate(email.date)}
                    </div>
                  </div>
                  
                  {/* Subject */}
                  <div className={cn(
                    "truncate",
                    !email.isRead && "font-medium"
                  )}>
                    {email.subject || "(No subject)"}
                  </div>
                  
                  {/* Preview */}
                  <div className="text-sm text-gray-500 truncate">
                    {email.body.replace(/<[^>]*>/g, '').substring(0, 100)}
                    {email.attachments.length > 0 && (
                      <span className="inline-flex items-center ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Hover actions */}
                {hoveredEmailId === email.id && (
                  <div 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-md flex"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button 
                      className="p-2 hover:bg-gray-100 text-gray-700"
                      onClick={() => onMarkAsRead([email.id], !email.isRead)}
                      title={email.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {email.isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                    </button>
                    <button 
                      className="p-2 hover:bg-gray-100 text-gray-700"
                      onClick={() => onMoveToArchive([email.id])}
                      title="Archive"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 hover:bg-gray-100 text-gray-700"
                      onClick={() => onMoveToTrash([email.id])}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 