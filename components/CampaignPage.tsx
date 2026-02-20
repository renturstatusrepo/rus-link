'use client';

import { useEffect } from 'react';
import { ASSET_URL } from '@/lib/api-client';

interface CampaignPageProps {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  content?: string;
  option?: string;
  refCode?: string;
  creator?: {
    name: string;
    photo?: string;
  };
  business?: {
    name: string;
    logo?: string;
  };
}

export default function CampaignPage({
  id,
  title,
  description,
  thumbnail,
  content,
  option = 'image',
  refCode,
  creator,
  business,
}: CampaignPageProps) {
  useEffect(() => {
    // Deep link script
    const deepLink = `russm://c/${id}${refCode ? `?ref=${refCode}` : ''}`;
    const iosAppStore = 'https://apps.apple.com/ng/app/rus-speed-marketing-platform/id6503910431';
    const androidPlayStore = 'https://play.google.com/store/apps/details?id=com.renturstatus.rus';

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isAndroid = /Android/.test(ua);
    const isMobile = isIOS || isAndroid;

    if (isMobile) {
      const start = Date.now();
      let timeout: NodeJS.Timeout;

      window.location.href = deepLink;

      timeout = setTimeout(() => {
        if (Date.now() - start < 2000) {
          if (isIOS) {
            window.location.href = iosAppStore;
          } else if (isAndroid) {
            window.location.href = androidPlayStore;
          }
        }
      }, 1500);

      const handleVisibilityChange = () => {
        if (document.hidden) {
          clearTimeout(timeout);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearTimeout(timeout);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }

    // Show/hide appropriate download buttons
    const iosBtn = document.getElementById('ios-download');
    const androidBtn = document.getElementById('android-download');
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
  }, [id]);

  const thumbnailUrl = thumbnail ? `${ASSET_URL}/images/${thumbnail}` : '';
  const contentUrl = content ? `${ASSET_URL}/${option === 'video' ? 'videos' : 'images'}/${content}` : '';
  const displayImage = thumbnailUrl || contentUrl;

  // Ensure title and description are strings, not null
  const safeTitle = title || 'Campaign';
  const safeDescription = description && typeof description === 'string' ? description.trim() : '';

  const handleOpenApp = () => {
    window.location.href = `russm://c/${id}${refCode ? `?ref=${refCode}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Creator/Business Header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-100 bg-white shadow-sm">
              {(business?.logo || creator?.photo) ? (
                <img
                  src={`${ASSET_URL}/images/${business?.logo || creator?.photo}`}
                  alt={business?.name || creator?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">
                    {(business?.name || creator?.name || 'C').charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-tight">
                {business?.name || creator?.name}
              </p>
              <p className="text-xs text-purple-600 font-medium tracking-wide border-purple-200 border bg-purple-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                VERIFIED ADVERTISER
              </p>
            </div>
          </div>

          {/* Image/Video Section */}
          {displayImage && (
            <div className="relative w-full aspect-video bg-gray-100">
              {option === 'video' && contentUrl ? (
                <video
                  src={contentUrl}
                  controls
                  className="w-full h-full object-cover"
                  poster={thumbnailUrl}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={displayImage}
                  alt={safeTitle}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          {/* Content Section */}
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {safeTitle}
            </h1>

            {safeDescription && (
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {safeDescription}
              </p>
            )}

            {/* Action Buttons */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleOpenApp}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Open in RUS App
              </button>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  id="ios-download"
                  href="https://apps.apple.com/ng/app/rus-speed-marketing-platform/id6503910431"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-center shadow-md hover:shadow-lg"
                >
                  Download on App Store
                </a>
                <a
                  id="android-download"
                  href="https://play.google.com/store/apps/details?id=com.renturstatus.rus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-center shadow-md hover:shadow-lg"
                >
                  Get on Google Play
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Powered by RUS - RentUrStatus</p>
        </div>
      </div>
    </div>
  );
}

