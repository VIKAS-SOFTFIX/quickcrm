"use client";

import { useState, useEffect } from "react";
import { useEmails, Email } from "@/hooks/useEmails";
import { EmailSidebar } from "@/components/email/email-sidebar";
import { EmailList } from "@/components/email/email-list";
import { EmailDetail } from "@/components/email/email-detail";
import { EmailComposer } from "@/components/email/email-composer";
import { EmailAccountModal } from "@/components/email/email-account-modal";

export default function EmailPage() {
  const {
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
  } = useEmails();
  
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [composerState, setComposerState] = useState<{
    isOpen: boolean;
    isMinimized: boolean;
    mode: 'new' | 'reply' | 'forward';
    initialEmail?: Email;
  }>({
    isOpen: false,
    isMinimized: false,
    mode: 'new'
  });
  
  // Get the selected email object
  const selectedEmail = selectedEmailId 
    ? emails.find(email => email.id === selectedEmailId) || null
    : null;
  
  // Handle email click
  const handleEmailClick = (emailId: string) => {
    setSelectedEmailId(emailId);
    
    // Mark as read when opened
    const email = emails.find(e => e.id === emailId);
    if (email && !email.isRead) {
      markAsRead([emailId], true);
    }
  };
  
  // Handle back button in email detail
  const handleBackToList = () => {
    setSelectedEmailId(null);
  };
  
  // Handle new email
  const handleNewEmail = () => {
    setComposerState({
      isOpen: true,
      isMinimized: false,
      mode: 'new'
    });
  };
  
  // Handle reply
  const handleReply = (email: Email) => {
    setComposerState({
      isOpen: true,
      isMinimized: false,
      mode: 'reply',
      initialEmail: email
    });
  };
  
  // Handle forward
  const handleForward = (email: Email) => {
    setComposerState({
      isOpen: true,
      isMinimized: false,
      mode: 'forward',
      initialEmail: email
    });
  };
  
  // Handle send email
  const handleSendEmail = (email: Partial<Email>) => {
    // In a real app, this would send the email via API
    console.log('Sending email:', email);
    
    // Close composer
    setComposerState(prev => ({
      ...prev,
      isOpen: false
    }));
    
    // Show success message
    alert('Email sent successfully!');
  };
  
  // Handle save as draft
  const handleSaveAsDraft = (email: Partial<Email>) => {
    // In a real app, this would save the draft via API
    console.log('Saving draft:', email);
    
    // Close composer
    setComposerState(prev => ({
      ...prev,
      isOpen: false
    }));
  };
  
  // Handle discard email
  const handleDiscardEmail = () => {
    // Close composer
    setComposerState(prev => ({
      ...prev,
      isOpen: false
    }));
  };
  
  // Handle minimize composer
  const handleMinimizeComposer = () => {
    setComposerState(prev => ({
      ...prev,
      isMinimized: !prev.isMinimized
    }));
  };
  
  // Handle close composer
  const handleCloseComposer = () => {
    setComposerState(prev => ({
      ...prev,
      isOpen: false
    }));
  };
  
  // Handle add account
  const handleAddAccount = () => {
    setIsAccountModalOpen(true);
  };
  
  // Handle move to trash
  const handleMoveToTrash = (emailIds: string[]) => {
    moveToFolder(emailIds, 'trash');
    
    // If the selected email was moved to trash, go back to the list
    if (selectedEmailId && emailIds.includes(selectedEmailId)) {
      setSelectedEmailId(null);
    }
  };
  
  // Handle move to archive
  const handleMoveToArchive = (emailIds: string[]) => {
    moveToFolder(emailIds, 'archive');
    
    // If the selected email was archived, go back to the list
    if (selectedEmailId && emailIds.includes(selectedEmailId)) {
      setSelectedEmailId(null);
    }
  };
  
  return (
    <div className="p-4 h-[calc(100vh-64px)] overflow-hidden">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex">
        {/* Email Sidebar */}
        <div className="h-full">
          <EmailSidebar
            accounts={accounts}
            activeAccountId={activeAccountId}
            activeFolder={activeFolder}
            onFolderChange={setActiveFolder}
            onAccountChange={setActiveAccountId}
            onAddAccount={handleAddAccount}
            onComposeEmail={handleNewEmail}
            getUnreadCount={getUnreadCount}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Email List (hide when viewing an email on mobile) */}
          <div className={`${selectedEmailId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-2/5 border-r border-gray-200`}>
            <EmailList
              emails={emails}
              loading={loading}
              selectedEmails={selectedEmails}
              onSelectEmail={toggleEmailSelection}
              onSelectAllEmails={selectAllEmails}
              onEmailClick={handleEmailClick}
              onToggleStar={toggleStar}
              onMarkAsRead={markAsRead}
              onMoveToTrash={handleMoveToTrash}
              onMoveToArchive={handleMoveToArchive}
              accounts={accounts}
              activeFolder={activeFolder}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          
          {/* Email Detail */}
          <div className={`${selectedEmailId ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
            <EmailDetail
              email={selectedEmail}
              onBack={handleBackToList}
              onToggleStar={toggleStar}
              onMarkAsRead={markAsRead}
              onMoveToTrash={handleMoveToTrash}
              onMoveToArchive={handleMoveToArchive}
              onReply={handleReply}
              onForward={handleForward}
              accounts={accounts}
            />
          </div>
        </div>
      </div>
      
      {/* Email Composer */}
      {composerState.isOpen && (
        <EmailComposer
          initialEmail={composerState.initialEmail}
          mode={composerState.mode}
          accounts={accounts}
          activeAccountId={activeAccountId}
          onClose={handleCloseComposer}
          onMinimize={handleMinimizeComposer}
          onSend={handleSendEmail}
          onSaveAsDraft={handleSaveAsDraft}
          onDiscard={handleDiscardEmail}
          isMinimized={composerState.isMinimized}
        />
      )}
      
      {/* Account Modal */}
      <EmailAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onAddAccount={(account) => {
          addEmailAccount(account);
          setIsAccountModalOpen(false);
        }}
      />
    </div>
  );
} 