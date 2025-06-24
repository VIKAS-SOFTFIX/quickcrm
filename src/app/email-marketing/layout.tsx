import { AppLayout } from "@/components/layout/app-layout";

export const metadata = {
  title: "Email Marketing - QuickCRM",
  description: "Email marketing campaigns and templates for QuickCRM",
};

export default function EmailMarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
} 