'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';


const PedestrianDetector: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Approximation constants
  const CALIBRATED_PIXEL_HEIGHT_AT_6_FEET = 150; // Adjust based on testing

  const estimateDistance = (pixelHeight: number): number => {
    return (CALIBRATED_PIXEL_HEIGHT_AT_6_FEET / pixelHeight) * 6;
  };

  useEffect(() => {
    const loadModelAndDetect = async () => {
      const model = await cocoSsd.load();
      setIsModelLoaded(true);

      const video = videoRef.current;
      if (navigator.mediaDevices.getUserMedia && video) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          detectFrame(model, video);
        };
      }
    };

    loadModelAndDetect();

  }, []);

  const detectFrame = async (model: cocoSsd.ObjectDetection, video: HTMLVideoElement) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (ctx && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const predictions = await model.detect(video);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      predictions.forEach(prediction => {
        if (prediction.class === 'person') {
          const [x, y, width, height] = prediction.bbox;
          const distance = estimateDistance(height);
          let color = 'green';

          if (distance <= 4) {
            color = 'red';
            playBeep();
          } else if (distance <= 8) {
            color = 'yellow';
          }

          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);

          ctx.font = '16px Arial';
          ctx.fillStyle = color;
          ctx.fillText(`${Math.round(distance)} ft`, x, y > 10 ? y - 5 : 10);
        }
      });
    }

    requestAnimationFrame(() => detectFrame(model, video));

  };

  const playBeep = () => {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, context.currentTime); // 880 Hz
    gainNode.gain.setValueAtTime(0.1, context.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.2); // 0.2 sec beep

  };

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
  );
};

export default PedestrianDetector;