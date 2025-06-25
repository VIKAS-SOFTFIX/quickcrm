"use client";

import { useEffect } from "react";
import Script from "next/script";

interface FormPreviewProps {
  theme: string;
  template: string;
}

export function FormPreview({ theme, template }: FormPreviewProps) {
  useEffect(() => {
    // Initialize form when script is loaded
    const initForm = () => {
      if (window.QuickCRM) {
        window.QuickCRM.initLeadForm({
          theme,
          template,
          apiKey: "preview-mode",
          onSubmit: (data) => {
            console.log("Preview form submitted:", data);
          }
        });
      }
    };

    // Try to initialize if script is already loaded
    initForm();

    // Re-initialize when theme or template changes
    const interval = setInterval(() => {
      if (window.QuickCRM) {
        clearInterval(interval);
        initForm();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [theme, template]);

  return (
    <>
      <Script src="/embed.js" />
      <div id="quickcrm-lead-form" />
    </>
  );
}

// Add TypeScript declaration
declare global {
  interface Window {
    QuickCRM?: {
      initLeadForm: (config: {
        theme: string;
        template: string;
        apiKey: string;
        onSubmit?: (data: any) => void;
      }) => void;
    };
  }
} 