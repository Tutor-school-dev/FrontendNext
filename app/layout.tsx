import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from '@/components/providers/query-client-provider';
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: "TutorSchool - Find Your Perfect Tutor—Home or Online",
  description: "AI-powered tutor matching platform for home and online education. Choose between personalized in-person home tutors or flexible online education—all on one platform. Get AI-matched with verified tutors in 24 hours.",
  keywords: ["tutors", "education", "online learning", "home tutoring", "AI matching"],
  authors: [{ name: "TutorSchool" }],
  openGraph: {
    title: "TutorSchool - Find Your Perfect Tutor—Home or Online",
    description: "AI-powered tutor matching platform for home and online education. Get AI-matched with verified tutors in 24 hours.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TutorSchool - Find Your Perfect Tutor—Home or Online",
    description: "AI-powered tutor matching platform for home and online education. Get AI-matched with verified tutors in 24 hours.",
  },
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {children}
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}