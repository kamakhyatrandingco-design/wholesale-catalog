/**
 * GitHub Contents API helper for serverless-compatible product storage.
 * 
 * On platforms like Netlify/Vercel the filesystem is read-only (EROFS).
 * This module replaces all `fs.readFileSync` / `fs.writeFileSync` calls
 * with GitHub REST API calls so the admin portal can create, update, and
 * delete product markdown files by committing them directly to the repo.
 *
 * Required env vars:
 *   GITHUB_TOKEN          : A fine-grained PAT with Contents read/write scope
 *   GITHUB_REPO_OWNER     : e.g. "kamakhyatrandingco-design"
 *   GITHUB_REPO_NAME      : e.g. "wholesale-catalog"
 *   GITHUB_BRANCH         : e.g. "main" (defaults to "main")
 */

const GITHUB_API = 'https://api.github.com';

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER || 'kamakhyatrandingco-design';
  const repo = process.env.GITHUB_REPO_NAME || 'wholesale-catalog';
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token) {
    throw new Error(
      'GITHUB_TOKEN is not set. Add it to your environment variables on Netlify.'
    );
  }

  return { token, owner, repo, branch };
}

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

/**
 * List all files in a directory in the repo.
 * Returns an array of { name, path, sha, download_url }.
 */
export async function listFiles(dirPath) {
  const { token, owner, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${dirPath}?ref=${branch}`;
  const res = await fetch(url, { headers: headers(token), cache: 'no-store' });

  if (res.status === 404) return [];
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub listFiles failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/**
 * Get a single file's content (decoded from base64).
 * Returns { content: string, sha: string } or null if not found.
 */
export async function getFile(filePath) {
  const { token, owner, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
  const res = await fetch(url, { headers: headers(token), cache: 'no-store' });

  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub getFile failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return { content, sha: data.sha };
}

/**
 * Create or update a file in the repo.
 * If `sha` is provided, it's an update; otherwise it's a create.
 */
export async function putFile(filePath, content, message, sha = null) {
  const { token, owner, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`;

  const body = {
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch,
    committer: {
      name: process.env.GITHUB_COMMITTER_NAME || 'hariomjoshi45',
      email: process.env.GITHUB_COMMITTER_EMAIL || 'harijoshi215@gmail.com',
    },
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub putFile failed (${res.status}): ${err}`);
  }

  return res.json();
}

/**
 * Delete a file from the repo.
 */
export async function deleteFile(filePath, sha, message) {
  const { token, owner, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`;

  const body = {
    message,
    sha,
    branch,
    committer: {
      name: process.env.GITHUB_COMMITTER_NAME || 'hariomjoshi45',
      email: process.env.GITHUB_COMMITTER_EMAIL || 'harijoshi215@gmail.com',
    },
  };

  const res = await fetch(url, {
    method: 'DELETE',
    headers: headers(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub deleteFile failed (${res.status}): ${err}`);
  }

  return res.json();
}
