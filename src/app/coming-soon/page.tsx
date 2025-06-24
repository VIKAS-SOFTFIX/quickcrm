import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon | QuickCRM",
  description: "Our new features are coming soon to the QuickCRM platform",
};

export default function ComingSoon() {
  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-teal-50 via-white to-emerald-50 relative">
      {/* Background Graphics */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-20 left-[10%] w-[40rem] h-[40rem] bg-teal-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-[5%] w-[30rem] h-[30rem] bg-emerald-200/10 rounded-full blur-3xl"></div>
        
        {/* Tech pattern */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.02]" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tech-pattern-coming" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M0 5 H50 M0 15 H50 M0 25 H50 M0 35 H50 M0 45 H50 M5 0 V50 M15 0 V50 M25 0 V50 M35 0 V50 M45 0 V50" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <circle cx="25" cy="25" r="3" fill="currentColor" />
              <circle cx="5" cy="5" r="1" fill="currentColor" />
              <circle cx="45" cy="45" r="1" fill="currentColor" />
              <circle cx="5" cy="45" r="1" fill="currentColor" />
              <circle cx="45" cy="5" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tech-pattern-coming)" />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row w-full relative z-10">
        {/* Left side - Content */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 order-2 md:order-1">
          <div className="w-full max-w-lg">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                Coming Soon
              </h1>
              
              <p className="text-xl text-gray-700 mb-8">
                We're developing powerful new features for our enterprise CRM platform. Sign up to be notified when we launch.
              </p>

              <div className="mb-8 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <path d="M12 2v2"></path>
                      <path d="M12 20v2"></path>
                      <path d="m4.93 4.93 1.41 1.41"></path>
                      <path d="m17.66 17.66 1.41 1.41"></path>
                      <path d="M2 12h2"></path>
                      <path d="M20 12h2"></path>
                      <path d="m6.34 17.66-1.41 1.41"></path>
                      <path d="m19.07 4.93-1.41 1.41"></path>
                      <circle cx="12" cy="12" r="4"></circle>
                    </svg>
                  </div>
                  <p className="text-gray-600">Advanced AI-powered customer journey mapping</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <path d="M2 9a3 3 0 0 1 0 6v-3a3 3 0 0 1 0-6Z"></path>
                      <path d="M9 2a3 3 0 0 1 6 0H9Z"></path>
                      <path d="M18 9a3 3 0 0 1 0 6"></path>
                      <path d="M9 22a3 3 0 0 1 6 0H9Z"></path>
                      <path d="M5 5a10 10 0 0 1 14 0"></path>
                      <path d="M5 19a10 10 0 0 0 14 0"></path>
                    </svg>
                  </div>
                  <p className="text-gray-600">Comprehensive analytics dashboard with predictive insights</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                      <path d="M18 12h-2"></path>
                    </svg>
                  </div>
                  <p className="text-gray-600">Enterprise API integration ecosystem with third-party tools</p>
                </div>
              </div>

              <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto md:mx-0 mb-6">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-12 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button className="h-12 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700">
                  Notify Me
                </Button>
              </form>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-10">
                <Button asChild variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                  <Link href="/login">Back to Login</Link>
                </Button>
                <Link href="/dashboard" className="text-teal-600 hover:text-teal-800 font-medium transition-colors">
                  Explore Current Features
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Image */}
        <div className="hidden md:block w-1/2 relative overflow-hidden order-1 md:order-2">
          <Image
            src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=2574&auto=format&fit=crop"
            alt="Coming Soon"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-l from-teal-600/40 to-emerald-600/40 backdrop-blur-sm"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12 z-10">
            <div className="animate-fade-in">
              <div className="p-6 backdrop-blur-md bg-white/20 rounded-xl border border-white/30 text-white text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <h2 className="text-3xl font-bold mb-2">Launch Countdown</h2>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold">30</span>
                    <span className="text-xs">DAYS</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold">12</span>
                    <span className="text-xs">HOURS</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold">45</span>
                    <span className="text-xs">MINS</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold">18</span>
                    <span className="text-xs">SECS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 


