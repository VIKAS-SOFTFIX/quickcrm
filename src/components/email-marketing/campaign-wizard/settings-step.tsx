"use client";

import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { CampaignData } from "./campaign-wizard";

interface SettingsStepProps {
  settings: CampaignData['settings'];
  onSettingsChange: (settings: CampaignData['settings']) => void;
}

export function SettingsStep({
  settings,
  onSettingsChange
}: SettingsStepProps) {
  const [sendTime, setSendTime] = useState<'now' | 'later'>(settings.sendTime);
  const [scheduledDate, setScheduledDate] = useState<string>(
    settings.scheduledTime 
      ? settings.scheduledTime.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState<string>(
    settings.scheduledTime
      ? `${String(settings.scheduledTime.getHours()).padStart(2, '0')}:${String(settings.scheduledTime.getMinutes()).padStart(2, '0')}`
      : '09:00'
  );
  
  const handleSendTimeChange = (value: 'now' | 'later') => {
    setSendTime(value);
    
    if (value === 'now') {
      onSettingsChange({
        ...settings,
        sendTime: value,
        scheduledTime: undefined
      });
    } else {
      // Create date from inputs
      const dateTime = createDateTimeFromInputs();
      
      onSettingsChange({
        ...settings,
        sendTime: value,
        scheduledTime: dateTime
      });
    }
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScheduledDate(e.target.value);
    updateScheduledTime();
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScheduledTime(e.target.value);
    updateScheduledTime();
  };
  
  const createDateTimeFromInputs = () => {
    const [year, month, day] = scheduledDate.split('-').map(Number);
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };
  
  const updateScheduledTime = () => {
    if (sendTime === 'later') {
      const dateTime = createDateTimeFromInputs();
      
      onSettingsChange({
        ...settings,
        scheduledTime: dateTime
      });
    }
  };
  
  const handleFromNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      fromName: e.target.value
    });
  };
  
  const handleFromEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      fromEmail: e.target.value
    });
  };
  
  const handleReplyToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      replyToEmail: e.target.value
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Campaign Settings</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">When to send</h4>
            
            <div className="space-y-3">
              <div 
                className={`
                  p-4 border rounded-lg cursor-pointer flex items-center
                  ${sendTime === 'now' 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => handleSendTimeChange('now')}
              >
                <div className={`w-4 h-4 rounded-full border ${sendTime === 'now' ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                  {sendTime === 'now' && (
                    <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                  )}
                </div>
                <div className="ml-3">
                  <span className="font-medium">Send immediately</span>
                  <p className="text-sm text-gray-500 mt-1">
                    Your campaign will be sent as soon as you click "Launch Campaign"
                  </p>
                </div>
              </div>
              
              <div 
                className={`
                  p-4 border rounded-lg cursor-pointer
                  ${sendTime === 'later' 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => handleSendTimeChange('later')}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border ${sendTime === 'later' ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                    {sendTime === 'later' && (
                      <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <span className="font-medium">Schedule for later</span>
                    <p className="text-sm text-gray-500 mt-1">
                      Choose a specific date and time to send your campaign
                    </p>
                  </div>
                </div>
                
                {sendTime === 'later' && (
                  <div className="mt-4 ml-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="date"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          value={scheduledDate}
                          onChange={handleDateChange}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="time"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          value={scheduledTime}
                          onChange={handleTimeChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-medium mb-3">Sender Information</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Your Name or Company"
                  value={settings.fromName}
                  onChange={handleFromNameChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="your@email.com"
                  value={settings.fromEmail}
                  onChange={handleFromEmailChange}
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reply-To Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="reply@email.com"
                  value={settings.replyToEmail}
                  onChange={handleReplyToChange}
                />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-medium mb-3">Advanced Settings</h4>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="track-opens"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="track-opens" className="ml-2 block text-sm text-gray-700">
                  Track opens
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="track-clicks"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="track-clicks" className="ml-2 block text-sm text-gray-700">
                  Track clicks
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="auto-resend"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="auto-resend" className="ml-2 block text-sm text-gray-700">
                  Automatically resend to non-openers after 3 days
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 