"use client";

import React, { Suspense } from "react";
import TutorSearchContent from "./TutorSearchContent";

export default function TutorSearchResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search results...</p>
        </div>
      </div>
    }>
      <TutorSearchContent />
    </Suspense>
  );
}