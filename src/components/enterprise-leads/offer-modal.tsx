"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Eye, Download, Send } from "lucide-react";

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  email: string;
  onSend: (offerData: OfferData) => void;
  requirements?: {
    companies: number;
    devices: string;
    tenders: string;
    aiQueries: number;
    storageSpace: string;
  };
}

interface OfferData {
  baseLicense: number;
  perCompanyFee: number;
  storagePrice: number;
  aiQueryPrice: number;
  discount: number;
  validUntil: string;
  gstType: "igst" | "sgst_cgst" | "none";
  revisedRequirements: {
    companies: number;
    devices: string;
    tenders: string;
    aiQueries: number;
    storageSpace: string;
  };
}

export function OfferModal({
  isOpen,
  onClose,
  companyName,
  email,
  onSend,
  requirements = {
    companies: 5,
    devices: "10",
    tenders: "50",
    aiQueries: 1000,
    storageSpace: "100GB"
  }
}: OfferModalProps) {
  const [offerData, setOfferData] = useState<OfferData>({
    baseLicense: 50000,
    perCompanyFee: 5000,
    storagePrice: 10000,
    aiQueryPrice: 15000,
    discount: 0,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    gstType: "igst",
    revisedRequirements: {
      companies: requirements.companies,
      devices: requirements.devices,
      tenders: requirements.tenders,
      aiQueries: requirements.aiQueries,
      storageSpace: requirements.storageSpace
    }
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'revisedRequirements') {
        setOfferData(prev => ({
          ...prev,
          revisedRequirements: {
            ...prev.revisedRequirements,
            [child]: child === 'companies' || child === 'aiQueries' 
              ? Number(value) 
              : value
          }
        }));
      }
    } else {
      setOfferData(prev => ({
        ...prev,
        [name]: name === 'validUntil' || name === 'gstType' ? value : Number(value)
      }));
    }
  };

  const totalBeforeDiscount = offerData.baseLicense + 
    (offerData.revisedRequirements.companies * offerData.perCompanyFee) + 
    offerData.storagePrice + 
    offerData.aiQueryPrice;
    
  const discountAmount = (totalBeforeDiscount * offerData.discount) / 100;
  const subtotal = totalBeforeDiscount - discountAmount;
  
  let gstAmount = 0;
  if (offerData.gstType === "igst") {
    gstAmount = subtotal * 0.18;
  } else if (offerData.gstType === "sgst_cgst") {
    gstAmount = subtotal * 0.18; // 9% SGST + 9% CGST = 18%
  }
  
  const finalPrice = subtotal + gstAmount;
  
  const handlePreviewOffer = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShowPreview(true);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleDownloadOffer = () => {
    console.log("Downloading offer...");
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', `Offer-${companyName.replace(/\s+/g, '-')}.pdf`);
    link.click();
  };
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Create Offer</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {!showPreview ? (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Create a custom offer for {companyName}:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Pricing Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Pricing Details</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm text-gray-600">Base License (₹)</label>
                    <input
                      type="number"
                      name="baseLicense"
                      value={offerData.baseLicense}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm text-gray-600">Per Company Fee (₹)</label>
                    <input
                      type="number"
                      name="perCompanyFee"
                      value={offerData.perCompanyFee}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm text-gray-600">Storage Price (₹)</label>
                    <input
                      type="number"
                      name="storagePrice"
                      value={offerData.storagePrice}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm text-gray-600">AI Query Price (₹)</label>
                    <input
                      type="number"
                      name="aiQueryPrice"
                      value={offerData.aiQueryPrice}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm text-gray-600">Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={offerData.discount}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm text-gray-600">GST Type</label>
                    <select
                      name="gstType"
                      value={offerData.gstType}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="igst">IGST (18%)</option>
                      <option value="sgst_cgst">SGST + CGST (9% + 9%)</option>
                      <option value="none">No GST</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm text-gray-600">Valid Until</label>
                    <input
                      type="date"
                      name="validUntil"
                      value={offerData.validUntil}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Requirements Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Revise Requirements</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm text-gray-600">Number of Companies</label>
                    <input
                      type="number"
                      name="revisedRequirements.companies"
                      value={offerData.revisedRequirements.companies}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm text-gray-600">Number of Devices</label>
                    <input
                      type="text"
                      name="revisedRequirements.devices"
                      value={offerData.revisedRequirements.devices}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm text-gray-600">Number of Tenders</label>
                    <input
                      type="text"
                      name="revisedRequirements.tenders"
                      value={offerData.revisedRequirements.tenders}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm text-gray-600">AI Queries</label>
                    <input
                      type="number"
                      name="revisedRequirements.aiQueries"
                      value={offerData.revisedRequirements.aiQueries}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm text-gray-600">Storage Space</label>
                    <input
                      type="text"
                      name="revisedRequirements.storageSpace"
                      value={offerData.revisedRequirements.storageSpace}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Base License</span>
                <span className="text-sm">₹{offerData.baseLicense.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">
                  Per Company Fee ({offerData.revisedRequirements.companies} companies)
                </span>
                <span className="text-sm">₹{(offerData.revisedRequirements.companies * offerData.perCompanyFee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="text-sm">₹{offerData.storagePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">AI Queries</span>
                <span className="text-sm">₹{offerData.aiQueryPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-1 border-t border-gray-200 pt-1">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-sm">₹{totalBeforeDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Discount ({offerData.discount}%)</span>
                <span className="text-sm">-₹{discountAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-1 border-t border-gray-200 pt-1">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm">₹{subtotal.toLocaleString()}</span>
              </div>
              {offerData.gstType !== "none" && (
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    {offerData.gstType === "igst" ? "IGST (18%)" : "SGST (9%) + CGST (9%)"}
                  </span>
                  <span className="text-sm">₹{gstAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-medium border-t border-gray-200 pt-1">
                <span className="text-sm">Final Price</span>
                <span className="text-sm">₹{finalPrice.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex justify-center mb-4">
              <Button 
                onClick={handlePreviewOffer}
                disabled={isLoading}
                className="flex items-center"
                type="button"
              >
                {isLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Generating Preview..." : "Preview Offer"}
              </Button>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  onSend(offerData);
                  onClose();
                }}
                type="button"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Offer
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
              <div className="bg-gray-100 p-2 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center">
                  <span className="text-sm font-medium">Offer-{companyName.replace(/\s+/g, '-')}.pdf</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDownloadOffer}
                  className="h-8 px-2"
                  type="button"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-96 bg-white p-6 overflow-y-auto">
                {/* Offer Preview Content */}
                <div className="mx-auto max-w-2xl">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">OFFER</h2>
                      <p className="text-sm text-gray-600 mt-1">Ref: QBO-{Date.now().toString().slice(-6)}</p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold">QuickBid CRM</h3>
                      <p className="text-sm text-gray-600">123 Business Avenue</p>
                      <p className="text-sm text-gray-600">Mumbai, Maharashtra</p>
                      <p className="text-sm text-gray-600">India</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Client</h3>
                    <p className="text-sm text-gray-700 mb-1">{companyName}</p>
                    <p className="text-sm text-gray-700 mb-4">{email}</p>
                    
                    <p className="text-sm text-gray-700 mb-4">
                      Date: {new Date().toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700 mb-4">
                      Valid Until: {new Date(offerData.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-2">Enterprise Requirements</h3>
                    <table className="w-full mb-4 text-sm">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2">Number of Companies</td>
                          <td className="py-2 text-right">{offerData.revisedRequirements.companies}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2">Number of Devices</td>
                          <td className="py-2 text-right">{offerData.revisedRequirements.devices}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2">Number of Tenders</td>
                          <td className="py-2 text-right">{offerData.revisedRequirements.tenders}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2">AI Queries</td>
                          <td className="py-2 text-right">{offerData.revisedRequirements.aiQueries}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2">Storage Space</td>
                          <td className="py-2 text-right">{offerData.revisedRequirements.storageSpace}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-2">Pricing Details</h3>
                    <table className="w-full mb-4">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-sm">Base License</td>
                          <td className="py-2 text-sm text-right">₹{offerData.baseLicense.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-sm">Per Company Fee ({offerData.revisedRequirements.companies} companies)</td>
                          <td className="py-2 text-sm text-right">₹{(offerData.revisedRequirements.companies * offerData.perCompanyFee).toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-sm">Storage</td>
                          <td className="py-2 text-sm text-right">₹{offerData.storagePrice.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-sm">AI Queries</td>
                          <td className="py-2 text-sm text-right">₹{offerData.aiQueryPrice.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-sm">Total</td>
                          <td className="py-2 text-sm text-right">₹{totalBeforeDiscount.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-sm">Discount ({offerData.discount}%)</td>
                          <td className="py-2 text-sm text-right">-₹{discountAmount.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-sm">Subtotal</td>
                          <td className="py-2 text-sm text-right">₹{subtotal.toLocaleString()}</td>
                        </tr>
                        {offerData.gstType !== "none" && (
                          <tr className="border-b border-gray-200">
                            <td className="py-2 text-sm">
                              {offerData.gstType === "igst" ? "IGST (18%)" : "SGST (9%) + CGST (9%)"}
                            </td>
                            <td className="py-2 text-sm text-right">₹{gstAmount.toLocaleString()}</td>
                          </tr>
                        )}
                        <tr>
                          <td className="py-2 text-sm font-semibold">Final Price</td>
                          <td className="py-2 text-sm font-semibold text-right">₹{finalPrice.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-2">Terms & Conditions</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      <li>This offer is valid until {new Date(offerData.validUntil).toLocaleDateString()}</li>
                      <li>Payment terms: 50% advance, 50% upon delivery</li>
                      <li>Implementation timeline: 4-6 weeks from date of order</li>
                      <li>Includes 1 year of technical support and updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(false)}
                type="button"
              >
                Back
              </Button>
              <div className="space-x-2">
                <Button 
                  variant="outline"
                  onClick={handleDownloadOffer}
                  type="button"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={() => {
                    onSend(offerData);
                    onClose();
                  }}
                  type="button"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Offer
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 