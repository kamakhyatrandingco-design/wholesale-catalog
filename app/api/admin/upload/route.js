import { NextResponse } from 'next/server';
import { putFile } from '@/app/lib/github';

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

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `public/images/${safeName}`;

    // Upload image to GitHub repo
    const base64Content = buffer.toString('base64');
    const { token, owner, repo, branch } = getConfigForUpload();

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
          name: 'hariomjoshi45',
          email: 'harijoshi215@gmail.com',
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`GitHub upload failed: ${err}`);
    }

    const data = await res.json();
    // Return the raw GitHub URL for direct image access
    const publicUrl = data.content?.download_url || `/images/${safeName}`;

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

function getConfigForUpload() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER || 'kamakhyatrandingco-design';
  const repo = process.env.GITHUB_REPO_NAME || 'wholesale-catalog';
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token) {
    throw new Error('GITHUB_TOKEN is not set.');
  }

  return { token, owner, repo, branch };
}
