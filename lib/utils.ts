// Utility functions for generating HTML and deep link scripts
import { ASSET_URL, BASE_URL } from './api-client';

export function generateDeepLinkScript(deepLinkPath: string): string {
  return `
<script>
(function() {
    var deepLink = 'russm://${deepLinkPath}';
    var iosAppStore = 'https://apps.apple.com/ng/app/rus-speed-marketing-platform/id6503910431';
    var androidPlayStore = 'https://play.google.com/store/apps/details?id=com.renturstatus.rus';
    
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    var isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    var isAndroid = /Android/.test(ua);
    var isMobile = isIOS || isAndroid;
    
    // Only attempt redirect on mobile devices
    if (isMobile) {
        var start = Date.now();
        var timeout;
        
        // Try to open the app
        window.location.href = deepLink;
        
        // Check if we're still here after attempting to open app
        timeout = setTimeout(function() {
            // If we're still here, app probably isn't installed
            if (Date.now() - start < 2000) {
                if (isIOS) {
                    window.location.href = iosAppStore;
                } else if (isAndroid) {
                    window.location.href = androidPlayStore;
                }
            }
        }, 1500);
        
        // Clear timeout if page is hidden (app opened successfully)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                clearTimeout(timeout);
            }
        });
    }
    
    // Show/hide appropriate download buttons
    var iosBtn = document.getElementById('ios-download');
    var androidBtn = document.getElementById('android-download');
    if (iosBtn && androidBtn) {
        if (isIOS) {
            iosBtn.style.display = 'inline-block';
            androidBtn.style.display = 'none';
        } else if (isAndroid) {
            iosBtn.style.display = 'none';
            androidBtn.style.display = 'inline-block';
        } else {
            iosBtn.style.display = 'inline-block';
            androidBtn.style.display = 'inline-block';
        }
    }
})();
</script>
  `.trim();
}

export function generateContentHTML(
  title: string,
  description: string | undefined,
  image: string | undefined,
  url: string,
): string {
  const desc = description || title;
  const imgUrl = image ? `${ASSET_URL}/images/${image}` : '';
  const deepLinkScript = generateDeepLinkScript(url);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(desc)}">
    <meta property="og:image" content="${imgUrl}">
    <meta property="og:url" content="${BASE_URL}/${url}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(desc)}">
    <meta name="twitter:image" content="${imgUrl}">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #333; margin-bottom: 15px; }
        .image {
            width: 100%;
            max-height: 400px;
            object-fit: cover;
            border-radius: 8px;
            margin: 20px 0;
        }
        .description {
            color: #666;
            line-height: 1.6;
            margin: 20px 0;
        }
        .download-wrapper {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: center;
        }
        .download {
            display: inline-block;
            padding: 12px 24px;
            background: #7f23b8;
            color: #fff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
        }
        .open-app {
            margin-bottom: 10px;
            padding: 15px 30px;
            background: linear-gradient(135deg, #7f23b8 0%, #0E72DD 100%);
            color: #fff;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${escapeHtml(title)}</h1>
        ${imgUrl ? `<img src="${imgUrl}" alt="${escapeHtml(title)}" class="image" />` : ''}
        <div class="description">${escapeHtml(desc)}</div>
        <div class="download-wrapper">
            <button class="open-app" onclick="window.location.href='russm://${url}'">Open in RUS App</button>
            <a id="ios-download" href="https://apps.apple.com/ng/app/rus-speed-marketing-platform/id6503910431" class="download">Download on App Store</a>
            <a id="android-download" href="https://play.google.com/store/apps/details?id=com.renturstatus.rus" class="download">Get on Google Play</a>
        </div>
    </div>
    ${deepLinkScript}
</body>
</html>`;
}

export function generateCampaignHTML(
  id: string,
  campaignType: string,
  title: string,
  content: string,
  thumbnail: string,
): string {
  const script = generateDeepLinkScript(`c/${id}`);
  const thumbnailUrl = thumbnail ? `${ASSET_URL}/images/${thumbnail}` : '';
  const contentUrl = content ? `${ASSET_URL}/${campaignType === 'video' ? 'videos' : 'images'}/${content}` : '';
  
  let contentSection = '';
  if (campaignType === 'video' && contentUrl) {
    contentSection = `<video width="100%" controls>
                <source src="${contentUrl}" type="video/mp4">
            </video>`;
  } else if (campaignType === 'image' && thumbnailUrl) {
    contentSection = `<div class="bg" style="background-image: url(${thumbnailUrl});"></div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(title)}">
    <meta property="og:image" content="${thumbnailUrl}">
    <meta property="og:url" content="${BASE_URL}/ads/${id}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(title)}">
    <meta name="twitter:image" content="${thumbnailUrl}">
    <meta name="twitter:url" content="${BASE_URL}/ads/${id}">
    <meta property="linkedin:title" content="${escapeHtml(title)}">
    <meta property="linkedin:description" content="${escapeHtml(title)}">
    <meta property="linkedin:image" content="${thumbnailUrl}">
    <meta property="linkedin:url" content="${BASE_URL}/ads/${id}">
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #fff;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .bg {
            background-repeat: no-repeat;
            background-size: cover;
            background-position: 50%;
            width: 100%;
            height: 400px;
            display: block;
        }
        .card {
            border-radius: 5px;
            border: 1px solid #ccc;
            padding: 20px;
            margin-bottom: 20px;
        }
        .card h1 {
            font-size: 20px;
            margin-bottom: 10px;
        }
        .download-wrapper { margin-top: 20px; display: flex; flex-direction: column; gap: 12px; align-items: center; }
        .download { padding: 12px 24px; background: #7f23b8; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; }
        .open-app { margin-top: 15px; padding: 15px 30px; background: linear-gradient(135deg, #7f23b8 0%, #0E72DD 100%); color: #fff; border: none; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>${escapeHtml(title)}</h1>
            ${contentSection}
            <div class="download-wrapper">
                <button class="open-app" onclick="window.location.href='russm://c/${id}'">Open in RUS App</button>
                <a id="ios-download" href="https://apps.apple.com/ng/app/rus-speed-marketing-platform/id6503910431" class="download">Download on App Store</a>
                <a id="android-download" href="https://play.google.com/store/apps/details?id=com.renturstatus.rus" class="download">Get on Google Play</a>
            </div>
        </div>
    </div>
    ${script}
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

