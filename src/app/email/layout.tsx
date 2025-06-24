import { AppLayout } from "@/components/layout/app-layout";

export const metadata = {
  title: "Email - QuickCRM",
  description: "Email management for QuickCRM",
};

export default function EmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
} 