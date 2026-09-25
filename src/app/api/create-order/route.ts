import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { PYARCEL_MENU } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, hasVoiceNote, currency = 'INR', receipt } = body;

    if (!items || typeof items !== 'object') {
      return NextResponse.json({ error: 'Invalid items.' }, { status: 400 });
    }

    let itemTotal = 0;
    let hasBundle = false;
    for (const [id, qty] of Object.entries(items)) {
      if (id === "all_of_the_above") hasBundle = true;
      const category = PYARCEL_MENU.find(c => c.items.some(i => i.id === id));
      const item = category?.items.find(i => i.id === id);
      if (item) {
        itemTotal += item.price * (qty as number);
      }
    }

    let finalTotal = itemTotal === 0 ? 0 : (hasBundle ? itemTotal : Math.ceil(itemTotal / 10) * 10);
    if (hasVoiceNote) {
      finalTotal += 9;
    }

    const amount = finalTotal * 100; // in paise

    // Validate amount >= 100 paise
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum amount is 100 paise.' },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Razorpay keys are not configured.' },
        { status: 401 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount, // amount in the smallest currency unit (paise)
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order.' },
      { status: 500 }
    );
  }
}
