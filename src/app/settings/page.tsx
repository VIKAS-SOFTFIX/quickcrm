"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Globe, 
  Languages,
  Clock,
  Mail
} from "lucide-react";

export default function SettingsPage() {
  const [timeZone, setTimeZone] = useState("UTC");
  const [language, setLanguage] = useState("en");
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">General Settings</h2>
        <p className="text-gray-500">Manage your basic account preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Time Zone Settings */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-teal-50">
              <Clock className="w-5 h-5 text-teal-600" />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="timezone">Time Zone</Label>
              <select
                id="timezone"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
              <p className="text-sm text-gray-500">
                Choose your preferred time zone for accurate scheduling and reporting
              </p>
            </div>
          </div>
        </Card>

        {/* Language Settings */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-teal-50">
              <Languages className="w-5 h-5 text-teal-600" />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
              <p className="text-sm text-gray-500">
                Select your preferred language for the interface
              </p>
            </div>
          </div>
        </Card>

        {/* Email Notification Settings */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-teal-50">
              <Mail className="w-5 h-5 text-teal-600" />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="email-notifications"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">
                  Receive email notifications for important updates
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                We'll send you notifications about lead activity, task reminders, and system updates
              </p>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
} 