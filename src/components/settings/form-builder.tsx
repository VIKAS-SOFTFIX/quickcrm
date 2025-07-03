"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from "@hello-pangea/dnd";
import {
  Grip,
  Plus,
  Trash2,
  Type,
  CheckSquare,
  List,
  Mail,
  Phone,
  Calendar,
  FileText,
  ToggleLeft,
  Star,
  ListChecks,
  ListFilter,
  Video,
  PhoneCall,
  Briefcase,
  MessageSquare,
  Building2
} from "lucide-react";
import Image from 'next/image';

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  isMultiple?: boolean;
}

export interface FormStyle {
  buttonColor: string;
  logoUrl?: string;
}

export type FormType = 'book_demo' | 'lead' | 'callback_request' | 'expert_consultation' | 'enterprise_query';

export interface FormConfig {
  type: FormType;
  title: string;
  description: string;
}

interface FormBuilderProps {
  fields: FormField[];
  style: FormStyle;
  config: FormConfig;
  onChange: (fields: FormField[]) => void;
  onStyleChange: (style: FormStyle) => void;
  onConfigChange: (config: FormConfig) => void;
}

const formTypes = [
  { 
    id: 'book_demo' as FormType, 
    label: 'Book Demo', 
    icon: Video,
    description: 'Schedule product demonstrations',
    defaultTitle: 'Book a Demo',
    defaultDescription: 'Schedule a personalized demo of our product'
  },
  { 
    id: 'lead' as FormType, 
    label: 'Lead Capture', 
    icon: MessageSquare,
    description: 'Capture potential customer information',
    defaultTitle: 'Contact Us',
    defaultDescription: 'Get in touch with our team'
  },
  { 
    id: 'callback_request' as FormType, 
    label: 'Callback Request', 
    icon: PhoneCall,
    description: 'Request a callback from the team',
    defaultTitle: 'Request Callback',
    defaultDescription: 'Leave your details and we\'ll call you back'
  },
  { 
    id: 'expert_consultation' as FormType, 
    label: 'Expert Consultation', 
    icon: Briefcase,
    description: 'Book consultation with experts',
    defaultTitle: 'Expert Consultation',
    defaultDescription: 'Schedule a consultation with our experts'
  },
  { 
    id: 'enterprise_query' as FormType, 
    label: 'Enterprise Query', 
    icon: Building2,
    description: 'Enterprise-specific inquiries',
    defaultTitle: 'Enterprise Solutions',
    defaultDescription: 'Learn about our enterprise offerings'
  }
];

const fieldTypes = [
  { id: "text", label: "Text Input", icon: Type },
  { id: "email", label: "Email", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "textarea", label: "Text Area", icon: FileText },
  { id: "checkbox", label: "Single Checkbox", icon: CheckSquare },
  { id: "checkboxes", label: "Multiple Checkboxes", icon: ListChecks },
  { id: "select", label: "Single Select", icon: List },
  { id: "multiselect", label: "Multiple Select", icon: ListFilter },
  { id: "date", label: "Date", icon: Calendar },
  { id: "toggle", label: "Toggle", icon: ToggleLeft },
  { id: "rating", label: "Rating", icon: Star },
];

