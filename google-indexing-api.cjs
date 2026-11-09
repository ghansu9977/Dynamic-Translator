/**
 * Google Indexing API - Automatic URL Indexing Script
 * RozgarTools.store
 * 
 * This script reads all URLs from sitemap.xml and automatically submits them
 * to Google Indexing API (https://indexing.googleapis.com/v3/urlNotifications:publish)
 * for instant indexing/crawling by Googlebot.
 * 
 * Requirement:
 * Place your Google Cloud service account JSON file as "service_account.json"
 * in the landing_page directory and ensure the service account email is added
 * as an Owner in Google Search Console (https://search.google.com/search-console).
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');
const KEY_FILE = path.join(__dirname, 'service_account.json');

// Base64URL helper
function base64Url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Generate JWT and get OAuth2 Access Token from Google
async function getGoogleAccessToken(keyData) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;

  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const claimSet = {
    iss: keyData.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: exp,
    iat: iat
  };

  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedClaimSet = base64Url(JSON.stringify(claimSet));
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(keyData.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${signatureInput}.${signature}`;

  return new Promise((resolve, reject) => {
    const postData = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`;
    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.access_token) {
            resolve(json.access_token);
          } else {
            reject(new Error(`Failed to get access token: ${data}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Send publish request for a single URL
function publishUrl(url, accessToken) {
  return new Promise((resolve) => {
    const postBody = JSON.stringify({
      url: url,
      type: 'URL_UPDATED'
    });

    const req = https.request('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Length': Buffer.byteLength(postBody)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          url: url,
          statusCode: res.statusCode,
          response: body
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        url: url,
        error: err.message
      });
    });

    req.write(postBody);
    req.end();
  });
}

async function main() {
  console.log('====================================================');
  console.log('🔍 GOOGLE INDEXING API AUTOMATIC SUBMISSION TOOL');
  console.log('====================================================\n');

  // 1. Read sitemap.xml
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('❌ Error: sitemap.xml not found at:', SITEMAP_PATH);
    return;
  }

  const xmlContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const urlMatches = xmlContent.match(/<loc>(.*?)<\/loc>/g) || [];
  const urls = urlMatches.map(u => u.replace(/<\/?loc>/g, '').trim());

  console.log(`📋 Found ${urls.length} URLs in sitemap.xml ready for Google indexing.\n`);

  // 2. Check service_account.json
  if (!fs.existsSync(KEY_FILE)) {
    console.log('⚠️ Notice: "service_account.json" not found in project root.');
    console.log('----------------------------------------------------');
    console.log('To use 100% automated Google Indexing API:');
    console.log('1. Go to Google Cloud Console (https://console.cloud.google.com/)');
    console.log('2. Create a Project & Enable "Web Search Indexing API"');
    console.log('3. Create a Service Account, generate a JSON Key, and save it as "service_account.json" in this directory.');
    console.log('4. Open Google Search Console -> Settings -> Users and Permissions -> Add your service account email as "Owner".');
    console.log('5. Re-run: node google-indexing-api.cjs');
    console.log('----------------------------------------------------\n');
    console.log('💡 Alternate Free 1-Click Method (No API key needed):');
    console.log('Open Google Search Console (https://search.google.com/search-console)');
    console.log('Go to "Sitemaps" tab -> Enter "sitemap.xml" -> Click Submit!');
    console.log('Google will automatically crawl all 35 URLs from the sitemap.\n');
    return;
  }

  // 3. Authenticate and Publish
  try {
    const keyData = JSON.parse(fs.readFileSync(KEY_FILE, 'utf8'));
    console.log(`🔐 Authenticating as: ${keyData.client_email}...`);
    const accessToken = await getGoogleAccessToken(keyData);
    console.log('✅ OAuth2 Access Token successfully retrieved from Google!\n');

    console.log('🚀 Sending URLs to Google Indexing API...');
    let successCount = 0;
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const result = await publishUrl(url, accessToken);
      if (result.statusCode === 200) {
        console.log(`  [${i + 1}/${urls.length}] ✅ Submitted: ${url}`);
        successCount++;
      } else {
        console.log(`  [${i + 1}/${urls.length}] ⚠️ Status ${result.statusCode}: ${url}`);
      }
      // Small pause to avoid hitting quota
      await new Promise(r => setTimeout(r, 200));
    }

    console.log(`\n🎉 Done! ${successCount} of ${urls.length} URLs submitted directly to Googlebot!`);
  } catch (error) {
    console.error('❌ Error during Google Indexing API execution:', error.message);
  }
}

main();
