"use client";

import dynamic from 'next/dynamic'

// Dynamically import the PedestrianDetector component
const PedestrianDetector = dynamic(() => import('@/app/components/PedestrianDetection'), {
  ssr: false, // Disable server-side rendering to ensure it runs on the client
})

export default function PedestrianPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-justify mb-4 text-red-500">
        Disclaimer: This is a demo application. 
        The detection model is not trained for production use and may not perform accurately.To use the app the  click  yes for permission. Wait for the image to load, it could take several minutes.</div>
      <h1 className="text-xl font-bold mb-4">Human Detection Model</h1>
      <div className="w-full max-w-[900px]">
        {/* Render the dynamically imported component */}
        <PedestrianDetector />
      </div>
    </div>
  )
}