export function FormBuilder({ fields, style, config, onChange, onStyleChange, onConfigChange }: FormBuilderProps) {
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleFormTypeChange = (type: FormType) => {
    const selectedType = formTypes.find(t => t.id === type);
    if (selectedType) {
      onConfigChange({
        type,
        title: selectedType.defaultTitle,
        description: selectedType.defaultDescription
      });
    }
  };

  const addField = (type: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      placeholder: "",
      required: false,
      options: ["Option 1", "Option 2", "Option 3"],
      isMultiple: type === "multiselect" || type === "checkboxes",
    };
    onChange([...fields, newField]);
    setEditingField(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const removeField = (id: string) => {
    onChange(fields.filter((field) => field.id !== id));
    if (editingField === id) {
      setEditingField(null);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  return (
    <div className="space-y-6">
      {/* Form Type Selection */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Form Type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {formTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleFormTypeChange(type.id)}
                className={`flex flex-col items-center p-4 rounded-lg border ${
                  config.type === type.id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-500 hover:bg-teal-50'
                } transition-colors`}
              >
                <Icon className={`w-6 h-6 ${
                  config.type === type.id ? 'text-teal-600' : 'text-gray-600'
                }`} />
                <span className="text-sm mt-2 text-center">{type.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Form Title and Description */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Form Details</h3>
        <div className="space-y-4">
          <div>
            <Label>Form Title</Label>
            <Input
              value={config.title}
              onChange={(e) => onConfigChange({ ...config, title: e.target.value })}
              placeholder="Enter form title"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Form Description</Label>
            <textarea
              value={config.description}
              onChange={(e) => onConfigChange({ ...config, description: e.target.value })}
              placeholder="Enter form description"
              className="w-full min-h-[80px] mt-1 p-2 border rounded-md"
            />
          </div>
        </div>
      </Card>

      {/* Form Style Customization */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Form Style</h3>
        <div className="space-y-4">
          <div>
            <Label>Button Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="color"
                value={style.buttonColor}
                onChange={(e) => onStyleChange({ ...style, buttonColor: e.target.value })}
                className="w-12 h-8 p-1"
              />
              <Input
                type="text"
                value={style.buttonColor}
                onChange={(e) => onStyleChange({ ...style, buttonColor: e.target.value })}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label>Logo URL (optional)</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="url"
                value={style.logoUrl || ""}
                onChange={(e) => onStyleChange({ ...style, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="flex-1"
              />
              {style.logoUrl && (
                <Image
                  src={style.logoUrl}
                  alt="Form Logo Preview"
                  className="w-8 h-8 object-contain"
                  width={32}
                  height={32}
                  onError={(e) => {
                    e.currentTarget.src = "";
                    onStyleChange({ ...style, logoUrl: "" });
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Available Field Types */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Add Field</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {fieldTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => addField(type.id)}
                className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors"
              >
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="text-xs mt-1 text-gray-600">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Fields */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="form-fields">
          {(provided: DroppableProvided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {fields.map((field, index) => (
                <Draggable
                  key={field.id}
                  draggableId={field.id}
                  index={index}
                >
                  {(provided: DraggableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="group"
                    >
                      <Card className="p-4">
                        <div className="flex items-start gap-4">
                          <div
                            {...provided.dragHandleProps}
                            className="mt-2 cursor-move text-gray-400 hover:text-gray-600"
                          >
                            <Grip className="w-5 h-5" />
                          </div>

                          <div className="flex-1">
                            {editingField === field.id ? (
                              <div className="space-y-4">
                                <div>
                                  <Label>Field Label</Label>
                                  <Input
                                    value={field.label}
                                    onChange={(e) =>
                                      updateField(field.id, {
                                        label: e.target.value,
                                      })
                                    }
                                    className="mt-1"
                                  />
                                </div>

                                <div>
                                  <Label>Placeholder</Label>
                                  <Input
                                    value={field.placeholder || ""}
                                    onChange={(e) =>
                                      updateField(field.id, {
                                        placeholder: e.target.value,
                                      })
                                    }
                                    className="mt-1"
                                  />
                                </div>

                                {(field.type === "select" || 
                                  field.type === "multiselect" || 
                                  field.type === "checkboxes") && (
                                  <div>
                                    <Label>Options (one per line)</Label>
                                    <textarea
                                      value={field.options?.join("\n")}
                                      onChange={(e) =>
                                        updateField(field.id, {
                                          options: e.target.value
                                            .split("\n")
                                            .filter(Boolean),
                                        })
                                      }
                                      className="mt-1 w-full min-h-[100px] p-2 border rounded-md"
                                    />
                                  </div>
                                )}

                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      id={`required-${field.id}`}
                                      checked={field.required}
                                      onChange={(e) =>
                                        updateField(field.id, {
                                          required: e.target.checked,
                                        })
                                      }
                                      className="mr-2"
                                    />
                                    <Label htmlFor={`required-${field.id}`}>
                                      Required field
                                    </Label>
                                  </div>

                                  {(field.type === "select" || field.type === "checkbox") && (
                                    <div className="flex items-center">
                                      <input
                                        type="checkbox"
                                        id={`multiple-${field.id}`}
                                        checked={field.isMultiple}
                                        onChange={(e) =>
                                          updateField(field.id, {
                                            isMultiple: e.target.checked,
                                            type: field.type === "select" 
                                              ? e.target.checked ? "multiselect" : "select"
                                              : e.target.checked ? "checkboxes" : "checkbox"
                                          })
                                        }
                                        className="mr-2"
                                      />
                                      <Label htmlFor={`multiple-${field.id}`}>
                                        Allow multiple
                                      </Label>
                                    </div>
                                  )}
                                </div>

                                <div className="flex justify-end">
                                  <Button
                                    size="sm"
                                    onClick={() => setEditingField(null)}
                                  >
                                    Done
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{field.label}</h4>
                                  <p className="text-sm text-gray-500">
                                    {field.type} {field.required && "(Required)"}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingField(field.id)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => removeField(field.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {fields.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-gray-500">
            No fields added yet. Click on a field type above to start building your
            form.
          </div>
        </div>
      )}
    </div>
  );
} 