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

  // Resize and compress image to handle various sizes
  const resizeImage = (base64Str: string, maxWidth: number = 2048, maxHeight: number = 2048): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Only resize if image exceeds max dimensions
        if (width > maxWidth || height > maxHeight) {
          // Calculate scaling factor to fit within max dimensions while maintaining aspect ratio
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const scale = Math.min(widthRatio, heightRatio);
          
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Use JPEG with 0.85 quality for good balance of size/quality
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        }
      };
      img.src = base64Str;
    });
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const originalData = event.target?.result as string;
        // Resize image to handle large uploads
        const resizedData = await resizeImage(originalData);
        setOriginalImage(resizedData);
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
  const capturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        // Resize camera capture as well
        const resizedData = await resizeImage(imageData);
        setOriginalImage(resizedData);
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
      console.log('Data keys:', Object.keys(data));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      // Check if we got an edited image back
      if (data.editedImage) {
        console.log('Received edited image!');
        setEditedImage(data.editedImage);
        setAiSuggestion('✨ Image edited successfully!');
        setError(null);
      } 
      // Or if we got a text analysis
      else if (data.result && data.result.trim()) {
        console.log('Received analysis:', data.result);
        setAiSuggestion(data.result);
        setError(null);
      } 
      else {
        throw new Error('No valid response from AI');
      }
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
          <h2 className="text-2xl font-bold text-yellow-400">Nano Banana Editor</h2>
          <p className="text-sm text-gray-400">AI-powered image generation & editing with natural language</p>
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
              Describe what you want to change or ask
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Try: 'Remove the boot and foot', 'Change background to beach', 'Add a sunset', 'Make it black and white', 'What's in this image?'"
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
        <div className="mb-3 p-3 bg-green-500/20 border border-green-400/50 rounded">
          <p className="text-green-300 font-bold flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span>Powered by Nano Banana (Gemini 2.5 Flash Image)</span>
          </p>
          <p className="mt-2 text-green-200/80">This powerful AI model can EDIT and GENERATE images with natural language! Just describe what you want!</p>
        </div>
        
        <p className="font-semibold text-yellow-400 mb-2">🍌 What You Can Do:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Edit Images:</strong> "Remove the background", "Change sky to purple", "Add sunglasses"</li>
          <li><strong>Analyze Images:</strong> "What's in this image?", "Describe the scene"</li>
          <li><strong>Get Suggestions:</strong> "How can I improve this photo?"</li>
          <li><strong>Style Transfer:</strong> "Make it look like a painting"</li>
        </ul>
      </div>
    </div>
  );
};

export default NanoBanana;
