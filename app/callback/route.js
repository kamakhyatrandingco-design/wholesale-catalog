import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is not configured." }, { status: 500 });
  }
  
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ 
        client_id: clientId, 
        client_secret: clientSecret, 
        code 
      }),
    });
    
    const data = await res.json();
    const token = data.access_token;

    if (!token) {
      const errorMsg = data.error_description || data.error || "Failed to obtain GitHub token";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }
    
    // Sends the secure key to your Admin Portal
    const html = `
      <!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;padding:2rem;text-align:center;">
        <h3>Authentication Successful</h3>
        <p>Connecting to Admin Portal...</p>
        <script>
          const message = 'authorization:github:success:{"token":"' + "${token}" + '", "provider":"github"}';
          if (window.opener) {
            window.opener.postMessage(message, '*');
            setTimeout(() => window.close(), 400);
          } else {
            document.body.innerHTML = '<h3>Authorized!</h3><p>You can close this tab and return to the Admin Portal.</p>';
          }
        </script>
      </body></html>
    `;
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
  } catch (err) {
    return NextResponse.json({ error: "Auth failed: " + err.message }, { status: 500 });
  }
}