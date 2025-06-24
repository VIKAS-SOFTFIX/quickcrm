"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmailAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: {
    email: string;
    name: string;
    provider: 'gmail' | 'outlook' | 'yahoo' | 'custom';
    color: string;
  }) => void;
}

export function EmailAccountModal({
  isOpen,
  onClose,
  onAddAccount
}: EmailAccountModalProps) {
  const [step, setStep] = useState<'provider' | 'details'>('provider');
  const [provider, setProvider] = useState<'gmail' | 'outlook' | 'yahoo' | 'custom'>('gmail');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [color, setColor] = useState('#DB4437'); // Default Gmail color
  
  const providers = [
    { id: 'gmail', name: 'Gmail', logo: '/images/gmail-logo.png', color: '#DB4437' },
    { id: 'outlook', name: 'Outlook', logo: '/images/outlook-logo.png', color: '#0078D4' },
    { id: 'yahoo', name: 'Yahoo Mail', logo: '/images/yahoo-logo.png', color: '#6001D2' },
    { id: 'custom', name: 'Custom IMAP/SMTP', logo: '/images/email-icon.png', color: '#5F6368' }
  ] as const;
  
  const colorOptions = [
    '#DB4437', // Red (Gmail)
    '#0078D4', // Blue (Outlook)
    '#6001D2', // Purple (Yahoo)
    '#5F6368', // Gray
    '#4285F4', // Blue
    '#34A853', // Green
    '#FBBC05', // Yellow
    '#EA4335', // Red
    '#FF6D01', // Orange
    '#46BDC6', // Teal
    '#7C4DFF', // Deep Purple
    '#795548', // Brown
  ];
  
  const handleSelectProvider = (selected: 'gmail' | 'outlook' | 'yahoo' | 'custom') => {
    setProvider(selected);
    const selectedProvider = providers.find(p => p.id === selected);
    if (selectedProvider) {
      setColor(selectedProvider.color);
    }
    setStep('details');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      alert('Please fill in all required fields');
      return;
    }
    
    onAddAccount({
      email,
      name,
      provider,
      color
    });
    
    // Reset form
    setStep('provider');
    setEmail('');
    setName('');
    setColor('#DB4437');
    
    onClose();
  };
  
  const handleCancel = () => {
    // Reset form
    setStep('provider');
    setEmail('');
    setName('');
    setColor('#DB4437');
    
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold">
            {step === 'provider' ? 'Add Email Account' : `Connect ${provider.charAt(0).toUpperCase() + provider.slice(1)} Account`}
          </h2>
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={handleCancel}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 bg-white">
          {step === 'provider' ? (
            <div>
              <p className="text-gray-600 mb-4">
                Choose your email provider to get started
              </p>
              
              <div className="space-y-3">
                {providers.map(p => (
                  <button
                    key={p.id}
                    className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
                    onClick={() => handleSelectProvider(p.id)}
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <span className="ml-3 font-medium">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Your Name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={cn(
                          "w-8 h-8 rounded-full",
                          color === c && "ring-2 ring-offset-2 ring-teal-500"
                        )}
                        style={{ backgroundColor: c }}
                        onClick={() => setColor(c)}
                      />
                    ))}
                  </div>
                </div>
                
                {provider === 'custom' && (
                  <div className="space-y-4 border-t border-gray-200 pt-4 mt-4">
                    <h3 className="font-medium">Server Settings</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IMAP Server
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="imap.example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IMAP Port
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="993"
                        defaultValue="993"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Server
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="smtp.example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="587"
                        defaultValue="587"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('provider')}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                >
                  Connect Account
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 