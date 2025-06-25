"use client";

import { useState } from "react";
import { FormField, FormStyle, FormConfig } from "./form-builder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormPreviewProps {
  theme: string;
  template: string;
  fields: FormField[];
  style: FormStyle;
  config: FormConfig;
}

// Define the shape of form data
interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}

export function FormPreview({ theme, template, fields, style, config }: FormPreviewProps) {
  const [selectedValues, setSelectedValues] = useState<Record<string, any>>({});

  const handleValueChange = (fieldId: string, value: any) => {
    setSelectedValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const getFieldComponent = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            className="mt-1"
          />
        );
      case "textarea":
        return (
          <textarea
            placeholder={field.placeholder}
            className="w-full min-h-[100px] mt-1 p-2 border rounded-md"
          />
        );
      case "select":
        return (
          <Select
            value={selectedValues[field.id]}
            onValueChange={(value) => handleValueChange(field.id, value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "multiselect":
        return (
          <select
            multiple
            value={selectedValues[field.id] || []}
            onChange={(e) =>
              handleValueChange(
                field.id,
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            className="w-full mt-1 p-2 border rounded-md"
            size={Math.min(field.options?.length || 4, 4)}
          >
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <div className="flex items-center mt-1">
            <Checkbox
              id={field.id}
              checked={selectedValues[field.id] || false}
              onCheckedChange={(checked) => handleValueChange(field.id, checked)}
            />
            <label
              htmlFor={field.id}
              className="ml-2 text-sm text-gray-600"
            >
              {field.placeholder || field.label}
            </label>
          </div>
        );
      case "checkboxes":
        return (
          <div className="space-y-2 mt-1">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center">
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={
                    (selectedValues[field.id] || []).includes(option)
                  }
                  onCheckedChange={(checked) => {
                    const currentValues = selectedValues[field.id] || [];
                    const newValues = checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option);
                    handleValueChange(field.id, newValues);
                  }}
                />
                <label
                  htmlFor={`${field.id}-${option}`}
                  className="ml-2 text-sm text-gray-600"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case "date":
        return (
          <Input
            type="date"
            placeholder={field.placeholder}
            className="mt-1"
          />
        );
      case "toggle":
        return (
          <div className="flex items-center mt-1">
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                checked={selectedValues[field.id] || false}
                onChange={(e) => handleValueChange(field.id, e.target.checked)}
              />
              <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
            <span className="text-sm text-gray-600">
              {field.placeholder || field.label}
            </span>
          </div>
        );
      case "rating":
        return (
          <div className="flex items-center mt-1 space-x-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`text-2xl ${
                  (selectedValues[field.id] || 0) >= value
                    ? "text-yellow-400"
                    : "text-gray-300"
                } hover:text-yellow-400`}
                onClick={() => handleValueChange(field.id, value)}
              >
                ★
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`p-6 rounded-lg ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : theme === "light"
          ? "bg-white text-gray-900"
          : ""
      } ${
        template === "minimal"
          ? "space-y-4"
          : template === "modern"
          ? "space-y-6"
          : template === "classic"
          ? "space-y-5"
          : "space-y-4"
      }`}
    >
      {/* Logo */}
      {style.logoUrl && (
        <div className="flex justify-center mb-6">
          <img
            src={style.logoUrl}
            alt="Form Logo"
            className="max-h-16 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Form Title and Description */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">{config.title}</h2>
        <p className="text-gray-600 dark:text-gray-300">{config.description}</p>
      </div>

      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.id}>
            <Label>
              {field.label}
              {field.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>
            {getFieldComponent(field)}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button
          className={`${
            template === "minimal"
              ? "w-full"
              : template === "modern"
              ? "rounded-full px-8"
              : ""
          }`}
          style={{
            backgroundColor: style.buttonColor,
            borderColor: style.buttonColor,
            color: "#ffffff",
            "--button-hover-bg": style.buttonColor + "dd",
            "--button-hover-border": style.buttonColor + "dd",
          } as any}
        >
          Submit
        </Button>
      </div>

      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #68D391;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #68D391;
        }
        .toggle-label {
          transition: background-color 0.2s ease-in;
        }
      `}</style>
    </div>
  );
}

// Add TypeScript declaration
declare global {
  interface Window {
    QuickCRM?: {
      initLeadForm: (config: FormConfig) => void;
    };
  }
} 