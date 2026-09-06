import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ 
        client_id: process.env.GITHUB_CLIENT_ID, 
        client_secret: process.env.GITHUB_CLIENT_SECRET, 
        code 
      }),
    });
    
    const data = await res.json();
    const token = data.access_token;
    
    // Sends the secure key to your Admin Portal
    const html = `
      <!DOCTYPE html><html><body><script>
        const message = 'authorization:github:success:{"token":"' + "${token}" + '", "provider":"github"}';
        window.opener.postMessage(message, '*');
        window.close();
      </script></body></html>
    `;
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
  } catch (err) {
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}