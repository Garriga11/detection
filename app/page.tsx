"use client";

'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const PedestrianDetector = dynamic(() => import('@/app/components/PedestrianDetection'), { 
  ssr: false, // disable server-side rendering
  loading: () => <p>Loading camera...</p>,
});

export default function PedestrianPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-xl font-bold mb-4">Human Detection Model</h1>
      <PedestrianDetector />
      </div>
    );
  }

