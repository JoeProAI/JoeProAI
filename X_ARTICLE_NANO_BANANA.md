# Building an AI Image Editor with Google's Gemini 2.5 Flash Image

**Edit images with natural language using Google's latest multimodal AI**

I built a production-ready image editor that lets you edit photos by simply describing what you want: "Remove the background," "Add a sunset," "Make it watercolor style." Here's how you can build it too.

## What We're Building

An AI-powered image editor featuring:
- Natural language image editing
- Drag-and-drop uploads
- Camera capture
- Real-time processing
- Download functionality
- Mobile-responsive design

**Tech Stack:** Next.js 14, React 18, TypeScript, TailwindCSS, Google Gemini API

---

## Part 1: Setup

First, install the Google Generative AI SDK:

```bash
npm install @google/generative-ai
```

Get your free API key from [Google AI Studio](https://aistudio.google.com/apikey) and add it to `.env.local`:

```env
GEMINI_API_KEY=your_api_key_here
```

---

## Part 2: The Backend API

Create the API route at `app/api/nano-banana/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageData } = await request.json();
    
    // Validate inputs
    if (!prompt || !imageData) {
      return NextResponse.json(
        { error: 'Prompt and image data are required' },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-image',
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });

    // Convert base64 to Gemini format
    const imagePart = {
      inlineData: {
        data: imageData.split(',')[1],
        mimeType: imageData.split(';')[0].split(':')[1],
      },
    };

    // Call Gemini API
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const candidate = response.candidates?.[0];

    // Extract edited image
    const imageResponse = candidate.content?.parts?.[0]?.inlineData;
    if (imageResponse?.data && imageResponse?.mimeType) {
      const editedImageData = `data:${imageResponse.mimeType};base64,${imageResponse.data}`;
      return NextResponse.json({ 
        editedImage: editedImageData 
      });
    }

    throw new Error('No valid response from Gemini');

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process image' },
      { status: 500 }
    );
  }
}
```

**Key points:**
- The API runs server-side, keeping your API key secure
- `gemini-2.5-flash-image` is the model that can edit images
- Response comes back as `inlineData` with base64 image
- We convert it to a data URL for easy display

---

## Part 3: Image Processing

Before sending images to the API, we need to resize them to prevent timeouts. Add this function to your component:

```typescript
const resizeImage = (base64Str: string, maxWidth = 2048, maxHeight = 2048): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate scaling
      if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      }
    };
    img.src = base64Str;
  });
};
```

This maintains aspect ratio while ensuring images don't exceed 2048x2048 pixels.

---

## Part 4: The React Component

Create `components/apps/NanoBanana.tsx`:

```typescript
"use client";
import React, { useState, useRef } from 'react';

const NanoBanana = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const originalData = event.target?.result as string;
        const resizedData = await resizeImage(originalData);
        setOriginalImage(resizedData);
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt.trim()) {
      setError('Please upload an image and enter a prompt');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/nano-banana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, imageData: originalImage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      if (data.editedImage) {
        setEditedImage(data.editedImage);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Image Editor</h1>
      
      {/* Upload */}
      {!originalImage && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            Upload Image
          </button>
        </div>
      )}

      {/* Images */}
      {originalImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Original</h3>
            <img src={originalImage} alt="Original" className="w-full rounded" />
          </div>
          {editedImage && (
            <div>
              <h3 className="font-semibold mb-2">Edited</h3>
              <img src={editedImage} alt="Edited" className="w-full rounded" />
            </div>
          )}
        </div>
      )}

      {/* Editing */}
      {originalImage && (
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your edit..."
            className="w-full h-24 px-4 py-2 border rounded-lg"
          />
          <button
            onClick={handleEdit}
            disabled={isProcessing}
            className="px-6 py-3 bg-green-500 text-white rounded-lg disabled:bg-gray-400"
          >
            {isProcessing ? 'Processing...' : 'Edit Image'}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default NanoBanana;
```

---

## Part 5: Key Features to Add

### Drag & Drop

```typescript
const [isDragging, setIsDragging] = useState(false);

const handleDrop = async (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);
  
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const resizedData = await resizeImage(event.target?.result as string);
      setOriginalImage(resizedData);
    };
    reader.readAsDataURL(file);
  }
};
```

### Download Functionality

```typescript
const downloadImage = () => {
  if (!editedImage) return;
  const link = document.createElement('a');
  link.href = editedImage;
  link.download = `edited-${Date.now()}.jpg`;
  link.click();
};
```

### Quick Prompts

```typescript
const examplePrompts = [
  "Remove the background",
  "Make it black and white",
  "Add a sunset",
  "Change to watercolor style"
];

// In your JSX:
<div className="flex gap-2">
  {examplePrompts.map((example, idx) => (
    <button
      key={idx}
      onClick={() => setPrompt(example)}
      className="px-3 py-1 bg-gray-200 rounded text-sm"
    >
      {example}
    </button>
  ))}
</div>
```

---

## Part 6: Deployment

### Environment Variables

In Vercel or your deployment platform, add:
- `GEMINI_API_KEY` = your API key

### Build & Deploy

```bash
npm run build
vercel --prod
```

---

## Common Issues & Solutions

**Problem:** Empty API responses  
**Solution:** Make sure you're extracting `inlineData` from the response, not calling `.text()`

**Problem:** Images too large  
**Solution:** Always use the `resizeImage()` function before sending to API

**Problem:** CORS errors  
**Solution:** API routes must be in the same Next.js app

---

## What You Can Build

This foundation lets users:
- Remove backgrounds
- Change image styles (watercolor, sketch, etc.)
- Add/remove objects
- Adjust colors and lighting
- Generate variations
- Apply artistic filters

---

## The Result

You now have a production-ready AI image editor that:
✅ Edits images with natural language
✅ Works on mobile and desktop
✅ Processes images securely server-side
✅ Handles errors gracefully
✅ Provides instant visual feedback

**Live demo:** [Your deployment URL]  
**Full code:** [GitHub repo]

---

## Next Steps

**Enhancements to consider:**
1. Add image history/undo
2. Batch processing
3. Custom model fine-tuning
4. Real-time preview
5. Social sharing
6. User galleries

The Gemini 2.5 Flash Image model is incredibly powerful - experiment with different prompts to discover what's possible!

---

**Built with:** Next.js 14, React 18, TypeScript, TailwindCSS, Google Gemini API  
**Cost:** Free tier available, pay-as-you-go pricing  
**Performance:** ~2-5 seconds per edit

Questions? Drop them below! 👇