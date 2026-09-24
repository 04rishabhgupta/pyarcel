import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const decorationsDir = path.join(process.cwd(), 'public', 'decorations');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(decorationsDir)) {
      fs.mkdirSync(decorationsDir, { recursive: true });
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(decorationsDir);
    const svgs = files.filter(file => file.endsWith('.svg'));
    
    return NextResponse.json(svgs);
  } catch (error) {
    console.error('Error reading decorations directory:', error);
    return NextResponse.json([], { status: 500 });
  }
}
