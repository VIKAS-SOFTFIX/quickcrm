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
import { loginSchema, LoginFormData } from "@/lib/validations/auth";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    
    // Here you would integrate with your authentication system
    // For demo purposes we'll just simulate a loading state
    console.log(data);
    
    setTimeout(() => {
      setIsLoading(false);
      // After successful login, redirect to dashboard
      router.push("/dashboard");
    }, 1500);
  }

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-teal-50 via-white to-emerald-50 relative">
      {/* Background Graphics */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-teal-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"></div>
        
        {/* Circuit-like patterns */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 H100 M50 0 V100 M25 25 H75 V75 H25 Z" stroke="currentColor" fill="none" strokeWidth="1" />
              <circle cx="50" cy="50" r="8" fill="currentColor" />
              <circle cx="25" cy="25" r="3" fill="currentColor" />
              <circle cx="75" cy="75" r="3" fill="currentColor" />
              <circle cx="25" cy="75" r="3" fill="currentColor" />
              <circle cx="75" cy="25" r="3" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>

      {/* Left section - Image */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden z-10">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
          alt="Modern office workspace"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/40 to-emerald-600/40 backdrop-blur-sm"></div>
        <div className="absolute inset-0 flex flex-col items-start justify-center p-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-md">QuickCRM</h1>
            <p className="text-xl text-white/90 max-w-md drop-shadow-md mb-6">
              Enterprise-grade customer relationship management platform with advanced analytics and AI-driven insights.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
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
                <span className="text-white font-medium">AI-Powered Insights & Forecasting</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <path d="M13 2v7h7"></path>
                </svg>
                <span className="text-white font-medium">Automated Reporting & Analytics</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                  <line x1="6" x2="6" y1="2" y2="4"></line>
                  <line x1="10" x2="10" y1="2" y2="4"></line>
                  <line x1="14" x2="14" y1="2" y2="4"></line>
                </svg>
                <span className="text-white font-medium">Seamless Integration Ecosystem</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-gray-600">Access your enterprise CRM dashboard to manage client relationships effectively</p>
          </div>

          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 form-appear">
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
                            autoComplete="current-password"
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
                          Signing in...
                        </span>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Enterprise-Grade Security</span>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 pb-6 px-6 border-t pt-4 mt-2 border-gray-100">
              <div className="text-sm text-center text-gray-600">
                <Link href="/forgot-password" className="text-teal-600 hover:text-teal-800 font-medium transition-colors">
                  Forgot your password?
                </Link>
              </div>
              <div className="text-sm text-center text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-teal-600 hover:text-teal-800 font-medium transition-colors">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 