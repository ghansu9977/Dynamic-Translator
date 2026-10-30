import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://dynamic-translatx.vercel.app';
const API_URL = 'https://translater-free-api.onrender.com/api/v1/blogs';

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function replaceMetaDescription(html, newDescription) {
  return html
    .replace(/<meta\s+name=["']description["'][\s\S]*?\/>/i, `<meta name="description" content="${newDescription}" />`)
    .replace(/<meta\s+property=["']og:description["'][\s\S]*?\/>/i, `<meta property="og:description" content="${newDescription}" />`)
    .replace(/<meta\s+property=["']twitter:description["'][\s\S]*?\/>/i, `<meta property="twitter:description" content="${newDescription}" />`);
}

function replaceSchema(html, schemaObject) {
  const schemaScript = `<!-- Structured Data (JSON-LD) for SEO -->\n  <script type="application/ld+json">\n${JSON.stringify(schemaObject, null, 2)}\n  </script>`;
  return html.replace(/<!-- Structured Data \(JSON-LD\) for SEO -->[\s\S]*?<\/script>/i, schemaScript);
}

async function prerender() {
  console.log('--- Starting Static Pre-Rendering (SSG) for SEO ---');
  
  const distDir = path.join(process.cwd(), 'dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('dist/index.html not found! Run "vite build" first.');
    return;
  }

  const baseTemplate = fs.readFileSync(templatePath, 'utf8');

  // Fetch blogs from API
  let blogs = [];
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      blogs = data.data;
      console.log(`Fetched ${blogs.length} blogs from API.`);
    }
  } catch (err) {
    console.error('Failed to fetch blogs from API during prerender:', err.message);
  }

  if (blogs.length === 0) {
    console.warn('No blogs found to prerender. Skipping dynamic blog SSG.');
    return;
  }

  // 1. Pre-render /blog index page
  const blogDir = path.join(distDir, 'blog');
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  const blogCardsHtml = blogs.map(b => `
    <article class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 shadow-xl flex flex-col">
      ${b.imageUrl ? `
        <a href="/blog/${b.slug}" class="block w-full h-48 overflow-hidden">
          <img src="${escapeHtml(b.imageUrl)}" alt="${escapeHtml(b.title)}" class="w-full h-full object-cover" loading="lazy" />
        </a>
      ` : ''}
      <div class="p-6 flex flex-col flex-grow">
        <div class="flex justify-between items-center text-indigo-400 mb-3 text-xs font-semibold tracking-wide uppercase">
          <span>${new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span class="bg-indigo-500/10 px-2 py-1 rounded">${escapeHtml(b.readTime || '5 min read')}</span>
        </div>
        <a href="/blog/${b.slug}" class="block group">
          <h2 class="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
            ${escapeHtml(b.title)}
          </h2>
        </a>
        <p class="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
          ${escapeHtml(b.excerpt || '')}
        </p>
        <div class="mt-auto pt-4 border-t border-slate-800/50">
          <a href="/blog/${b.slug}" class="inline-flex items-center text-sm font-semibold text-indigo-400 hover:text-indigo-300">
            Read Full Article &rarr;
          </a>
        </div>
      </div>
    </article>
  `).join('\n');

  const blogPageContent = `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full">
      <nav class="sticky top-0 z-50 glass-card border-b border-slate-800 px-6 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" class="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" class="w-10 h-10 rounded-xl object-cover" />
            <span class="text-base sm:text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Dynamic Translator API</span>
          </a>
          <a href="/" class="text-sm font-medium text-slate-300 hover:text-indigo-400">&larr; Back to Home</a>
        </div>
      </nav>
      <main class="max-w-5xl mx-auto px-4 sm:px-6 py-24 flex-grow w-full mt-6">
        <h1 class="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-4">
          Documentation & Localization Blog
        </h1>
        <p class="text-slate-400 mb-12 text-lg">Learn how to localize your apps dynamically, integrate translation APIs, and improve global reach.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          ${blogCardsHtml}
        </div>
      </main>
      <footer class="border-t border-slate-900 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500">
        <p>&copy; 2026 Dynamic Translator API. All rights reserved.</p>
      </footer>
    </div>
  `;

  const blogIndexDesc = "Explore guides, tutorials, and benchmarks on dynamic translation APIs, Flutter localization, React i18n, and website translation.";
  let blogIndexHtml = baseTemplate
    .replace(/<title>.*?<\/title>/, '<title>Developer Guides & Localization Blog | Dynamic Translator API</title>')
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${SITE_URL}/blog" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${SITE_URL}/blog" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, '<meta property="og:title" content="Developer Guides & Localization Blog | Dynamic Translator API" />')
    .replace('<div id="root"></div>', `<div id="root">${blogPageContent}</div>`);

  blogIndexHtml = replaceMetaDescription(blogIndexHtml, blogIndexDesc);

  fs.writeFileSync(path.join(blogDir, 'index.html'), blogIndexHtml);
  console.log('✓ Pre-rendered /blog/index.html');

  // 2. Pre-render each individual blog post
  for (const blog of blogs) {
    const postDir = path.join(blogDir, blog.slug);
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }

    const postUrl = `${SITE_URL}/blog/${blog.slug}`;
    const cleanExcerpt = escapeHtml(blog.excerpt || 'Read this in-depth guide on the Dynamic Translator API blog.');
    const cleanTitle = escapeHtml(blog.title);
    const dateFormatted = new Date(blog.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const postSchema = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": blog.title,
      "image": blog.imageUrl || `${SITE_URL}/logo.jpg`,
      "author": {
        "@type": "Organization",
        "name": blog.author || "Dynamic Translator Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Dynamic Translator API",
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}/logo.jpg`
        }
      },
      "datePublished": blog.createdAt,
      "description": blog.excerpt || blog.title,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": postUrl
      }
    };

    const postContent = `
      <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full">
        <nav class="sticky top-0 z-50 glass-card border-b border-slate-800 px-6 py-4">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/" class="flex items-center gap-3">
              <img src="/logo.jpg" alt="Logo" class="w-10 h-10 rounded-xl object-cover" />
              <span class="text-base sm:text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Dynamic Translator API</span>
            </a>
            <a href="/blog" class="text-sm font-medium text-slate-300 hover:text-indigo-400">&larr; Back to Blog</a>
          </div>
        </nav>
        <main class="max-w-4xl mx-auto px-4 sm:px-6 py-16 flex-grow w-full mt-4">
          <article>
            <div class="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold tracking-wide uppercase text-indigo-400">
              <span>${dateFormatted}</span>
              <span class="text-slate-600">&bull;</span>
              <span class="bg-indigo-500/10 px-2.5 py-1 rounded-full">${escapeHtml(blog.readTime || '5 min read')}</span>
              <span class="text-slate-600">&bull;</span>
              <span class="text-slate-400">By ${escapeHtml(blog.author || 'Dynamic Translator Team')}</span>
            </div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-8">
              ${cleanTitle}
            </h1>
            ${blog.imageUrl ? `
              <div class="w-full h-72 sm:h-96 rounded-2xl overflow-hidden mb-10 shadow-2xl border border-slate-800">
                <img src="${escapeHtml(blog.imageUrl)}" alt="${cleanTitle}" class="w-full h-full object-cover" />
              </div>
            ` : ''}
            <div class="prose prose-invert prose-indigo max-w-none text-slate-300 leading-relaxed text-base sm:text-lg space-y-6">
              ${blog.content}
            </div>
            <div class="mt-12 pt-8 border-t border-slate-800 flex items-center justify-between">
              <a href="/blog" class="inline-flex items-center text-sm font-semibold text-indigo-400 hover:text-indigo-300">
                &larr; Back to All Articles
              </a>
              <a href="/" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition">
                Get API Key Free
              </a>
            </div>
          </article>
        </main>
        <footer class="border-t border-slate-900 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500">
          <p>&copy; 2026 Dynamic Translator API. All rights reserved.</p>
        </footer>
      </div>
    `;

    let postHtml = baseTemplate
      .replace(/<title>.*?<\/title>/, `<title>${cleanTitle} | Dynamic Translator API</title>`)
      .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${postUrl}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${postUrl}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${cleanTitle}" />`)
      .replace(/<meta property="og:type" content=".*?" \/>/, '<meta property="og:type" content="article" />')
      .replace(/<meta property="twitter:url" content=".*?" \/>/, `<meta property="twitter:url" content="${postUrl}" />`)
      .replace(/<meta property="twitter:title" content=".*?" \/>/, `<meta property="twitter:title" content="${cleanTitle}" />`)
      .replace('<div id="root"></div>', `<div id="root">${postContent}</div>`);

    postHtml = replaceMetaDescription(postHtml, cleanExcerpt);
    postHtml = replaceSchema(postHtml, postSchema);

    fs.writeFileSync(path.join(postDir, 'index.html'), postHtml);
    console.log(`✓ Pre-rendered: /blog/${blog.slug}/index.html`);
  }

  console.log(`\n🎉 Successfully pre-rendered ${blogs.length} blog pages for SEO!`);
}

prerender();
