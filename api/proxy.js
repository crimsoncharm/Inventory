/**
 * Vercel Serverless Function Proxy for Crimson Charm Inventory App
 * Forwards requests between Vercel frontend and Google Apps Script Web App.
 * Resolves CORS and follows Google's 302 redirects server-side.
 */

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-apps-script-url, Authorization');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Determine Google Apps Script Web App URL
  const scriptUrl = req.headers['x-apps-script-url'] || process.env.APPS_SCRIPT_URL;

  if (!scriptUrl || typeof scriptUrl !== 'string' || !scriptUrl.trim().startsWith('http')) {
    return res.status(400).json({
      success: false,
      error: 'Google Apps Script Web App URL is not configured. Please add APPS_SCRIPT_URL in your Vercel Environment Variables or configure it under the "More > Settings" tab in the app.'
    });
  }

  const cleanUrl = scriptUrl.trim();

  try {
    let response;
    if (req.method === 'POST') {
      const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
      response = await fetch(cleanUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload,
        redirect: 'follow'
      });
    } else {
      // Forward GET request with query params
      const queryString = new URL(req.url, 'http://localhost').search;
      const targetGetUrl = cleanUrl + (cleanUrl.includes('?') ? '&' : '?') + queryString.replace(/^\?/, '');
      response = await fetch(targetGetUrl, {
        method: 'GET',
        redirect: 'follow'
      });
    }

    const textData = await response.text();
    let jsonData;
    try {
      jsonData = JSON.parse(textData);
    } catch (parseErr) {
      // If Apps Script returned HTML or error text
      return res.status(200).json({
        success: false,
        error: 'Backend returned non-JSON response: ' + textData.slice(0, 300)
      });
    }

    return res.status(200).json(jsonData);
  } catch (error) {
    console.error('Proxy request to Apps Script failed:', error);
    return res.status(502).json({
      success: false,
      error: 'Failed to communicate with Google Apps Script backend: ' + (error.message || String(error))
    });
  }
};
