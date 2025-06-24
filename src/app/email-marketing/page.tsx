"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Mail, FileText } from "lucide-react";
import { EmailTemplateCard, EmailTemplate } from "@/components/email-marketing/email-template-card";
import { CampaignList, EmailCampaign } from "@/components/email-marketing/campaign-list";
import { CampaignWizard, CampaignData } from "@/components/email-marketing/campaign-wizard/campaign-wizard";

// Mock data for templates
const mockTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Welcome Email",
    subject: "Welcome to QuickCRM!",
    previewText: "Get started with your new account",
    thumbnail: "https://via.placeholder.com/300x200?text=Welcome+Email",
    createdAt: new Date(2023, 3, 15),
    updatedAt: new Date(2023, 5, 20),
    category: "Onboarding",
    isDefault: true
  },
  {
    id: "2",
    name: "Monthly Newsletter",
    subject: "Your Monthly Update from QuickCRM",
    previewText: "See what's new this month",
    thumbnail: "https://via.placeholder.com/300x200?text=Newsletter",
    createdAt: new Date(2023, 2, 10),
    updatedAt: new Date(2023, 6, 5),
    category: "Newsletter"
  },
  {
    id: "3",
    name: "Product Announcement",
    subject: "Introducing Our New Feature",
    previewText: "Check out our latest product update",
    thumbnail: "https://via.placeholder.com/300x200?text=Product+Announcement",
    createdAt: new Date(2023, 4, 22),
    updatedAt: new Date(2023, 4, 22),
    category: "Marketing"
  },
  {
    id: "4",
    name: "Feedback Request",
    subject: "We'd Love Your Feedback",
    previewText: "Help us improve our service",
    thumbnail: "https://via.placeholder.com/300x200?text=Feedback",
    createdAt: new Date(2023, 1, 5),
    updatedAt: new Date(2023, 5, 12),
    category: "Engagement"
  },
  {
    id: "5",
    name: "Special Offer",
    subject: "Limited Time Offer Just for You",
    previewText: "Don't miss out on this special deal",
    thumbnail: "https://via.placeholder.com/300x200?text=Special+Offer",
    createdAt: new Date(2023, 5, 1),
    updatedAt: new Date(2023, 5, 1),
    category: "Marketing"
  }
];

// Mock data for campaigns
const mockCampaigns: EmailCampaign[] = [
  {
    id: "1",
    name: "June Newsletter",
    subject: "Your June Update from QuickCRM",
    status: "sent",
    sentAt: new Date(2023, 5, 15),
    recipients: 1250,
    opened: 875,
    clicked: 432,
    bounced: 25,
    unsubscribed: 5
  },
  {
    id: "2",
    name: "Product Launch Announcement",
    subject: "Introducing Our New Feature: AI Assistant",
    status: "scheduled",
    scheduledFor: new Date(2023, 7, 10),
    recipients: 2500,
    opened: 0,
    clicked: 0,
    bounced: 0,
    unsubscribed: 0
  },
  {
    id: "3",
    name: "Customer Feedback Survey",
    subject: "We'd Love Your Feedback on QuickCRM",
    status: "draft",
    recipients: 1800,
    opened: 0,
    clicked: 0,
    bounced: 0,
    unsubscribed: 0
  },
  {
    id: "4",
    name: "May Newsletter",
    subject: "Your May Update from QuickCRM",
    status: "sent",
    sentAt: new Date(2023, 4, 12),
    recipients: 1200,
    opened: 780,
    clicked: 356,
    bounced: 18,
    unsubscribed: 3
  },
  {
    id: "5",
    name: "Special Promotion",
    subject: "Limited Time Offer: 25% Off Premium Plan",
    status: "sending",
    sentAt: new Date(),
    recipients: 3500,
    opened: 120,
    clicked: 45,
    bounced: 12,
    unsubscribed: 0
  },
  {
    id: "6",
    name: "April Newsletter",
    subject: "Your April Update from QuickCRM",
    status: "sent",
    sentAt: new Date(2023, 3, 15),
    recipients: 1150,
    opened: 720,
    clicked: 310,
    bounced: 15,
    unsubscribed: 2
  }
];

export default function EmailMarketingPage() {
  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(mockCampaigns);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
  };
  
  const handleTemplateEdit = (template: EmailTemplate) => {
    // Handle template edit
    console.log("Edit template:", template);
  };
  
  const handleTemplateDelete = (template: EmailTemplate) => {
    // Handle template delete
    setTemplates(templates.filter(t => t.id !== template.id));
  };
  
  const handleTemplateDuplicate = (template: EmailTemplate) => {
    // Handle template duplicate
    const newTemplate: EmailTemplate = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: false
    };
    
    setTemplates([...templates, newTemplate]);
  };
  
  const handleTemplatePreview = (template: EmailTemplate) => {
    // Handle template preview
    console.log("Preview template:", template);
  };
  
  const handleViewCampaign = (campaign: EmailCampaign) => {
    // Handle view campaign
    console.log("View campaign:", campaign);
  };
  
  const handleDuplicateCampaign = (campaign: EmailCampaign) => {
    // Handle duplicate campaign
    console.log("Duplicate campaign:", campaign);
  };
  
  const handleDeleteCampaign = (campaign: EmailCampaign) => {
    // Handle delete campaign
    setCampaigns(campaigns.filter(c => c.id !== campaign.id));
  };
  
  const handleCreateCampaign = () => {
    setIsWizardOpen(true);
  };
  
  const handleSaveCampaign = (campaignData: CampaignData) => {
    // Create a new campaign from the wizard data
    const newCampaign: EmailCampaign = {
      id: `campaign-${Date.now()}`,
      name: campaignData.name,
      subject: campaignData.subject,
      status: campaignData.settings.sendTime === 'now' ? 'sending' : 'scheduled',
      sentAt: campaignData.settings.sendTime === 'now' ? new Date() : undefined,
      scheduledFor: campaignData.settings.sendTime === 'later' ? campaignData.settings.scheduledTime : undefined,
      recipients: campaignData.recipients.count,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0
    };
    
    setCampaigns([newCampaign, ...campaigns]);
    
    // If campaign is sent immediately, switch to the campaigns tab
    if (campaignData.settings.sendTime === 'now') {
      setActiveTab('campaigns');
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Email Marketing</h1>
          <p className="text-gray-500">Create and manage email campaigns</p>
        </div>
        
        <Button 
          className="mt-4 sm:mt-0"
          onClick={handleCreateCampaign}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>
      
      <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="templates" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            Campaigns
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <EmailTemplateCard
                key={template.id}
                template={template}
                onSelect={handleTemplateSelect}
                onEdit={handleTemplateEdit}
                onDelete={handleTemplateDelete}
                onDuplicate={handleTemplateDuplicate}
                onPreview={handleTemplatePreview}
                isSelected={selectedTemplate?.id === template.id}
              />
            ))}
            
            <div 
              className="border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors"
              onClick={() => {}}
            >
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                <PlusCircle className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-medium text-gray-900">Create Template</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Design a custom email template
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="campaigns">
          <CampaignList
            campaigns={campaigns}
            onViewCampaign={handleViewCampaign}
            onDuplicateCampaign={handleDuplicateCampaign}
            onDeleteCampaign={handleDeleteCampaign}
          />
        </TabsContent>
      </Tabs>
      
      <CampaignWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSave={handleSaveCampaign}
        templates={templates}
      />
    </div>
  );
} 