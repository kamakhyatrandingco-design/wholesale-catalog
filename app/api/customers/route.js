import { NextResponse } from 'next/server';
import { saveDbCustomer, getDbCustomers } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const customers = await getDbCustomers();
    return NextResponse.json({ success: true, customers });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.name && !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Name and Phone number are required' },
        { status: 400 }
      );
    }

    const saved = await saveDbCustomer(body);
    return NextResponse.json({
      success: true,
      message: 'Customer sign-up details saved successfully to database!',
      customer: saved
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
