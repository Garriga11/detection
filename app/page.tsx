"use client";

import dynamic from 'next/dynamic'

// Dynamically import the PedestrianDetector component
const PedestrianDetector = dynamic(() => import('@/app/components/PedestrianDetection'), {
  ssr: false, // Disable server-side rendering to ensure it runs on the client
})

export default function PedestrianPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-xl font-bold mb-4">Pedestrian Detection</h1>
      <div className="w-full max-w-[900px]">
        {/* Render the dynamically imported component */}
        <PedestrianDetector />
      </div>
    </div>
  )
}
