"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signupSchema, SignupFormData } from "@/lib/validations/auth";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignupFormData) {
    setIsLoading(true);
    
    // Here you would integrate with your authentication system
    // For demo purposes we'll just simulate a loading state
    console.log(data);
    
    setTimeout(() => {
      setIsLoading(false);
      // After successful signup, redirect to login
      router.push("/login");
    }, 1500);
  }

  return (
    <div className="min-h-screen w-full flex flex-row-reverse bg-gradient-to-br from-teal-50 via-white to-emerald-50 relative">
      {/* Background Graphics */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-teal-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"></div>
        
        {/* AI-themed pattern */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ai-grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M0 5 H50 M0 15 H50 M0 25 H50 M0 35 H50 M0 45 H50 M5 0 V50 M15 0 V50 M25 0 V50 M35 0 V50 M45 0 V50" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <circle cx="25" cy="25" r="3" fill="currentColor" />
              <circle cx="5" cy="5" r="1" fill="currentColor" />
              <circle cx="45" cy="45" r="1" fill="currentColor" />
              <circle cx="5" cy="45" r="1" fill="currentColor" />
              <circle cx="45" cy="5" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ai-grid)" />
        </svg>
      </div>

      {/* Right section - Image */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden z-10">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          alt="Modern office with city view"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-l from-teal-600/40 to-emerald-600/40 backdrop-blur-sm"></div>
        <div className="absolute inset-0 flex flex-col items-end justify-center p-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-right"
          >
            <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-md">Join QuickCRM</h1>
            <p className="text-xl text-white/90 max-w-md drop-shadow-md mb-6 ml-auto">
              Accelerate business growth with our comprehensive suite of CRM tools designed for enterprise efficiency.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-end space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30">
                <span className="text-white font-medium">Intelligent Lead Scoring & Prioritization</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M10.5 20.5 3 13l-1.5 1.5L10.5 23.5 22 12 20.5 10.5l-10 10Z"></path>
                </svg>
              </div>
              
              <div className="flex items-center justify-end space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30">
                <span className="text-white font-medium">Customer Journey Automation</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z"></path>
                  <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
                </svg>
              </div>
              
              <div className="flex items-center justify-end space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30">
                <span className="text-white font-medium">Advanced Security & Compliance</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Left section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Create account</h2>
            <p className="text-gray-600">Join our enterprise platform and optimize your customer relationship management</p>
          </div>

          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 form-appear">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
                            disabled={isLoading}
                            className="h-12 px-4 bg-white"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="name@example.com" 
                            type="email" 
                            autoComplete="email"
                            disabled={isLoading}
                            className="h-12 px-4 bg-white"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="••••••••" 
                            type="password" 
                            autoComplete="new-password"
                            disabled={isLoading}
                            className="h-12 px-4 bg-white"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="••••••••" 
                            type="password" 
                            autoComplete="new-password"
                            disabled={isLoading}
                            className="h-12 px-4 bg-white"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="pt-2">
                    <Button type="submit" className="w-full h-12 text-base font-medium bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-teal-500/25" disabled={isLoading}>
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                          Creating account...
                        </span>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Advanced Analytics Platform</span>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col pb-6 px-6 border-t pt-4 mt-2 border-gray-100">
              <div className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-teal-600 hover:text-teal-800 font-medium transition-colors">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 