"use client";

import { useState } from "react";
import { EmailAccount } from "@/hooks/useEmails";
import { 
  Inbox, 
  Send, 
  File, 
  Trash2, 
  AlertCircle, 
  Archive, 
  Star, 
  Plus, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Mail,
  MoreVertical,
  PenSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip } from "react-tooltip";

interface EmailSidebarProps {
  accounts: EmailAccount[];
  activeAccountId?: string;
  activeFolder: string;
  onFolderChange: (folder: string) => void;
  onAccountChange: (accountId?: string) => void;
  onAddAccount: () => void;
  onComposeEmail: () => void;
  getUnreadCount: (folder: string, accountId?: string) => number;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function EmailSidebar({
  accounts,
  activeAccountId,
  activeFolder,
  onFolderChange,
  onAccountChange,
  onAddAccount,
  onComposeEmail,
  getUnreadCount,
  collapsed = false,
  onToggleCollapse
}: EmailSidebarProps) {
  const [expandedAccounts, setExpandedAccounts] = useState<Record<string, boolean>>(
    accounts.reduce((acc, account) => ({ ...acc, [account.id]: true }), {})
  );

  const toggleAccountExpanded = (accountId: string) => {
    setExpandedAccounts(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const folders = [
    { id: 'inbox', label: 'Inbox', icon: <Inbox size={18} /> },
    { id: 'sent', label: 'Sent', icon: <Send size={18} /> },
    { id: 'drafts', label: 'Drafts', icon: <File size={18} /> },
    { id: 'trash', label: 'Trash', icon: <Trash2 size={18} /> },
    { id: 'spam', label: 'Spam', icon: <AlertCircle size={18} /> },
    { id: 'archive', label: 'Archive', icon: <Archive size={18} /> },
    { id: 'starred', label: 'Starred', icon: <Star size={18} /> },
  ];

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 h-full transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex justify-between items-center">
        {!collapsed && <h2 className="text-lg font-semibold">Email</h2>}
        {collapsed && <Mail className="mx-auto" size={24} />}
        {onToggleCollapse && (
          <button 
            onClick={onToggleCollapse}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
          </button>
        )}
      </div>

      <div className="p-2">
        <Button 
          className={cn(
            "w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 flex items-center justify-center gap-2",
            collapsed ? "px-2" : ""
          )}
          onClick={onComposeEmail}
        >
          <PenSquare size={18} />
          {!collapsed && <span>Compose</span>}
        </Button>
      </div>

      <div className="mt-2 flex-1 overflow-y-auto">
        {/* All Accounts Folders */}
        {!activeAccountId && (
          <div className="mb-4">
            {!collapsed && <div className="px-4 py-2 text-xs font-semibold text-gray-500">ALL ACCOUNTS</div>}
            
            <div className="space-y-1 px-2">
              {folders.map(folder => {
                const unreadCount = getUnreadCount(folder.id);
                return (
                  <button
                    key={folder.id}
                    className={cn(
                      "w-full flex items-center px-2 py-2 rounded-md",
                      activeFolder === folder.id
                        ? "bg-teal-50 text-teal-600"
                        : "hover:bg-gray-100 text-gray-700"
                    )}
                    onClick={() => onFolderChange(folder.id)}
                    data-tooltip-id={collapsed ? `folder-tooltip-${folder.id}` : undefined}
                    data-tooltip-content={collapsed ? folder.label : undefined}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <span className="mr-3">{folder.icon}</span>
                      {!collapsed && (
                        <>
                          <span className="truncate">{folder.label}</span>
                          {unreadCount > 0 && (
                            <span className="ml-auto bg-teal-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-teal-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
              {collapsed && folders.map(folder => (
                <Tooltip 
                  key={`tooltip-${folder.id}`}
                  id={`folder-tooltip-${folder.id}`}
                  place="right"
                />
              ))}
            </div>
          </div>
        )}

        {/* Email Accounts */}
        <div>
          {!collapsed && <div className="px-4 py-2 text-xs font-semibold text-gray-500">ACCOUNTS</div>}
          
          <div className="space-y-1 px-2">
            {/* All Accounts Option */}
            <button
              className={cn(
                "w-full flex items-center px-2 py-2 rounded-md",
                !activeAccountId
                  ? "bg-teal-50 text-teal-600"
                  : "hover:bg-gray-100 text-gray-700"
              )}
              onClick={() => onAccountChange(undefined)}
              data-tooltip-id={collapsed ? "all-accounts-tooltip" : undefined}
              data-tooltip-content={collapsed ? "All Accounts" : undefined}
            >
              <div className="flex items-center flex-1 min-w-0">
                <span className="mr-3">
                  <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                    <Mail size={12} className="text-white" />
                  </div>
                </span>
                {!collapsed && <span className="truncate">All Accounts</span>}
              </div>
            </button>
            {collapsed && (
              <Tooltip id="all-accounts-tooltip" place="right" />
            )}
            
            {/* Individual Accounts */}
            {accounts.map(account => (
              <div key={account.id} className="space-y-1">
                <button
                  className={cn(
                    "w-full flex items-center px-2 py-2 rounded-md",
                    activeAccountId === account.id && activeFolder === 'inbox'
                      ? "bg-teal-50 text-teal-600"
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                  onClick={() => {
                    onAccountChange(account.id);
                    onFolderChange('inbox');
                  }}
                  data-tooltip-id={collapsed ? `account-tooltip-${account.id}` : undefined}
                  data-tooltip-content={collapsed ? account.name : undefined}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="mr-3">
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: account.color }}
                      >
                        {account.name.charAt(0).toUpperCase()}
                      </div>
                    </span>
                    {!collapsed && (
                      <>
                        <span className="truncate">{account.name}</span>
                        {account.unreadCount > 0 && (
                          <span className="ml-auto bg-teal-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                            {account.unreadCount}
                          </span>
                        )}
                        <button
                          className="ml-2 text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAccountExpanded(account.id);
                          }}
                        >
                          {expandedAccounts[account.id] ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </button>
                      </>
                    )}
                    {collapsed && account.unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-teal-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                        {account.unreadCount > 9 ? '9+' : account.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
                {collapsed && (
                  <Tooltip id={`account-tooltip-${account.id}`} place="right" />
                )}
                
                {/* Account Folders */}
                {!collapsed && expandedAccounts[account.id] && (
                  <div className="pl-8 space-y-1">
                    {folders.map(folder => {
                      const unreadCount = getUnreadCount(folder.id, account.id);
                      return (
                        <button
                          key={`${account.id}-${folder.id}`}
                          className={cn(
                            "w-full flex items-center px-2 py-1.5 rounded-md text-sm",
                            activeAccountId === account.id && activeFolder === folder.id
                              ? "bg-teal-50 text-teal-600"
                              : "hover:bg-gray-100 text-gray-700"
                          )}
                          onClick={() => {
                            onAccountChange(account.id);
                            onFolderChange(folder.id);
                          }}
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            <span className="mr-2">{folder.icon}</span>
                            <span className="truncate">{folder.label}</span>
                            {unreadCount > 0 && (
                              <span className="ml-auto bg-teal-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Account Button */}
      <div className="p-2 border-t border-gray-200">
        <Button 
          variant="outline"
          className={cn(
            "w-full flex items-center justify-center gap-2",
            collapsed ? "px-2" : ""
          )}
          onClick={onAddAccount}
          data-tooltip-id={collapsed ? "add-account-tooltip" : undefined}
          data-tooltip-content={collapsed ? "Add Account" : undefined}
        >
          <Plus size={18} />
          {!collapsed && <span>Add Account</span>}
        </Button>
        {collapsed && <Tooltip id="add-account-tooltip" place="right" />}
      </div>

      {/* Settings */}
      <div className="p-2 border-t border-gray-200">
        <button
          className="w-full flex items-center px-2 py-2 rounded-md hover:bg-gray-100 text-gray-700"
          data-tooltip-id={collapsed ? "settings-tooltip" : undefined}
          data-tooltip-content={collapsed ? "Settings" : undefined}
        >
          <span className="mr-3"><Settings size={18} /></span>
          {!collapsed && <span>Settings</span>}
        </button>
        {collapsed && <Tooltip id="settings-tooltip" place="right" />}
      </div>
    </div>
  );
} 