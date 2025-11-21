"use client";

import React, { useState, useRef } from 'react';

const NanoBanana = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
      setError(null);
    } catch (err) {
      setError('Failed to access camera. Please check permissions.');
      console.error(err);
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setOriginalImage(imageData);
        setEditedImage(null);
        stopCamera();
      }
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  // Edit image with natural language
  const handleEdit = async () => {
    if (!originalImage || !prompt.trim()) {
      setError('Please upload an image and enter an edit prompt');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/nano-banana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Edit this image: ${prompt}. Return only the modified image.`,
          imageData: originalImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to edit image');
      }

      // For now, we'll show the result text. In production, you'd handle the image response
      setEditedImage(originalImage); // Placeholder - actual API returns edited image
      setError('Note: Using text-only model. Full image editing requires Gemini 2.5 Flash Image model.');
    } catch (err: any) {
      setError(err.message || 'Failed to process image');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full p-6 bg-gradient-to-br from-yellow-900/10 to-orange-900/10 border border-yellow-400/30 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">🍌</span>
        <div>
          <h2 className="text-2xl font-bold text-yellow-400">Nano Banana Editor</h2>
          <p className="text-sm text-gray-400">AI-powered image editing with natural language</p>
        </div>
      </div>

      {/* Upload/Camera Section */}
      {!originalImage && !isCameraActive && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-4 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 rounded-lg transition-all text-yellow-400 font-semibold"
            >
              📁 Upload Image
            </button>
            <button
              onClick={startCamera}
              className="px-6 py-4 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 rounded-lg transition-all text-yellow-400 font-semibold"
            >
              📸 Take Photo
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Camera View */}
      {isCameraActive && (
        <div className="flex flex-col gap-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 object-cover rounded-lg border border-yellow-400/30"
          />
          <div className="flex gap-4">
            <button
              onClick={capturePhoto}
              className="flex-1 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-all text-black font-semibold"
            >
              📸 Capture Photo
            </button>
            <button
              onClick={stopCamera}
              className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 rounded-lg transition-all text-red-400 font-semibold"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Image Display */}
      {originalImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-yellow-400">Original</h3>
            <img 
              src={originalImage} 
              alt="Original" 
              className="w-full h-64 object-cover rounded-lg border border-yellow-400/30"
            />
          </div>
          {editedImage && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-yellow-400">Edited</h3>
              <img 
                src={editedImage} 
                alt="Edited" 
                className="w-full h-64 object-cover rounded-lg border border-yellow-400/30"
              />
            </div>
          )}
        </div>
      )}

      {/* Edit Prompt */}
      {originalImage && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-yellow-400">
              What would you like to change?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Make the sky purple, add sunglasses, turn it into a cartoon..."
              className="w-full h-24 px-4 py-3 bg-black/50 border border-yellow-400/30 rounded-lg text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none resize-none"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleEdit}
              disabled={isProcessing || !prompt.trim()}
              className={`flex-1 px-6 py-3 rounded-lg transition-all font-semibold ${
                isProcessing || !prompt.trim()
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-black'
              }`}
            >
              {isProcessing ? '🍌 Processing...' : '✨ Edit with Nano Banana'}
            </button>
            <button
              onClick={() => {
                setOriginalImage(null);
                setEditedImage(null);
                setPrompt('');
                setError(null);
              }}
              className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 rounded-lg transition-all text-red-400 font-semibold"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-lg text-xs text-gray-400">
        <p className="font-semibold text-yellow-400 mb-2">🍌 How to use:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Upload an image or take a photo with your camera</li>
          <li>Describe what you want to change in natural language</li>
          <li>Click "Edit with Nano Banana" to apply your changes</li>
          <li>Powered by Google's Gemini 2.5 Flash Image (Nano Banana)</li>
        </ul>
      </div>
    </div>
  );
};

export default NanoBanana;
