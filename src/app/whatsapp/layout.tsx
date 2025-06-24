import { AppLayout } from "@/components/layout/app-layout";

export const metadata = {
  title: "WhatsApp - QuickCRM",
  description: "WhatsApp messaging integration for QuickCRM",
};

export default function WhatsAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
} 