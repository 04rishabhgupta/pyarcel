import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Call TinyURL API
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to shorten URL' }, { status: response.status });
    }

    const shortUrl = await response.text();
    return NextResponse.json({ shortUrl });
  } catch (error) {
    console.error('Error shortening URL:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
