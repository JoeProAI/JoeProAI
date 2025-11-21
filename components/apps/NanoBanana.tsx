"use client";

import React, { useState, useRef } from 'react';

const NanoBanana = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
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
      setError('Please upload an image and enter a prompt');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setAiSuggestion(null);

    try {
      console.log('Sending request to API...');
      const response = await fetch('/api/nano-banana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          imageData: originalImage,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      console.log('Data.result:', data.result);
      console.log('Data keys:', Object.keys(data));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image');
      }

      if (!data.result || data.result.trim() === '') {
        console.error('No result in response:', data);
        throw new Error('No response from AI. Check server logs.');
      }

      // Display AI analysis
      setAiSuggestion(data.result);
      setError(null);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze image. Make sure GEMINI_API_KEY is configured.');
      setAiSuggestion(null);
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
          <h2 className="text-2xl font-bold text-yellow-400">Nano Banana Analyzer</h2>
          <p className="text-sm text-gray-400">AI-powered image analysis & editing suggestions</p>
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
              What would you like to know or analyze?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., What's in this image? Describe the scene. How can I improve this photo? Suggest edits..."
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
              {isProcessing ? '🍌 Analyzing...' : '🔍 Analyze with Nano Banana'}
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

      {/* AI Suggestions Display */}
      {aiSuggestion && (
        <div className="p-4 bg-yellow-500/20 border border-yellow-400/50 rounded-lg text-yellow-100 text-sm">
          <p className="font-semibold text-yellow-400 mb-2">🍌 Nano Banana AI Analysis:</p>
          <p className="whitespace-pre-wrap">{aiSuggestion}</p>
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
          <li>Describe what you want to understand or analyze</li>
          <li>Get AI-powered analysis and editing suggestions</li>
          <li>Powered by Google's Gemini AI</li>
        </ul>
        <div className="mt-3 p-2 bg-red-500/10 border border-red-400/30 rounded">
          <p className="text-red-400/90 font-semibold">⚙️ Setup Required:</p>
          <p className="mt-1">Add <code className="bg-black/50 px-1 py-0.5 rounded text-yellow-400">GEMINI_API_KEY</code> to environment variables.</p>
          <p className="mt-1">Get your free key at: <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline hover:text-yellow-300">aistudio.google.com/apikey</a></p>
        </div>
        <p className="mt-2 text-yellow-400/70 italic">Note: Currently provides AI analysis. Direct image generation coming soon!</p>
      </div>
    </div>
  );
};

export default NanoBanana;
