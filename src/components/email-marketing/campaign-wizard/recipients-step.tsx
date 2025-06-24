"use client";

import { useState, useEffect } from "react";
import { X, Plus, Upload, Users, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampaignData } from "./campaign-wizard";

interface RecipientsStepProps {
  recipients: CampaignData['recipients'];
  onRecipientsChange: (recipients: CampaignData['recipients']) => void;
}

export function RecipientsStep({
  recipients,
  onRecipientsChange
}: RecipientsStepProps) {
  const [emailInput, setEmailInput] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  
  // Mock data for GEM and MSME selection
  const gemBatches = [
    "Batch 1 - IT Companies (250 leads)",
    "Batch 2 - Healthcare (180 leads)",
    "Batch 3 - Education (210 leads)",
    "Batch 4 - Government (150 leads)",
    "Batch 5 - Manufacturing (320 leads)"
  ];
  
  const msmeStates = [
    "Maharashtra", "Gujarat", "Tamil Nadu", "Karnataka", 
    "Delhi", "Uttar Pradesh", "West Bengal"
  ];
  
  const msmeProducts = [
    "Software", "Hardware", "Consulting", "Manufacturing", 
    "Healthcare", "Education", "Finance"
  ];
  
  const msmeCategories = [
    "Micro", "Small", "Medium"
  ];
  
  const msmeDistricts: Record<string, string[]> = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"],
    "Delhi": ["Central Delhi", "East Delhi", "North Delhi", "South Delhi", "West Delhi"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Prayagraj"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"]
  };
  
  const msmeBatches: Record<string, string[]> = {
    "Mumbai": ["Batch 1 - IT (150 leads)", "Batch 2 - Finance (120 leads)"],
    "Pune": ["Batch 1 - Education (100 leads)", "Batch 2 - IT (90 leads)"],
    "Bengaluru": ["Batch 1 - Tech Startups (200 leads)", "Batch 2 - IT Services (180 leads)"],
    "Chennai": ["Batch 1 - Manufacturing (160 leads)", "Batch 2 - IT (140 leads)"]
  };
  
  // State for MSME hierarchical selection
  const [msmeState, setMsmeState] = useState<string>("");
  const [msmeProduct, setMsmeProduct] = useState<string>("");
  const [msmeCategory, setMsmeCategory] = useState<string>("");
  const [msmeDistrict, setMsmeDistrict] = useState<string>("");
  const [msmeBatch, setMsmeBatch] = useState<string>("");
  
  // Add manual email
  const handleAddEmail = () => {
    if (emailInput && /^\S+@\S+\.\S+$/.test(emailInput) && !recipients.emails.includes(emailInput)) {
      const updatedEmails = [...recipients.emails, emailInput];
      onRecipientsChange({
        ...recipients,
        emails: updatedEmails,
        count: updatedEmails.length
      });
      setEmailInput("");
    }
  };
  
  // Remove manual email
  const handleRemoveEmail = (email: string) => {
    const updatedEmails = recipients.emails.filter(e => e !== email);
    onRecipientsChange({
      ...recipients,
      emails: updatedEmails,
      count: updatedEmails.length
    });
  };
  
  // Handle data source change
  const handleDataSourceChange = (source: 'gem' | 'msme' | 'manual') => {
    onRecipientsChange({
      ...recipients,
      dataSource: source,
      batch: undefined,
      state: undefined,
      product: undefined,
      category: undefined,
      district: undefined
    });
    
    // Reset MSME selections when changing data source
    setMsmeState("");
    setMsmeProduct("");
    setMsmeCategory("");
    setMsmeDistrict("");
    setMsmeBatch("");
  };
  
  // Handle GEM batch selection
  const handleGemBatchSelect = (batch: string) => {
    // Extract lead count from batch name
    const countMatch = batch.match(/\((\d+) leads\)/);
    const count = countMatch ? parseInt(countMatch[1]) : 0;
    
    onRecipientsChange({
      ...recipients,
      batch,
      count
    });
  };
  
  // Handle MSME batch selection
  const handleMsmeBatchSelect = (batch: string) => {
    // Extract lead count from batch name
    const countMatch = batch.match(/\((\d+) leads\)/);
    const count = countMatch ? parseInt(countMatch[1]) : 0;
    
    onRecipientsChange({
      ...recipients,
      state: msmeState,
      product: msmeProduct,
      category: msmeCategory,
      district: msmeDistrict,
      batch,
      count
    });
  };
  
  // Update MSME selection when hierarchical values change
  useEffect(() => {
    if (recipients.dataSource === 'msme') {
      if (msmeDistrict && msmeBatches[msmeDistrict] && msmeBatches[msmeDistrict].length > 0) {
        setMsmeBatch(msmeBatches[msmeDistrict][0]);
        handleMsmeBatchSelect(msmeBatches[msmeDistrict][0]);
      } else {
        setMsmeBatch("");
        onRecipientsChange({
          ...recipients,
          state: msmeState,
          product: msmeProduct,
          category: msmeCategory,
          district: msmeDistrict,
          batch: undefined,
          count: 0
        });
      }
    }
  }, [msmeDistrict]);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Add Recipients</h3>
        
        <div className="flex items-center space-x-2 mb-6">
          <input
            type="text"
            placeholder="Email Address"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
          />
          <Button 
            onClick={handleAddEmail}
            disabled={!emailInput || !/^\S+@\S+\.\S+$/.test(emailInput)}
          >
            Add
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4 col-span-1">
            <h4 className="font-medium">Select Data Source Type</h4>
            
            <div className="space-y-2">
              <div 
                className={`
                  p-3 border rounded-lg cursor-pointer flex items-center
                  ${recipients.dataSource === 'manual' 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => handleDataSourceChange('manual')}
              >
                <div className={`w-4 h-4 rounded-full border ${recipients.dataSource === 'manual' ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                  {recipients.dataSource === 'manual' && (
                    <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                  )}
                </div>
                <span className="ml-2">Manual Entry</span>
              </div>
              
              <div 
                className={`
                  p-3 border rounded-lg cursor-pointer flex items-center
                  ${recipients.dataSource === 'gem' 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => handleDataSourceChange('gem')}
              >
                <div className={`w-4 h-4 rounded-full border ${recipients.dataSource === 'gem' ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                  {recipients.dataSource === 'gem' && (
                    <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                  )}
                </div>
                <span className="ml-2">GeM</span>
              </div>
              
              <div 
                className={`
                  p-3 border rounded-lg cursor-pointer flex items-center
                  ${recipients.dataSource === 'msme' 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => handleDataSourceChange('msme')}
              >
                <div className={`w-4 h-4 rounded-full border ${recipients.dataSource === 'msme' ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                  {recipients.dataSource === 'msme' && (
                    <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                  )}
                </div>
                <span className="ml-2">MSME</span>
              </div>
            </div>
          </div>
          
          <div className="col-span-2">
            {recipients.dataSource === 'manual' && (
              <div>
                <h4 className="font-medium mb-2">Manual Email List</h4>
                <div className="border border-gray-200 rounded-lg p-3 min-h-[200px] max-h-[300px] overflow-y-auto">
                  {recipients.emails.length > 0 ? (
                    <div className="space-y-2">
                      {recipients.emails.map((email) => (
                        <div key={email} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span className="text-sm">{email}</span>
                          <button 
                            onClick={() => handleRemoveEmail(email)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                      <Users className="h-8 w-8 mb-2" />
                      <p>No recipients added yet</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span>Total Recipients: {recipients.emails.length}</span>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Upload className="h-3 w-3 mr-1" />
                      Import CSV
                    </Button>
                    
                    <Button variant="outline" size="sm" className="text-xs">
                      <X className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {recipients.dataSource === 'gem' && (
              <div>
                <h4 className="font-medium mb-2">Select GeM Leads Batch</h4>
                <p className="text-sm text-gray-500 mb-4">
                  These batches were created from the GeM_Resellers.xlsx data file. Each batch contains unique recipients based on company type or email domain.
                </p>
                
                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {gemBatches.map((batch) => (
                    <div 
                      key={batch}
                      className={`
                        p-3 border rounded-lg cursor-pointer flex items-center
                        ${recipients.batch === batch 
                          ? 'border-teal-500 bg-teal-50' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      onClick={() => handleGemBatchSelect(batch)}
                    >
                      <div className={`w-4 h-4 rounded-full border ${recipients.batch === batch ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                        {recipients.batch === batch && (
                          <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                        )}
                      </div>
                      <span className="ml-2">{batch}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-sm">
                  <span>Selected Recipients: {recipients.count}</span>
                </div>
              </div>
            )}
            
            {recipients.dataSource === 'msme' && (
              <div>
                <h4 className="font-medium mb-2">Select MSME Leads Hierarchically</h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={msmeState}
                      onChange={(e) => {
                        setMsmeState(e.target.value);
                        setMsmeDistrict("");
                      }}
                    >
                      <option value="">Select State</option>
                      {msmeStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={msmeProduct}
                      onChange={(e) => setMsmeProduct(e.target.value)}
                    >
                      <option value="">Select Product</option>
                      {msmeProducts.map(product => (
                        <option key={product} value={product}>{product}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={msmeCategory}
                      onChange={(e) => setMsmeCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {msmeCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={msmeDistrict}
                      onChange={(e) => setMsmeDistrict(e.target.value)}
                      disabled={!msmeState}
                    >
                      <option value="">Select District</option>
                      {msmeState && msmeDistricts[msmeState]?.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch
                  </label>
                  <div className="space-y-2 max-h-[150px] overflow-y-auto">
                    {msmeDistrict && msmeBatches[msmeDistrict] ? (
                      msmeBatches[msmeDistrict].map((batch) => (
                        <div 
                          key={batch}
                          className={`
                            p-3 border rounded-lg cursor-pointer flex items-center
                            ${msmeBatch === batch 
                              ? 'border-teal-500 bg-teal-50' 
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                          onClick={() => {
                            setMsmeBatch(batch);
                            handleMsmeBatchSelect(batch);
                          }}
                        >
                          <div className={`w-4 h-4 rounded-full border ${msmeBatch === batch ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                            {msmeBatch === batch && (
                              <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                            )}
                          </div>
                          <span className="ml-2">{batch}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm p-3 border border-dashed border-gray-200 rounded-lg">
                        {msmeDistrict ? "No batches available for this district" : "Select a district to view available batches"}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 text-sm">
                  <span>Selected Recipients: {recipients.count}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium mb-2">Current Recipients ({recipients.count})</h4>
        {recipients.count > 0 ? (
          <div className="text-sm text-gray-600">
            {recipients.dataSource === 'manual' && (
              <p>{recipients.count} email addresses added manually</p>
            )}
            {recipients.dataSource === 'gem' && recipients.batch && (
              <p>Using {recipients.count} leads from {recipients.batch}</p>
            )}
            {recipients.dataSource === 'msme' && recipients.batch && (
              <p>Using {recipients.count} leads from {recipients.state}, {recipients.district}, {recipients.batch}</p>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            No recipients added yet
          </div>
        )}
      </div>
    </div>
  );
} 