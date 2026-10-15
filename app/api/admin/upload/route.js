import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Method 1: If GITHUB_TOKEN is set, upload to GitHub repo
    if (process.env.GITHUB_TOKEN) {
      try {
        const { putFile } = await import('@/app/lib/github');
        const token = process.env.GITHUB_TOKEN;
        const owner = process.env.GITHUB_REPO_OWNER || 'kamakhyatrandingco-design';
        const repo = process.env.GITHUB_REPO_NAME || 'wholesale-catalog';
        const branch = process.env.GITHUB_BRANCH || 'main';

        const base64Content = buffer.toString('base64');
        const filePath = `public/images/${safeName}`;

        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
        const res = await fetch(url, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `upload: product image ${safeName}`,
            content: base64Content,
            branch,
            committer: {
              name: process.env.GITHUB_COMMITTER_NAME || 'hariomjoshi45',
              email: process.env.GITHUB_COMMITTER_EMAIL || 'harijoshi215@gmail.com',
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const publicUrl = data.content?.download_url || `/images/${safeName}`;
          return NextResponse.json({ success: true, url: publicUrl });
        }
      } catch (ghErr) {
        console.warn("GitHub upload failed, falling back:", ghErr.message);
      }
    }

    // Method 2: Local filesystem upload
    try {
      const uploadsDir = path.join(process.cwd(), 'public/images');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({ success: true, url: `/images/${safeName}` });
    } catch (fsErr) {
      // Method 3: In-memory base64 Data URL fallback for read-only serverless environments
      const dataUri = `data:${mimeType};base64,${buffer.toString('base64')}`;
      return NextResponse.json({ success: true, url: dataUri });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
