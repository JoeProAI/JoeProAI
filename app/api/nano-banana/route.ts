import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Nano Banana API Called ===');
    const { prompt, imageData } = await request.json();
    console.log('Prompt received:', prompt?.substring(0, 50));
    console.log('Image data received:', imageData?.substring(0, 50));

    if (!prompt || !imageData) {
      console.error('Missing prompt or imageData');
      return NextResponse.json(
        { error: 'Prompt and image data are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key exists:', !!apiKey);
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use Nano Banana for actual image editing!
    const modelName = 'gemini-2.5-flash-image';
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });
    
    console.log('Using model:', modelName);

    // Convert base64 image to the format Gemini expects
    const imagePart = {
      inlineData: {
        data: imageData.split(',')[1],
        mimeType: imageData.split(';')[0].split(':')[1],
      },
    };

    console.log('Calling Gemini API...');
    const result = await model.generateContent([prompt, imagePart]);
    console.log('Gemini response received');
    
    const response = await result.response;
    console.log('Response candidates:', JSON.stringify(response.candidates, null, 2));
    
    // Nano Banana returns an IMAGE, not text!
    const candidate = response.candidates?.[0];
    if (!candidate) {
      throw new Error('No response from Nano Banana');
    }

    // Check if response contains an image
    const imagePart2 = candidate.content?.parts?.[0]?.inlineData;
    if (imagePart2?.data && imagePart2?.mimeType) {
      console.log('Received edited image:', imagePart2.mimeType);
      // Return the edited image as base64
      const editedImageData = `data:${imagePart2.mimeType};base64,${imagePart2.data}`;
      return NextResponse.json({ 
        result: 'Image edited successfully',
        editedImage: editedImageData 
      });
    }

    // If no image, try to get text response (for analysis mode)
    try {
      const text = response.text();
      if (text && text.trim()) {
        console.log('Received text response:', text.substring(0, 100));
        return NextResponse.json({ result: text });
      }
    } catch (e) {
      console.log('No text response available');
    }

    throw new Error('No valid response from Nano Banana');

  } catch (error: any) {
    console.error('Nano Banana API Error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to process image' },
      { status: 500 }
    );
  }
}
