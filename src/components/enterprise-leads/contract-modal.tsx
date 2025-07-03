"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, FileText, Eye, Download, Send } from "lucide-react";
import { format } from "date-fns";

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  email: string;
  amount: number;
  onSend: () => void;
}

export function ContractModal({
  isOpen,
  onClose,
  companyName,
  email,
  amount,
  onSend
}: ContractModalProps) {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  if (!isOpen) return null;
  
  const handlePreviewPdf = () => {
    setIsLoading(true);
    // Simulate PDF generation
    setTimeout(() => {
      setShowPdfPreview(true);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleDownloadPdf = () => {
    // In a real implementation, this would trigger a download of the PDF file
    console.log("Downloading PDF...");
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', `Contract-${companyName.replace(/\s+/g, '-')}.pdf`);
    link.click();
  };
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Contract Created</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {!showPdfPreview ? (
          <>
            <p className="text-sm text-gray-600 mb-4">
              A contract has been created for {companyName}. You can review and send it for signature.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-sm font-medium">Enterprise Agreement</p>
              <p className="text-sm text-gray-600 mt-2">Client: {companyName}</p>
              <p className="text-sm text-gray-600">Value: ₹{amount.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Created: {format(new Date(), "dd/MM/yyyy")}</p>
            </div>
            
            <div className="flex justify-center mb-4">
              <Button 
                onClick={handlePreviewPdf}
                disabled={isLoading}
                className="flex items-center"
                type="button"
              >
                {isLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Generating Preview..." : "Preview as PDF"}
              </Button>
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
                  onSend();
                  onClose();
                }}
                type="button"
              >
                <Send className="h-4 w-4 mr-2" />
                Send for Signature
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
              <div className="bg-gray-100 p-2 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Contract-{companyName.replace(/\s+/g, '-')}.pdf</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDownloadPdf}
                  className="h-8 px-2"
                  type="button"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-96 bg-white p-6 overflow-y-auto">
                {/* PDF Preview Content */}
                <div className="mx-auto max-w-2xl">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">ENTERPRISE AGREEMENT</h2>
                      <p className="text-sm text-gray-600 mt-1">Contract ID: QBCR-{Date.now().toString().slice(-6)}</p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold">QuickBid CRM</h3>
                      <p className="text-sm text-gray-600">123 Business Avenue</p>
                      <p className="text-sm text-gray-600">Mumbai, Maharashtra</p>
                      <p className="text-sm text-gray-600">India</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Agreement</h3>
                    <p className="text-sm text-gray-700 mb-4">
                      This Enterprise Agreement (the "Agreement") is made and entered into as of {format(new Date(), "MMMM dd, yyyy")} (the "Effective Date") by and between:
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">QuickBid Technologies Pvt Ltd</span>, a company registered under the laws of India, having its registered office at 123 Business Avenue, Mumbai, Maharashtra, India (hereinafter referred to as "Service Provider")
                    </p>
                    <p className="text-sm text-gray-700 mb-4">
                      and
                    </p>
                    <p className="text-sm text-gray-700 mb-4">
                      <span className="font-medium">{companyName}</span>, a company organized and existing under the laws of India (hereinafter referred to as "Client")
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-2">1. Services</h3>
                    <p className="text-sm text-gray-700">
                      The Service Provider agrees to provide the Client with access to the QuickBid CRM platform and related services as specified in Schedule A attached hereto.
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-2">2. Term</h3>
                    <p className="text-sm text-gray-700">
                      This Agreement shall commence on the Effective Date and shall continue for an initial period of twelve (12) months (the "Initial Term"). Thereafter, this Agreement shall automatically renew for successive periods of twelve (12) months each (each a "Renewal Term"), unless either party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current term.
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-2">3. Fees and Payment</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      3.1 The Client agrees to pay the Service Provider the fees as set out in Schedule B attached hereto.
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      3.2 Total contract value: ₹{amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700">
                      3.3 All payments shall be made within thirty (30) days of receipt of an invoice from the Service Provider.
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-2">4. Signatures</h3>
                    <div className="grid grid-cols-2 gap-8 mt-8">
                      <div>
                        <p className="text-sm font-medium mb-8">For QuickBid Technologies Pvt Ltd:</p>
                        <div className="border-t border-gray-400 pt-1">
                          <p className="text-sm">Authorized Signatory</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-8">For {companyName}:</p>
                        <div className="border-t border-gray-400 pt-1">
                          <p className="text-sm">Authorized Signatory</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setShowPdfPreview(false)}
                type="button"
              >
                Back
              </Button>
              <div className="space-x-2">
                <Button 
                  variant="outline"
                  onClick={handleDownloadPdf}
                  type="button"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={() => {
                    onSend();
                    onClose();
                  }}
                  type="button"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send for Signature
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 