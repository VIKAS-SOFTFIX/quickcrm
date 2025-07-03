"use client";

import { useState } from "react";
import { Edit, Trash2, Copy, Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from 'next/image';

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

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
        {template.thumbnail && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}
            <Image 
              src={template.thumbnail} 
              alt={template.name}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              loading="lazy"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'cover' }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 p-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="mb-2"
            >
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M12 12H2" />
              <path d="M22 12h-4" />
              <path d="M12 6v12" />
            </svg>
            <span className="text-xs text-center">Template Preview</span>
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