"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Link, X } from "lucide-react";

interface PaymentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  paymentLink: string;
}

export function PaymentLinkModal({ 
  isOpen, 
  onClose, 
  companyName, 
  paymentLink 
}: PaymentLinkModalProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const paymentLinkRef = useRef<HTMLInputElement>(null);
  
  if (!isOpen) return null;
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Payment Link</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Share this payment link with {companyName} to collect payment:
        </p>
        <div className="flex items-center mb-4">
          <input
            ref={paymentLinkRef}
            type="text"
            value={paymentLink}
            readOnly
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={() => copyToClipboard(paymentLink)}
            className="bg-teal-500 text-white p-2 rounded-r-md hover:bg-teal-600 flex items-center"
          >
            {linkCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onClose}
            type="button"
          >
            Close
          </Button>
          <Button 
            onClick={() => {
              window.open(paymentLink, '_blank');
            }}
            type="button"
            className="flex items-center"
          >
            <Link className="h-4 w-4 mr-2" />
            Open Link
          </Button>
        </div>
      </div>
    </div>
  );
} 