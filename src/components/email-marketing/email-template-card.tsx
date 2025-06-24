"use client";

import { Edit, Trash2, Copy, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  previewText: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  isDefault?: boolean;
}

interface EmailTemplateCardProps {
  template: EmailTemplate;
  onSelect: (template: EmailTemplate) => void;
  onEdit: (template: EmailTemplate) => void;
  onDelete: (template: EmailTemplate) => void;
  onDuplicate: (template: EmailTemplate) => void;
  onPreview: (template: EmailTemplate) => void;
  isSelected?: boolean;
}

export function EmailTemplateCard({
  template,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
  isSelected = false
}: EmailTemplateCardProps) {
  return (
    <div 
      className={cn(
        "border rounded-lg overflow-hidden transition-all cursor-pointer group",
        isSelected 
          ? "border-teal-500 ring-2 ring-teal-500/20" 
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      )}
      onClick={() => onSelect(template)}
    >
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        {template.thumbnail ? (
          <img 
            src={template.thumbnail} 
            alt={template.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            No Preview
          </div>
        )}
        
        {template.isDefault && (
          <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
            Default
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template);
            }}
            className="p-2 bg-white/90 rounded-full hover:bg-white"
            title="Preview"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(template);
            }}
            className="p-2 bg-white/90 rounded-full hover:bg-white"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(template);
            }}
            className="p-2 bg-white/90 rounded-full hover:bg-white"
            title="Duplicate"
          >
            <Copy size={16} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(template);
            }}
            className="p-2 bg-white/90 rounded-full hover:bg-white"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
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
  );
} 