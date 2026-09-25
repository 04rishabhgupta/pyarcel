import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { PYARCEL_MENU } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, payload } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !payload) {
      return NextResponse.json(
        { error: 'Missing required fields for payment verification.' },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const key_id = process.env.RAZORPAY_KEY_ID;
    if (!secret || !key_id) {
      return NextResponse.json(
        { error: 'Razorpay keys are not configured.' },
        { status: 401 }
      );
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Payment verification failed. Signature mismatch.' },
        { status: 400 }
      );
    }

    // Validate payload amount against Razorpay order
    const razorpay = new Razorpay({ key_id, key_secret: secret });
    const order = await razorpay.orders.fetch(razorpay_order_id);

    let itemTotal = 0;
    let hasBundle = false;
    for (const [id, qty] of Object.entries(payload.i || {})) {
      if (id === "all_of_the_above") hasBundle = true;
      const category = PYARCEL_MENU.find(c => c.items.some(i => i.id === id));
      const item = category?.items.find(i => i.id === id);
      if (item) {
        itemTotal += item.price * (qty as number);
      }
    }

    let finalTotal = itemTotal === 0 ? 0 : (hasBundle ? itemTotal : Math.ceil(itemTotal / 10) * 10);
    if (payload.v) {
      finalTotal += 9;
    }
    const expectedAmount = finalTotal * 100; // in paise

    if (Number(order.amount) !== expectedAmount || order.status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment amount mismatch or order not paid.' },
        { status: 400 }
      );
    }

    // Sign the payload
    const payloadToSign = { ...payload };
    delete payloadToSign.sig; // ensure sig is not part of the base signature
    const payloadStr = JSON.stringify(payloadToSign);
    
    const payloadSignature = crypto
      .createHmac('sha256', secret)
      .update(payloadStr)
      .digest('hex');

    return NextResponse.json({ 
      success: true, 
      message: 'Payment verified successfully.',
      signature: payloadSignature
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Internal server error during verification.' },
      { status: 500 }
    );
  }
}
