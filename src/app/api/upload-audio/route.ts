import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob | null;
    const order_id = formData.get('order_id') as string | null;
    const payment_id = formData.get('payment_id') as string | null;
    const signature = formData.get('signature') as string | null;

    if (!file || !order_id || !payment_id || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields or file.' },
        { status: 400 },
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const key_id = process.env.RAZORPAY_KEY_ID;
    
    if (!secret || !key_id) {
      return NextResponse.json({ error: 'Razorpay keys missing.' }, { status: 500 });
    }

    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(order_id + '|' + payment_id)
      .digest('hex');

    if (expectedSig !== signature) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // Optional strict check: verify order amount actually included the voice note fee (>= 900 paise)
    const razorpay = new Razorpay({ key_id, key_secret: secret });
    const order = await razorpay.orders.fetch(order_id);
    if (Number(order.amount) < 900 || order.status !== 'paid') {
      return NextResponse.json({ error: 'Order not sufficient for voice note.' }, { status: 402 });
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
