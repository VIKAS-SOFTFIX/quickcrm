"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateStep } from "./template-step";
import { RecipientsStep } from "./recipients-step";
import { SettingsStep } from "./settings-step";
import { ReviewStep } from "./review-step";
import { EmailTemplate } from "../email-template-card";

export interface CampaignData {
  name: string;
  subject: string;
  template: EmailTemplate | null;
  recipients: {
    dataSource: 'gem' | 'msme' | 'manual';
    batch?: string;
    state?: string;
    product?: string;
    category?: string;
    district?: string;
    emails: string[];
    count: number;
  };
  settings: {
    sendTime: 'now' | 'later';
    scheduledTime?: Date;
    fromName: string;
    fromEmail: string;
    replyToEmail: string;
  };
}

interface CampaignWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: CampaignData) => void;
  templates: EmailTemplate[];
}

export function CampaignWizard({
  isOpen,
  onClose,
  onSave,
  templates
}: CampaignWizardProps) {
  const [step, setStep] = useState(1);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    subject: "",
    template: null,
    recipients: {
      dataSource: 'manual',
      emails: [],
      count: 0
    },
    settings: {
      sendTime: 'now',
      fromName: "QuickCRM",
      fromEmail: "marketing@quickcrm.com",
      replyToEmail: "support@quickcrm.com"
    }
  });
  
  const steps = [
    { id: 1, name: 'Template' },
    { id: 2, name: 'Recipients' },
    { id: 3, name: 'Settings' },
    { id: 4, name: 'Review' },
  ];
  
  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleTemplateSelect = (template: EmailTemplate) => {
    setCampaignData(prev => ({
      ...prev,
      template,
      name: prev.name || `Campaign using ${template.name}`,
      subject: prev.subject || template.subject
    }));
  };
  
  const handleTemplateNameChange = (name: string) => {
    setCampaignData(prev => ({
      ...prev,
      name
    }));
  };
  
  const handleTemplateSubjectChange = (subject: string) => {
    setCampaignData(prev => ({
      ...prev,
      subject
    }));
  };
  
  const handleRecipientsChange = (recipients: CampaignData['recipients']) => {
    setCampaignData(prev => ({
      ...prev,
      recipients
    }));
  };
  
  const handleSettingsChange = (settings: CampaignData['settings']) => {
    setCampaignData(prev => ({
      ...prev,
      settings
    }));
  };
  
  const handleSave = () => {
    onSave(campaignData);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Create Email Campaign</h2>
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center">
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-medium
                    ${step === s.id 
                      ? 'bg-teal-500 text-white' 
                      : step > s.id 
                        ? 'bg-teal-100 text-teal-700' 
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {s.id}
                </div>
                <span 
                  className={`
                    ml-2 hidden sm:block
                    ${step === s.id 
                      ? 'text-teal-700 font-medium' 
                      : step > s.id 
                        ? 'text-teal-600' 
                        : 'text-gray-500'
                    }
                  `}
                >
                  {s.name}
                </span>
                {s.id < steps.length && (
                  <div className="w-12 sm:w-24 h-1 mx-2 bg-gray-200">
                    <div 
                      className={`h-full bg-teal-500 transition-all duration-300 ${
                        step > s.id ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <TemplateStep 
              templates={templates}
              selectedTemplate={campaignData.template}
              onSelectTemplate={handleTemplateSelect}
              campaignName={campaignData.name}
              onCampaignNameChange={handleTemplateNameChange}
              subject={campaignData.subject}
              onSubjectChange={handleTemplateSubjectChange}
            />
          )}
          
          {step === 2 && (
            <RecipientsStep 
              recipients={campaignData.recipients}
              onRecipientsChange={handleRecipientsChange}
            />
          )}
          
          {step === 3 && (
            <SettingsStep 
              settings={campaignData.settings}
              onSettingsChange={handleSettingsChange}
            />
          )}
          
          {step === 4 && (
            <ReviewStep 
              campaign={campaignData}
            />
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-between">
          <Button
            variant="outline"
            onClick={step === 1 ? onClose : handleBack}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          <Button
            onClick={step === steps.length ? handleSave : handleNext}
            disabled={
              (step === 1 && !campaignData.template) ||
              (step === 2 && campaignData.recipients.count === 0)
            }
            className={
              step === steps.length 
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600'
                : ''
            }
          >
            {step === steps.length ? 'Launch Campaign' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
} 