import { NextResponse } from 'next/server';
import { removeBackground } from '@imgly/background-removal-node';

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const imageBlob = await removeBackground(imageUrl);
    const buffer = await imageBlob.arrayBuffer();
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error('Error removing background:', error);
    return NextResponse.json({ error: 'Failed to remove background' }, { status: 500 });
  }
} 