import { NextResponse } from 'next/server';
import { isDatabaseConfigured, getDatabaseProvider } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isConfigured = isDatabaseConfigured();
  const provider = getDatabaseProvider();

  return NextResponse.json({
    configured: isConfigured,
    provider,
    message: isConfigured 
      ? `Connected to ${provider.toUpperCase()} database`
      : 'Using local storage mode. Connect free Supabase or Neon DB to enable persistent multi-user cloud storage.'
  });
}
