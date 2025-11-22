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
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });

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
    console.log('Prompt feedback:', JSON.stringify(response.promptFeedback, null, 2));
    
    const text = response.text();
    console.log('AI Response text:', text);
    console.log('Text length:', text?.length);

    if (!text || text.trim() === '') {
      // Check if response was blocked
      if (response.promptFeedback?.blockReason) {
        throw new Error(`Response blocked: ${response.promptFeedback.blockReason}. Try a different prompt.`);
      }
      if (response.candidates?.[0]?.finishReason === 'SAFETY') {
        throw new Error('Response blocked by safety filters. This model provides image analysis only, not editing.');
      }
      throw new Error('Empty response from AI. Note: This model analyzes images but cannot edit them. Try asking "What\'s in this image?" instead.');
    }

    console.log('Returning result to client');
    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error('Nano Banana API Error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to process image' },
      { status: 500 }
    );
  }
}
