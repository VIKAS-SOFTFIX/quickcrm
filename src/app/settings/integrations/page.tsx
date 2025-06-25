"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FormPreview } from "@/components/settings/form-preview";
import { FormBuilder, FormField, FormStyle, FormConfig, FormType } from "@/components/settings/form-builder";
import { 
  Code2, 
  Copy, 
  ExternalLink, 
  Check,
  Paintbrush,
  LayoutTemplate,
  Settings as SettingsIcon,
  Save
} from "lucide-react";

const DEFAULT_LOGO_URL = "https://quickbid.co.in/Assets/Images/logo.png";

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState("embed");
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [selectedTemplate, setSelectedTemplate] = useState("default");
  const [formStyle, setFormStyle] = useState<FormStyle>({
    buttonColor: "#10B981",
    logoUrl: DEFAULT_LOGO_URL,
  });
  const [formConfig, setFormConfig] = useState<FormConfig>({
    type: 'lead',
    title: 'Contact Us',
    description: 'Get in touch with our team'
  });
  const [formFields, setFormFields] = useState<FormField[]>([
    {
      id: "1",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true
    },
    {
      id: "2",
      type: "email",
      label: "Email Address",
      placeholder: "Enter your email",
      required: true
    }
  ]);
  
  const embedCode = `<div id="quickcrm-lead-form"></div>
<script src="https://app.quickcrm.com/embed.js"></script>
<script>
  QuickCRM.initLeadForm({
    theme: "${selectedTheme}",
    template: "${selectedTemplate}",
    fields: ${JSON.stringify(formFields, null, 2)},
    style: ${JSON.stringify(formStyle, null, 2)},
    config: ${JSON.stringify(formConfig, null, 2)},
    apiKey: "YOUR_API_KEY",
    onSubmit: function(data) {
      console.log("Lead submitted:", data);
    }
  });
</script>`;
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleSaveForm = () => {
    // TODO: Save form configuration to backend
    console.log("Saving form configuration:", {
      theme: selectedTheme,
      template: selectedTemplate,
      fields: formFields,
      style: formStyle,
      config: formConfig
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Integrations</h2>
          <p className="text-gray-500">Manage your integrations and embed forms</p>
        </div>
        <Button onClick={handleSaveForm} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="embed" className="flex items-center">
            <Code2 className="w-4 h-4 mr-2" />
            Embed Forms
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center">
            <SettingsIcon className="w-4 h-4 mr-2" />
            API Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="embed" className="space-y-6">
          {/* Form Builder */}
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Form Builder</h3>
            <FormBuilder 
              fields={formFields} 
              style={formStyle}
              config={formConfig}
              onChange={setFormFields}
              onStyleChange={setFormStyle}
              onConfigChange={setFormConfig}
            />
          </div>

          {/* Customization Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 flex items-center">
                <Paintbrush className="w-4 h-4 mr-2" />
                Theme
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {["light", "dark", "system"].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`p-3 border rounded-lg text-sm capitalize ${
                      selectedTheme === theme
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Template Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 flex items-center">
                <LayoutTemplate className="w-4 h-4 mr-2" />
                Template
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {["default", "minimal", "modern", "classic"].map((template) => (
                  <button
                    key={template}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-3 border rounded-lg text-sm capitalize ${
                      selectedTemplate === template
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Form Preview */}
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Form Preview</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <FormPreview 
                theme={selectedTheme} 
                template={selectedTemplate}
                fields={formFields}
                style={formStyle}
                config={formConfig}
              />
            </div>
          </div>
          
          {/* Embed Code */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Embed Code</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="flex items-center"
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">{embedCode}</code>
              </pre>
            </div>
          </div>
          
          {/* Documentation Link */}
          <div className="flex items-center justify-end">
            <a
              href="/docs/embed-form"
              className="text-sm text-teal-600 hover:text-teal-700 flex items-center"
            >
              View Documentation
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium mb-4">API Configuration</h3>
            <p className="text-gray-500">API settings content will be implemented later.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 