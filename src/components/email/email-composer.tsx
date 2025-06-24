"use client";

import { useState, useRef, useEffect } from "react";
import { Email, EmailAccount } from "@/hooks/useEmails";
import { 
  X, 
  Minimize2, 
  Maximize2, 
  ChevronDown, 
  Paperclip, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmailComposerProps {
  initialEmail?: Email;
  mode: 'new' | 'reply' | 'forward';
  accounts: EmailAccount[];
  activeAccountId?: string;
  onClose: () => void;
  onMinimize: () => void;
  onSend: (email: Partial<Email>) => void;
  onSaveAsDraft: (email: Partial<Email>) => void;
  onDiscard: () => void;
  isMinimized?: boolean;
}

export function EmailComposer({
  initialEmail,
  mode,
  accounts,
  activeAccountId,
  onClose,
  onMinimize,
  onSend,
  onSaveAsDraft,
  onDiscard,
  isMinimized = false
}: EmailComposerProps) {
  const [fromAccountId, setFromAccountId] = useState<string>(activeAccountId || (accounts.length > 0 ? accounts[0].id : ''));
  const [to, setTo] = useState<string>('');
  const [cc, setCc] = useState<string>('');
  const [bcc, setBcc] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [showCcBcc, setShowCcBcc] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  
  // Initialize composer based on mode and initialEmail
  useEffect(() => {
    if (initialEmail) {
      if (mode === 'reply') {
        setFromAccountId(initialEmail.accountId);
        setTo(initialEmail.from.email);
        setSubject(`Re: ${initialEmail.subject || ''}`.replace(/^(Re: )+/g, 'Re: '));
        setBody(`<br/><br/><hr/><p>On ${new Date(initialEmail.date).toLocaleString()}, ${initialEmail.from.name || initialEmail.from.email} wrote:</p><blockquote style="border-left: 2px solid #ccc; padding-left: 10px; margin-left: 5px;">${initialEmail.body}</blockquote>`);
      } else if (mode === 'forward') {
        setFromAccountId(initialEmail.accountId);
        setSubject(`Fwd: ${initialEmail.subject || ''}`.replace(/^(Fwd: )+/g, 'Fwd: '));
        setBody(`<br/><br/><hr/><p>---------- Forwarded message ---------</p><p>From: ${initialEmail.from.name || ''} &lt;${initialEmail.from.email}&gt;</p><p>Date: ${new Date(initialEmail.date).toLocaleString()}</p><p>Subject: ${initialEmail.subject || '(No subject)'}</p><p>To: ${initialEmail.to.map(t => `${t.name || ''} &lt;${t.email}&gt;`).join(', ')}</p><br/>${initialEmail.body}`);
        
        // TODO: Handle forwarded attachments
      }
    }
    
    setIsDirty(false);
  }, [initialEmail, mode]);
  
  // Mark as dirty when any field changes
  useEffect(() => {
    if (to || cc || bcc || subject || body || attachments.length > 0) {
      setIsDirty(true);
    }
  }, [to, cc, bcc, subject, body, attachments]);
  
  const handleSend = () => {
    // Validate required fields
    if (!to.trim()) {
      alert('Please specify at least one recipient');
      return;
    }
    
    // Parse recipients
    const toRecipients = to.split(',').map(email => {
      const trimmed = email.trim();
      return { email: trimmed };
    });
    
    const ccRecipients = cc ? cc.split(',').map(email => {
      const trimmed = email.trim();
      return { email: trimmed };
    }) : [];
    
    const bccRecipients = bcc ? bcc.split(',').map(email => {
      const trimmed = email.trim();
      return { email: trimmed };
    }) : [];
    
    // Get sender account
    const account = accounts.find(a => a.id === fromAccountId);
    
    if (!account) {
      alert('Please select a valid sender account');
      return;
    }
    
    // Create email object
    const email: Partial<Email> = {
      accountId: account.id,
      from: {
        email: account.email,
        name: account.name
      },
      to: toRecipients,
      subject: subject || '(No subject)',
      body: body || '',
      date: new Date(),
      isRead: true,
      isStarred: false,
      isArchived: false,
      labels: [],
      folder: 'sent',
      attachments: [] // TODO: Handle attachments
    };
    
    if (ccRecipients.length > 0) {
      email.cc = ccRecipients;
    }
    
    if (bccRecipients.length > 0) {
      email.bcc = bccRecipients;
    }
    
    onSend(email);
  };
  
  const handleSaveAsDraft = () => {
    if (!isDirty) return;
    
    // Get sender account
    const account = accounts.find(a => a.id === fromAccountId);
    
    if (!account) return;
    
    // Parse recipients
    const toRecipients = to ? to.split(',').map(email => {
      const trimmed = email.trim();
      return { email: trimmed };
    }) : [];
    
    const ccRecipients = cc ? cc.split(',').map(email => {
      const trimmed = email.trim();
      return { email: trimmed };
    }) : [];
    
    const bccRecipients = bcc ? bcc.split(',').map(email => {
      const trimmed = email.trim();
      return { email: trimmed };
    }) : [];
    
    // Create draft email object
    const draft: Partial<Email> = {
      accountId: account.id,
      from: {
        email: account.email,
        name: account.name
      },
      to: toRecipients,
      subject: subject || '',
      body: body || '',
      date: new Date(),
      isRead: true,
      isStarred: false,
      isArchived: false,
      labels: [],
      folder: 'drafts',
      attachments: [] // TODO: Handle attachments
    };
    
    if (ccRecipients.length > 0) {
      draft.cc = ccRecipients;
    }
    
    if (bccRecipients.length > 0) {
      draft.bcc = bccRecipients;
    }
    
    onSaveAsDraft(draft);
  };
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };
  
  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Text formatting commands
  const execFormatCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (bodyRef.current) {
      bodyRef.current.focus();
    }
  };
  
  // Handle closing with confirmation if dirty
  const handleClose = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Do you want to save as draft?')) {
        handleSaveAsDraft();
      }
    }
    onClose();
  };
  
  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-4 w-64 bg-white rounded-t-lg shadow-lg border border-gray-200 z-50">
        <div 
          className="p-3 border-b border-gray-200 flex justify-between items-center cursor-pointer"
          onClick={onMinimize}
        >
          <div className="font-medium truncate">
            {subject || 'New Message'}
          </div>
          <div className="flex items-center">
            <button 
              className="p-1 rounded hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
            >
              <Maximize2 className="h-4 w-4 text-gray-500" />
            </button>
            <button 
              className="p-1 rounded hover:bg-gray-100 ml-1"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "fixed bg-white shadow-xl border border-gray-200 z-50 flex flex-col",
        isFullscreen 
          ? "inset-0" 
          : "bottom-0 right-4 w-[600px] h-[500px] rounded-t-lg"
      )}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium">
          {mode === 'new' ? 'New Message' : mode === 'reply' ? 'Reply' : 'Forward'}
        </h3>
        <div className="flex items-center space-x-1">
          <button 
            className="p-1 rounded hover:bg-gray-100"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4 text-gray-500" /> : <Maximize2 className="h-4 w-4 text-gray-500" />}
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-100"
            onClick={onMinimize}
          >
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-100"
            onClick={handleClose}
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Composer Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* From */}
        <div className="flex items-center">
          <div className="w-16 text-sm text-gray-500">From:</div>
          <select
            value={fromAccountId}
            onChange={(e) => setFromAccountId(e.target.value)}
            className="flex-1 border-0 focus:ring-0 p-1 bg-transparent"
          >
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.email})
              </option>
            ))}
          </select>
        </div>
        
        {/* To */}
        <div className="flex items-center border-t border-gray-100 pt-2">
          <div className="w-16 text-sm text-gray-500">To:</div>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Recipients"
            className="flex-1 border-0 focus:ring-0 p-1"
          />
          {!showCcBcc && (
            <button 
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setShowCcBcc(true)}
            >
              Cc/Bcc
            </button>
          )}
        </div>
        
        {/* Cc */}
        {showCcBcc && (
          <div className="flex items-center border-t border-gray-100 pt-2">
            <div className="w-16 text-sm text-gray-500">Cc:</div>
            <input
              type="text"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="Carbon copy"
              className="flex-1 border-0 focus:ring-0 p-1"
            />
          </div>
        )}
        
        {/* Bcc */}
        {showCcBcc && (
          <div className="flex items-center border-t border-gray-100 pt-2">
            <div className="w-16 text-sm text-gray-500">Bcc:</div>
            <input
              type="text"
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
              placeholder="Blind carbon copy"
              className="flex-1 border-0 focus:ring-0 p-1"
            />
          </div>
        )}
        
        {/* Subject */}
        <div className="flex items-center border-t border-gray-100 pt-2">
          <div className="w-16 text-sm text-gray-500">Subject:</div>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="flex-1 border-0 focus:ring-0 p-1"
          />
        </div>
        
        {/* Formatting Toolbar */}
        <div className="border-t border-gray-100 pt-2 flex items-center space-x-1">
          <button 
            className="p-1.5 rounded hover:bg-gray-100"
            onClick={() => execFormatCommand('bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4 text-gray-700" />
          </button>
          <button 
            className="p-1.5 rounded hover:bg-gray-100"
            onClick={() => execFormatCommand('italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4 text-gray-700" />
          </button>
          <button 
            className="p-1.5 rounded hover:bg-gray-100"
            onClick={() => execFormatCommand('underline')}
            title="Underline"
          >
            <Underline className="h-4 w-4 text-gray-700" />
          </button>
          <div className="h-5 border-l border-gray-200 mx-1"></div>
          <button 
            className="p-1.5 rounded hover:bg-gray-100"
            onClick={() => execFormatCommand('insertUnorderedList')}
            title="Bullet List"
          >
            <List className="h-4 w-4 text-gray-700" />
          </button>
          <button 
            className="p-1.5 rounded hover:bg-gray-100"
            onClick={() => execFormatCommand('insertOrderedList')}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4 text-gray-700" />
          </button>
          <div className="h-5 border-l border-gray-200 mx-1"></div>
          <button 
            className="p-1.5 rounded hover:bg-gray-100"
            onClick={() => {
              const url = prompt('Enter link URL:');
              if (url) execFormatCommand('createLink', url);
            }}
            title="Insert Link"
          >
            <Link className="h-4 w-4 text-gray-700" />
          </button>
          <button 
            className="p-1.5 rounded hover:bg-gray-100"
            onClick={handleFileUpload}
            title="Attach File"
          >
            <Paperclip className="h-4 w-4 text-gray-700" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
          <div className="h-5 border-l border-gray-200 mx-1"></div>
          <button 
            className="p-1.5 rounded hover:bg-gray-100"
            onClick={() => execFormatCommand('justifyLeft')}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4 text-gray-700" />
          </button>
          <button 
            className="p-1.5 rounded hover:bg-gray-100"
            onClick={() => execFormatCommand('justifyCenter')}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4 text-gray-700" />
          </button>
          <button 
            className="p-1.5 rounded hover:bg-gray-100"
            onClick={() => execFormatCommand('justifyRight')}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4 text-gray-700" />
          </button>
        </div>
        
        {/* Email Body */}
        <div 
          ref={bodyRef}
          className="border-t border-gray-100 pt-3 min-h-[200px] outline-none"
          contentEditable
          dangerouslySetInnerHTML={{ __html: body }}
          onInput={(e) => setBody((e.target as HTMLDivElement).innerHTML)}
        />
        
        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <h4 className="text-sm font-medium mb-2">Attachments</h4>
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                      {file.name.split('.').pop()?.toUpperCase()}
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium truncate max-w-[300px]">{file.name}</div>
                      <div className="text-xs text-gray-500">{formatBytes(file.size)}</div>
                    </div>
                  </div>
                  <button 
                    className="p-1 text-gray-400 hover:text-gray-600"
                    onClick={() => handleRemoveAttachment(index)}
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-gray-200 flex items-center justify-between">
        <div className="flex space-x-2">
          <Button
            onClick={handleSend}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
          >
            Send
          </Button>
          <Button
            variant="outline"
            onClick={onDiscard}
          >
            Discard
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          {attachments.length > 0 && (
            <span>{attachments.length} attachment{attachments.length > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </div>
  );
} 