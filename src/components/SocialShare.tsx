"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Link } from "lucide-react";
import { toast } from "sonner";

interface SocialShareProps {
  job_id: string;
  url?: string;
  title?: string;
  className?: string;
}

export function SocialShare({ job_id, url, title = "Check this out!", className }: SocialShareProps) {
  const apiUrl = process.env.NEXT_PUBLIC_GO_APP_URL || 'https://api.tutorschool.in';
  
  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${apiUrl}/admin/pub/jobs/${job_id}`)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(`${apiUrl}/admin/pub/jobs/${job_id}`)
      .then(() => toast.info("Job URL Copied"));
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 ${className}`}>
      <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={handleWhatsAppShare}
          className="flex sm:flex-initial flex-1 justify-center sm:justify-start items-center gap-2 bg-transparent hover:bg-green-50 dark:hover:bg-green-950 min-w-0 text-green-600 hover:text-green-700"
        >
          <MessageCircle className="flex-shrink-0 w-4 h-4" />
          <span className="hidden xs:inline sm:inline">WhatsApp</span>
          <span className="xs:hidden sm:hidden">W</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="flex sm:flex-initial flex-1 justify-center sm:justify-start items-center gap-2 bg-transparent min-w-0"
        >
          <Link className="flex-shrink-0 w-4 h-4" />
          <span className="hidden xs:inline sm:inline">Copy Link</span>
          <span className="xs:hidden sm:hidden">Copy</span>
        </Button>
      </div>
    </div>
  );
}