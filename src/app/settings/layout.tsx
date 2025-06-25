"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CreditCard,
  Users
} from "lucide-react";

const settingsTabs = [
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
    href: "/settings/profile"
  },
  {
    value: "company",
    label: "Company",
    icon: Building2,
    href: "/settings/company"
  },
  {
    value: "appearance",
    label: "Appearance",
    icon: Palette,
    href: "/settings/appearance"
  },
  {
    value: "notifications",
    label: "Notifications",
    icon: Bell,
    href: "/settings/notifications"
  },
  {
    value: "security",
    label: "Security",
    icon: Lock,
    href: "/settings/security"
  },
  {
    value: "integrations",
    label: "Integrations",
    icon: Code,
    href: "/settings/integrations"
  },
  {
    value: "email",
    label: "Email",
    icon: Mail,
    href: "/settings/email"
  },
  {
    value: "billing",
    label: "Billing",
    icon: CreditCard,
    href: "/settings/billing"
  },
  {
    value: "team",
    label: "Team",
    icon: Users,
    href: "/settings/team"
  }
];

export default function SettingsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = settingsTabs.find(tab => tab.href === pathname)?.value || "general";

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-500">Manage your account settings and preferences</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Navigation */}
            <div className="w-full md:w-64 shrink-0">
              <nav className="space-y-1">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = pathname === tab.href;
                  
                  return (
                    <button
                      key={tab.value}
                      onClick={() => router.push(tab.href)}
                      className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-teal-50 text-teal-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${
                        isActive ? "text-teal-500" : "text-gray-400"
                      }`} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
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