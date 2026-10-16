import { NextResponse } from 'next/server';
import { saveDbInquiry, getDbInquiries } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const inquiries = await getDbInquiries();
    return NextResponse.json({ success: true, inquiries });
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
    const saved = await saveDbInquiry(body);
    return NextResponse.json({
      success: true,
      message: 'Inquiry saved successfully to database!',
      inquiry: saved
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
