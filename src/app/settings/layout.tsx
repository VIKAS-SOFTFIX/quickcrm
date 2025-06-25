"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useRouter, usePathname } from "next/navigation";
import {
  Settings,
  UserCircle,
  Building2,
  Palette,
  Bell,
  Lock,
  Code,
  Mail,
  FileText,
  Languages,
  Clock,
  Smartphone,
  Search,
  MessageSquare,
  Globe,
  BarChart3,
  Share2,
  Megaphone
} from "lucide-react";

// Organized settings tabs into groups
const settingsGroups = [
  {
    title: "Account",
    items: [
      {
        value: "general",
        label: "General",
        icon: Settings,
        href: "/settings"
      },
      {
        value: "profile",
        label: "Profile",
        icon: UserCircle,
        href: "/coming-soon"
      },
      {
        value: "company",
        label: "Company",
        icon: Building2,
        href: "/coming-soon"
      },
      {
        value: "security",
        label: "Security",
        icon: Lock,
        href: "/coming-soon"
      }
    ]
  },
  {
    title: "Marketing",
    items: [
      {
        value: "whatsapp-marketing",
        label: "WhatsApp",
        icon: MessageSquare,
        href: "/coming-soon"
      },
      {
        value: "email-marketing",
        label: "Email",
        icon: Mail,
        href: "/coming-soon"
      },
      {
        value: "sms-marketing",
        label: "SMS",
        icon: Megaphone,
        href: "/coming-soon"
      }
    ]
  },
  {
    title: "Advertising",
    items: [
      {
        value: "google-ads",
        label: "Google Ads",
        icon: BarChart3,
        href: "/coming-soon"
      },
      {
        value: "meta-ads",
        label: "Meta Ads",
        icon: Share2,
        href: "/coming-soon"
      }
    ]
  },
  {
    title: "SEO",
    items: [
      {
        value: "google-business",
        label: "Google Business",
        icon: Globe,
        href: "/coming-soon"
      },
      {
        value: "seo-tools",
        label: "SEO Tools",
        icon: Search,
        href: "/coming-soon"
      }
    ]
  },
  {
    title: "System",
    items: [
      {
        value: "integrations",
        label: "Integrations",
        icon: Code,
        href: "/settings/integrations"
      },
      {
        value: "appearance",
        label: "Appearance",
        icon: Palette,
        href: "/coming-soon"
      },
      {
        value: "notifications",
        label: "Notifications",
        icon: Bell,
        href: "/coming-soon"
      },
      {
        value: "language",
        label: "Language",
        icon: Languages,
        href: "/coming-soon"
      },
      {
        value: "timezone",
        label: "Time Zone",
        icon: Clock,
        href: "/coming-soon"
      },
      {
        value: "devices",
        label: "Connected Devices",
        icon: Smartphone,
        href: "/coming-soon"
      },
      {
        value: "documents",
        label: "Documents",
        icon: FileText,
        href: "/coming-soon"
      }
    ]
  }
];

export default function SettingsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-8">
        
          <div className="flex flex-col md:flex-row gap-8">
            {/* Navigation - Now with sticky positioning and scrolling */}
            <div className="w-full md:w-48 shrink-0">
              <div className="md:sticky md:top-20 md:max-h-[calc(100vh-120px)] md:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
              <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            {/* <p className="text-gray-500">Manage your account settings and preferences</p> */}
          </div>
                <nav className="mt-6 space-y-6 pb-4">
                  {settingsGroups.map((group) => (
                    <div key={group.title} className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                        {group.title}
                      </p>
                      {group.items.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = pathname === tab.href;
                        
                        return (
                          <button
                            key={tab.value}
                            onClick={() => router.push(tab.href)}
                            className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                              isActive
                                ? "bg-teal-50 text-teal-700"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Icon className={`mr-3 h-4 w-4 ${
                              isActive ? "text-teal-500" : "text-gray-400"
                            }`} />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 