export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/api/admin/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/', '/images/'],
      },
    ],
    sitemap: 'https://ktcfashion.netlify.app/sitemap.xml',
    host: 'https://ktcfashion.netlify.app',
  };
}
