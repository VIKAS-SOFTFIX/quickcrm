"use client";

import { useState } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { EmailTemplate } from "../email-template-card";
import { Button } from "@/components/ui/button";

interface TemplateStepProps {
  templates: EmailTemplate[];
  selectedTemplate: EmailTemplate | null;
  onSelectTemplate: (template: EmailTemplate) => void;
  campaignName: string;
  onCampaignNameChange: (name: string) => void;
  subject: string;
  onSubjectChange: (subject: string) => void;
}

export function TemplateStep({
  templates,
  selectedTemplate,
  onSelectTemplate,
  campaignName,
  onCampaignNameChange,
  subject,
  onSubjectChange
}: TemplateStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState("Marketing");
  
  // Get unique categories
  const categories = Array.from(new Set(templates.map(t => t.category)));
  
  // Filter templates by search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === null || template.category === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateTemplate = () => {
    if (!isCreatingTemplate) {
      setIsCreatingTemplate(true);
      return;
    }

    if (!newTemplateName.trim()) {
      return;
    }

    // Generate a random Unsplash image related to business/email
    const unsplashKeywords = [
      "business", "email", "marketing", "office", "computer", 
      "technology", "digital", "communication", "professional"
    ];
    const randomKeyword = unsplashKeywords[Math.floor(Math.random() * unsplashKeywords.length)];
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    const imageUrl = `https://source.unsplash.com/featured/?${randomKeyword}&sig=${randomNumber}`;

    // Create new template
    const newTemplate: EmailTemplate = {
      id: `new-template-${Date.now()}`,
      name: newTemplateName,
      subject: `${newTemplateName} Subject`,
      previewText: `Preview text for ${newTemplateName}`,
      thumbnail: imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: newTemplateCategory
    };

    // Select the new template
    onSelectTemplate(newTemplate);
    
    // Reset form
    setIsCreatingTemplate(false);
    setNewTemplateName("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Campaign Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => onCampaignNameChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter campaign name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter email subject line"
            />
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Select a Template</h3>
          
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search templates..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={filter || ""}
              onChange={(e) => setFilter(e.target.value === "" ? null : e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Create new template card */}
          <div 
            className={`
              border border-dashed rounded-lg flex flex-col items-center justify-center p-6 h-64 
              transition-colors cursor-pointer
              ${isCreatingTemplate 
                ? 'border-teal-500 bg-teal-50' 
                : 'border-gray-300 hover:border-teal-500 hover:bg-teal-50'
              }
            `}
            onClick={handleCreateTemplate}
          >
            {!isCreatingTemplate ? (
              <>
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-medium text-gray-900">Create New Template</h3>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Design a custom email template from scratch
                </p>
              </>
            ) : (
              <div className="w-full space-y-4">
                <h3 className="font-medium text-gray-900 text-center">New Template</h3>
                
                <div>
                  <input
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Template name"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div>
                  <select
                    value={newTemplateCategory}
                    onChange={(e) => setNewTemplateCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateTemplate();
                    }}
                    disabled={!newTemplateName.trim()}
                    className="w-full"
                    type="button"
                  >
                    Create Template
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Template cards */}
          {filteredTemplates.map(template => (
            <div 
              key={template.id}
              className={`
                border rounded-lg overflow-hidden cursor-pointer transition-all
                ${selectedTemplate?.id === template.id 
                  ? 'border-teal-500 ring-2 ring-teal-500/20' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }
              `}
              onClick={() => onSelectTemplate(template)}
            >
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                {template.thumbnail ? (
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}
                
                {template.isDefault && (
                  <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
                    Default
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1 truncate">{template.subject}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    {template.updatedAt.toLocaleDateString()}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {template.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {filteredTemplates.length === 0 && !isCreatingTemplate && (
            <div className="col-span-full py-8 text-center text-gray-500">
              No templates found. Try adjusting your search or filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 