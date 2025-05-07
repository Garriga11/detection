'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs'

const PedestrianDetector = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)

  useEffect(() => {
    const loadModelAndDetect = async () => {
      const model = await cocoSsd.load()
      setIsModelLoaded(true) // Set model loaded status

      const video = videoRef.current

      if (navigator.mediaDevices.getUserMedia && video) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        video.srcObject = stream

        // Wait for video metadata to be loaded before starting detection
        video.onloadedmetadata = () => {
          video.play()
          detectFrame(model, video)
        }
      }
    }

    loadModelAndDetect()
  }, []) // Empty dependency array ensures it runs only once

  const detectFrame = async (model: cocoSsd.ObjectDetection, video: HTMLVideoElement) => {
    if (!video) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (ctx && video) {
      // Ensure the canvas matches the video size every time a new frame is drawn
      if (canvas) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
      }

      // Run the detection and draw results on the canvas
      const predictions = await model.detect(video)

      // Clear the previous drawings
      if (canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

      // Iterate over the predictions and log when a "person" is detected
      predictions.forEach((prediction) => {
        if (prediction.class === 'person') {
          const [x, y, width, height] = prediction.bbox

          // Log to console when a person is detected
          console.log('Person detected:', prediction)

          // Ensure correct scaling for the bounding box on the canvas
          const scaleX = canvas ? canvas.width / video.videoWidth : 1
          const scaleY = canvas ? canvas.height / video.videoHeight : 1

          // Draw bounding box with scaled coordinates
          ctx.strokeStyle = 'red'
          ctx.lineWidth = 2
          ctx.strokeRect(x * scaleX, y * scaleY, width * scaleX, height * scaleY)

          // Draw label and score
          ctx.font = '16px Arial'
          ctx.fillStyle = 'red'
          ctx.fillText(
            `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
            x * scaleX,
            y * scaleY > 10 ? y * scaleY - 5 : 10
          )
        }
      })
    }

    // Keep calling detectFrame recursively
    requestAnimationFrame(() => detectFrame(model, video))
  }

  return (
    <div className="relative">
      <video ref={videoRef} className="w-full h-auto" muted playsInline />
      <canvas ref={canvasRef} className="absolute top-0 left-0" />
      {!isModelLoaded && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <span className="text-white text-xl">Loading model...</span>
        </div>
      )}
    </div>
  )
}

export default PedestrianDetector
