const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DOMAIN = 'www.rozgartools.store';
const SITEMAP_URL = `https://${DOMAIN}/sitemap.xml`;
const INDEXNOW_KEY = 'd4e5f6a1b2c347890123456789abcdef';
const KEY_LOCATION = `https://${DOMAIN}/${INDEXNOW_KEY}.txt`;

// Read all URLs from sitemap.xml
const sitemapPath = path.join(__dirname, 'sitemap.xml');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
const urlList = urlMatches.map(u => u.replace(/<\/?loc>/g, '').trim());

console.log(`Found ${urlList.length} URLs in sitemap to notify search engines.`);

function makeRequest(url, options = {}, postData = null) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data });
      });
    });
    req.on('error', (err) => {
      resolve({ error: err.message });
    });
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function run() {
  console.log('\n=============================================');
  console.log('🚀 PINGING MAJOR SEARCH ENGINES FOR INSTANT CRAWL');
  console.log('=============================================\n');

  // 1. Google Sitemap Ping
  console.log('1️⃣ Sending ping to Google Sitemap crawler...');
  const googlePing = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
  const gRes = await makeRequest(googlePing);
  console.log(`   Google Ping Response Status: ${gRes.statusCode || gRes.error}`);

  // 2. Bing Sitemap Ping
  console.log('2️⃣ Sending ping to Microsoft Bing Sitemap crawler...');
  const bingPing = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
  const bRes = await makeRequest(bingPing);
  console.log(`   Bing Ping Response Status: ${bRes.statusCode || bRes.error}`);

  // 3. IndexNow to api.indexnow.org
  console.log('3️⃣ Sending batch URL list to IndexNow (Bing, Yandex, Naver)...');
  const payload = JSON.stringify({
    host: DOMAIN,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList
  });

  const indexNowOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const inRes = await makeRequest('https://api.indexnow.org/indexnow', indexNowOptions, payload);
  console.log(`   IndexNow (Global API) Response Status: ${inRes.statusCode} ${inRes.data || ''}`);

  const bingInRes = await makeRequest('https://www.bing.com/indexnow', indexNowOptions, payload);
  console.log(`   IndexNow (Bing Direct) Response Status: ${bingInRes.statusCode} ${bingInRes.data || ''}`);

  console.log('\n=============================================');
  console.log('✅ ALL SEARCH ENGINES NOTIFIED SUCCESSFULLY!');
  console.log('=============================================\n');
}

run();
