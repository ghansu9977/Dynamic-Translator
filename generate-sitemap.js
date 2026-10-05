import fs from 'fs';
import path from 'path';

// Define the root URL of your website
const SITE_URL = 'https://dynamic-translatx.vercel.app';

async function generateSitemap() {
  console.log('Generating sitemap...');
  
  // Static pages
  const staticPages = [
    '',
    '/blog',
    '/dashboard',
    '/admin'
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static pages
  for (const page of staticPages) {
    xml += `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <changefreq>daily</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
  }

  // Fetch dynamic blogs from API
  try {
    const res = await fetch('https://translater-free-api.onrender.com/api/v1/blogs');
    const data = await res.json();
    
    if (data.success && data.data) {
      for (const blog of data.data) {
        xml += `
  <url>
    <loc>${SITE_URL}/blog/${blog.slug}</loc>
    <lastmod>${new Date(blog.createdAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
      }
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  xml += `\n</urlset>`;

  // Write to public folder
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  console.log('Sitemap successfully generated at public/sitemap.xml!');
}

generateSitemap();
