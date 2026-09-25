import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { payload } = await req.json();

    if (!payload || !payload.sig) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 });
    }

    const providedSignature = payload.sig;
    
    // Remove the signature before rehashing
    const payloadToSign = { ...payload };
    delete payloadToSign.sig;
    const payloadStr = JSON.stringify(payloadToSign);
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payloadStr)
      .digest('hex');

    if (providedSignature === expectedSignature) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying receipt signature:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
