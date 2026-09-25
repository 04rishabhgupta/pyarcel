import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json(
        { error: 'File blob is required.' },
        { status: 400 },
      );
    }

    const extension = file.type.includes('mp4') ? 'mp4' : 'webm';
    
    const blob = await put(`voicenote.${extension}`, file, {
      access: 'public',
      contentType: file.type || undefined,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json(
      { error: 'Failed to upload audio.' },
      { status: 500 },
    );
  }
}
