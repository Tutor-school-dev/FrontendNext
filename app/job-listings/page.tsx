"use client";

import { Suspense } from "react";
import JobListingsContent from "./JobListingsContent";

function JobListingsPageContent() {
  return <JobListingsContent />;
}

export default function JobListingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobListingsPageContent />
    </Suspense>
  );
}