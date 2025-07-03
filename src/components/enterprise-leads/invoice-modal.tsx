"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, FileText, Eye, Download, Send } from "lucide-react";
import { format } from "date-fns";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  email: string;
  invoiceNumber: string;
  amount: number;
  onSend: () => void;
}

export function InvoiceModal({
  isOpen,
  onClose,
  companyName,
  email,
  invoiceNumber,
  amount,
  onSend
}: InvoiceModalProps) {
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
    link.setAttribute('download', `Invoice-${invoiceNumber}.pdf`);
    link.click();
  };
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Invoice Generated</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {!showPdfPreview ? (
          <>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-sm font-medium">Invoice #{invoiceNumber}</p>
              <p className="text-sm text-gray-600 mt-2">Client: {companyName}</p>
              <p className="text-sm text-gray-600">Amount: ₹{amount.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Date: {format(new Date(), "dd/MM/yyyy")}</p>
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
                Send Invoice
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
              <div className="bg-gray-100 p-2 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Invoice-{invoiceNumber}.pdf</span>
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
                      <h2 className="text-xl font-bold text-gray-800">INVOICE</h2>
                      <p className="text-sm text-gray-600 mt-1">#{invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold">QuickBid CRM</h3>
                      <p className="text-sm text-gray-600">123 Business Avenue</p>
                      <p className="text-sm text-gray-600">Mumbai, Maharashtra</p>
                      <p className="text-sm text-gray-600">India</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-600 mb-1">Bill To:</h4>
                      <p className="font-medium">{companyName}</p>
                      <p className="text-sm text-gray-600">Attn: Accounts Payable</p>
                      <p className="text-sm text-gray-600">Email: {email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-600 mb-1">Details:</h4>
                      <div className="flex justify-between text-sm">
                        <span>Invoice Date:</span>
                        <span>{format(new Date(), "dd/MM/yyyy")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Due Date:</span>
                        <span>{format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "dd/MM/yyyy")}</span>
                      </div>
                    </div>
                  </div>
                  
                  <table className="w-full mb-8">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 text-sm font-semibold text-gray-600">Description</th>
                        <th className="text-right py-2 text-sm font-semibold text-gray-600">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-sm">Base License</td>
                        <td className="py-3 text-sm text-right">₹50,000</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-sm">Per Company Fee</td>
                        <td className="py-3 text-sm text-right">₹{(amount - 50000 - 15000).toLocaleString()}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-sm">Storage & AI Services</td>
                        <td className="py-3 text-sm text-right">₹15,000</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-sm font-semibold">Total</td>
                        <td className="py-3 text-sm font-semibold text-right">₹{amount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="border-t border-gray-300 pt-4">
                    <h4 className="text-sm font-semibold mb-2">Payment Instructions:</h4>
                    <p className="text-sm text-gray-600 mb-1">Bank: HDFC Bank</p>
                    <p className="text-sm text-gray-600 mb-1">Account Name: QuickBid Technologies Pvt Ltd</p>
                    <p className="text-sm text-gray-600 mb-1">Account Number: XXXX-XXXX-XXXX-1234</p>
                    <p className="text-sm text-gray-600">IFSC Code: HDFC0001234</p>
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
                  Send Invoice
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 