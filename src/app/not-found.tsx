import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-teal-50 via-white to-emerald-50 relative">
      {/* Background Graphics */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-teal-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"></div>
        
        {/* Tech pattern */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tech-pattern-404" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10 10 L90 10 L90 90 L10 90 Z" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="10" cy="10" r="2" fill="currentColor" />
              <circle cx="90" cy="10" r="2" fill="currentColor" />
              <circle cx="90" cy="90" r="2" fill="currentColor" />
              <circle cx="10" cy="90" r="2" fill="currentColor" />
              <path d="M50 10 L50 90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" />
              <path d="M10 50 L90 50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tech-pattern-404)" />
        </svg>
      </div>
      
      <div className="flex flex-col md:flex-row w-full relative z-10">
        {/* Left Section - Image */}
        <div className="hidden md:flex w-1/2 relative overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1579403124614-197f69d8187b?q=80&w=2070&auto=format&fit=crop"
            alt="Tech workspace"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600/40 to-emerald-600/40 backdrop-blur-sm"></div>
          <div className="absolute inset-0 flex flex-col items-start justify-center p-12 z-10">
            <div className="animate-fade-in">
              <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 mb-4">
                404
              </h1>
              <h2 className="text-3xl font-bold text-white mb-6">Page Not Found</h2>
              <p className="text-xl text-white/90 max-w-md drop-shadow-md mb-6">
                The page you're looking for doesn't exist or has been moved. Let's get you back on track.
              </p>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M12 3a6 6 0 0 0-6 6c0 3.1 2.9 6.9 6 12 3.1-5.1 6-8.9 6-12a6 6 0 0 0-6-6Z"></path>
                  <path d="M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                </svg>
                <span className="text-white font-medium">Navigate back to safety</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Section - Content */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            {/* Mobile only view */}
            <div className="md:hidden mb-8">
              <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-600 mb-4">
                404
              </h1>
              <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
              <p className="text-gray-600 max-w-md mx-auto mt-2 mb-8">
                The page you're looking for doesn't exist or has been moved. Let's get you back on track.
              </p>
            </div>
            
            <Image 
              src="/images/404-illustration.svg" 
              alt="Page not found" 
              width={300} 
              height={200}
              className="mx-auto mb-8"
            />
            
            <div className="space-y-6">
              <p className="text-gray-600">
                Return to the dashboard or explore other areas of our enterprise CRM platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  className="font-medium h-12 text-base bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-md hover:shadow-teal-500/25 transition-all duration-200"
                >
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  className="font-medium h-12 text-base border-teal-200 text-teal-700 hover:bg-teal-50"
                >
                  <Link href="/login">Back to Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
