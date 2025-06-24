"use client";

import { Check, AlertCircle, Users, Calendar, Mail } from "lucide-react";
import { CampaignData } from "./campaign-wizard";

interface ReviewStepProps {
  campaign: CampaignData;
}

export function ReviewStep({ campaign }: ReviewStepProps) {
  const formatDate = (date?: Date) => {
    if (!date) return 'Immediately';
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Review Your Campaign</h3>
        <p className="text-gray-500">
          Please review your campaign details before launching. Once launched, your campaign will be processed and sent according to your settings.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium mb-2 flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              Campaign Details
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-[120px,1fr]">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium">{campaign.name}</span>
              </div>
              <div className="grid grid-cols-[120px,1fr]">
                <span className="text-gray-500">Subject:</span>
                <span className="font-medium">{campaign.subject}</span>
              </div>
              <div className="grid grid-cols-[120px,1fr]">
                <span className="text-gray-500">Template:</span>
                <span className="font-medium">{campaign.template?.name || 'Custom Template'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium mb-2 flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              Recipients
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-[120px,1fr]">
                <span className="text-gray-500">Source:</span>
                <span className="font-medium capitalize">{campaign.recipients.dataSource}</span>
              </div>
              <div className="grid grid-cols-[120px,1fr]">
                <span className="text-gray-500">Count:</span>
                <span className="font-medium">{campaign.recipients.count} recipients</span>
              </div>
              
              {campaign.recipients.dataSource === 'gem' && campaign.recipients.batch && (
                <div className="grid grid-cols-[120px,1fr]">
                  <span className="text-gray-500">Batch:</span>
                  <span className="font-medium">{campaign.recipients.batch}</span>
                </div>
              )}
              
              {campaign.recipients.dataSource === 'msme' && (
                <>
                  {campaign.recipients.state && (
                    <div className="grid grid-cols-[120px,1fr]">
                      <span className="text-gray-500">State:</span>
                      <span className="font-medium">{campaign.recipients.state}</span>
                    </div>
                  )}
                  {campaign.recipients.product && (
                    <div className="grid grid-cols-[120px,1fr]">
                      <span className="text-gray-500">Product:</span>
                      <span className="font-medium">{campaign.recipients.product}</span>
                    </div>
                  )}
                  {campaign.recipients.category && (
                    <div className="grid grid-cols-[120px,1fr]">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-medium">{campaign.recipients.category}</span>
                    </div>
                  )}
                  {campaign.recipients.district && (
                    <div className="grid grid-cols-[120px,1fr]">
                      <span className="text-gray-500">District:</span>
                      <span className="font-medium">{campaign.recipients.district}</span>
                    </div>
                  )}
                  {campaign.recipients.batch && (
                    <div className="grid grid-cols-[120px,1fr]">
                      <span className="text-gray-500">Batch:</span>
                      <span className="font-medium">{campaign.recipients.batch}</span>
                    </div>
                  )}
                </>
              )}
              
              {campaign.recipients.dataSource === 'manual' && campaign.recipients.emails.length > 0 && (
                <div className="mt-2">
                  <span className="text-gray-500 block mb-1">Email List:</span>
                  <div className="max-h-24 overflow-y-auto text-xs bg-white p-2 rounded border border-gray-200">
                    {campaign.recipients.emails.map((email, index) => (
                      <div key={index} className="mb-1">{email}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium mb-2 flex items-center">
              <Calendar className="h-5 w-5 text-purple-500 mr-2" />
              Delivery Settings
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-[120px,1fr]">
                <span className="text-gray-500">Send Time:</span>
                <span className="font-medium">
                  {campaign.settings.sendTime === 'now' 
                    ? 'Immediately after launch' 
                    : formatDate(campaign.settings.scheduledTime)
                  }
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium mb-2 flex items-center">
              <Mail className="h-5 w-5 text-teal-500 mr-2" />
              Sender Information
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-[120px,1fr]">
                <span className="text-gray-500">From Name:</span>
                <span className="font-medium">{campaign.settings.fromName}</span>
              </div>
              <div className="grid grid-cols-[120px,1fr]">
                <span className="text-gray-500">From Email:</span>
                <span className="font-medium">{campaign.settings.fromEmail}</span>
              </div>
              <div className="grid grid-cols-[120px,1fr]">
                <span className="text-gray-500">Reply-To:</span>
                <span className="font-medium">{campaign.settings.replyToEmail}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-medium mb-2 flex items-center text-yellow-800">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              Important Notes
            </h4>
            
            <div className="space-y-2 text-sm text-yellow-800">
              <p>
                Once launched, this campaign cannot be canceled if sent immediately. Scheduled campaigns can be canceled before their scheduled time.
              </p>
              <p>
                Make sure your recipient list complies with anti-spam regulations and that recipients have opted in to receive emails from you.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="bg-teal-50 rounded-lg p-4 border border-teal-200 flex items-start">
          <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium text-teal-800">Ready to Launch</h4>
            <p className="text-sm text-teal-700 mt-1">
              Your campaign is ready to be launched. Click the "Launch Campaign" button to proceed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 