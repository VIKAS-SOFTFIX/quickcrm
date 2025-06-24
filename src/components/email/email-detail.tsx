"use client";

import { useState } from "react";
import { Email, EmailAccount } from "@/hooks/useEmails";
import { 
  ArrowLeft, 
  Star, 
  Trash2, 
  MailOpen, 
  Mail, 
  Archive, 
  Reply, 
  Forward, 
  MoreHorizontal, 
  Paperclip,
  Download,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface EmailDetailProps {
  email: Email | null;
  onBack: () => void;
  onToggleStar: (emailId: string) => void;
  onMarkAsRead: (emailIds: string[], read: boolean) => void;
  onMoveToTrash: (emailIds: string[]) => void;
  onMoveToArchive: (emailIds: string[]) => void;
  onReply: (email: Email) => void;
  onForward: (email: Email) => void;
  accounts: EmailAccount[];
}

export function EmailDetail({
  email,
  onBack,
  onToggleStar,
  onMarkAsRead,
  onMoveToTrash,
  onMoveToArchive,
  onReply,
  onForward,
  accounts
}: EmailDetailProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white text-gray-500">
        <Mail className="h-24 w-24 mb-4 opacity-30" />
        <p className="text-lg font-medium">Select an email to view</p>
        <p className="text-sm text-gray-400">Choose an email from the list to read its contents</p>
      </div>
    );
  }
  
  const getAccountColor = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account?.color || '#5F6368';
  };
  
  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account?.name || 'Unknown';
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
  
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <button 
            className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
            onClick={() => onMarkAsRead([email.id], !email.isRead)}
            title={email.isRead ? "Mark as unread" : "Mark as read"}
          >
            {email.isRead ? <Mail className="h-5 w-5" /> : <MailOpen className="h-5 w-5" />}
          </button>
          
          <button 
            className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
            onClick={() => onMoveToArchive([email.id])}
            title="Archive"
          >
            <Archive className="h-5 w-5" />
          </button>
          
          <button 
            className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
            onClick={() => onMoveToTrash([email.id])}
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
            onClick={() => onToggleStar(email.id)}
            title={email.isStarred ? "Unstar" : "Star"}
          >
            <Star 
              className={cn(
                "h-5 w-5",
                email.isStarred ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
              )}
            />
          </button>
          
          <button 
            className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
            onClick={() => onReply(email)}
            title="Reply"
          >
            <Reply className="h-5 w-5" />
          </button>
          
          <button 
            className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
            onClick={() => onForward(email)}
            title="Forward"
          >
            <Forward className="h-5 w-5" />
          </button>
          
          <button 
            className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
            title="More options"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Email Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Subject */}
          <h1 className="text-2xl font-bold mb-6">{email.subject || "(No subject)"}</h1>
          
          {/* Sender Info */}
          <div className="flex items-start mb-6">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0"
              style={{ backgroundColor: getAccountColor(email.accountId) }}
            >
              {email.from.name ? email.from.name.charAt(0).toUpperCase() : email.from.email.charAt(0).toUpperCase()}
            </div>
            
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {email.from.name || email.from.email}
                    <span className="text-sm text-gray-500 ml-2">{`<${email.from.email}>`}</span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <span>
                      {format(email.date, "MMM d, yyyy 'at' h:mm a")}
                    </span>
                    <button 
                      className="ml-2 text-teal-600 hover:text-teal-700 flex items-center"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          <span>Hide details</span>
                        </>
                      ) : (
                        <>
                          <ChevronRight className="h-4 w-4 mr-1" />
                          <span>Show details</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  via {getAccountName(email.accountId)}
                </div>
              </div>
              
              {showDetails && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1">
                    <div className="text-gray-500">From:</div>
                    <div>{email.from.name} {`<${email.from.email}>`}</div>
                    
                    <div className="text-gray-500">To:</div>
                    <div>{email.to.map(t => `${t.name || ''} <${t.email}>`).join(', ')}</div>
                    
                    {email.cc && email.cc.length > 0 && (
                      <>
                        <div className="text-gray-500">Cc:</div>
                        <div>{email.cc.map(c => `${c.name || ''} <${c.email}>`).join(', ')}</div>
                      </>
                    )}
                    
                    {email.bcc && email.bcc.length > 0 && (
                      <>
                        <div className="text-gray-500">Bcc:</div>
                        <div>{email.bcc.map(b => `${b.name || ''} <${b.email}>`).join(', ')}</div>
                      </>
                    )}
                    
                    <div className="text-gray-500">Date:</div>
                    <div>{format(email.date, "EEEE, MMMM d, yyyy 'at' h:mm a")}</div>
                    
                    <div className="text-gray-500">Subject:</div>
                    <div>{email.subject || "(No subject)"}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Email Body */}
          <div 
            className="prose max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: email.body }}
          />
          
          {/* Attachments */}
          {email.attachments.length > 0 && (
            <div className="border-t border-gray-200 pt-4 mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Paperclip className="h-4 w-4 mr-2" />
                {email.attachments.length} Attachment{email.attachments.length > 1 ? 's' : ''}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {email.attachments.map(attachment => (
                  <div 
                    key={attachment.id}
                    className="border border-gray-200 rounded-lg p-3 flex items-center"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-500 flex-shrink-0">
                      {attachment.type.includes('image') ? (
                        <img 
                          src={attachment.url} 
                          alt={attachment.name} 
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <span className="text-xs font-medium">
                          {attachment.name.split('.').pop()?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{attachment.name}</div>
                      <div className="text-xs text-gray-500">{formatAttachmentSize(attachment.size)}</div>
                    </div>
                    
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Reply/Forward Buttons */}
          <div className="border-t border-gray-200 pt-6 mt-6 flex space-x-3">
            <button
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center"
              onClick={() => onReply(email)}
            >
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </button>
            
            <button
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
              onClick={() => onForward(email)}
            >
              <Forward className="h-4 w-4 mr-2" />
              Forward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 