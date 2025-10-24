import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from '@/components/providers/query-client-provider';
import { ThemeProvider } from "@/components/providers/theme-provider";
import { GoogleAuthProvider } from "@/components/providers/GoogleAuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_GO_APP_URL || 'https://tutorschool.vercel.app'),
  title: "TutorSchool - Find Your Perfect Tutor—Home or Online",
  description: "AI-powered tutor matching platform for home and online education. Choose between personalized in-person home tutors or flexible online education—all on one platform. Get AI-matched with verified tutors in 24 hours.",
  keywords: ["tutors", "education", "online learning", "home tutoring", "AI matching"],
  authors: [{ name: "TutorSchool" }],
  icons: {
    icon: [
      {
        url: "/tutorschool-logo.jpg",
        sizes: "any",
      },
      {
        url: "/tutorschool-logo.jpg",
        sizes: "32x32",
        type: "image/jpeg",
      },
    ],
    apple: [
      {
        url: "/tutorschool-logo.jpg",
        sizes: "180x180",
        type: "image/jpeg",
      },
    ],
  },
  openGraph: {
    title: "TutorSchool - Find Your Perfect Tutor—Home or Online",
    description: "AI-powered tutor matching platform for home and online education. Get AI-matched with verified tutors in 24 hours.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/tutorschool-icon.png",
        width: 1200,
        height: 630,
        alt: "TutorSchool - AI-powered tutor matching platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TutorSchool - Find Your Perfect Tutor—Home or Online",
    description: "AI-powered tutor matching platform for home and online education. Get AI-matched with verified tutors in 24 hours.",
    images: ["/tutorschool-icon.png"],
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
          <GoogleAuthProvider>
            <QueryClientProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                {children}
              </TooltipProvider>
            </QueryClientProvider>
          </GoogleAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}