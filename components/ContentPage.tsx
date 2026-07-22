'use client';

import { useEffect, useState } from 'react';
import { parseImageUrls } from '@/lib/utils';

interface ContentPageProps {
  id: string;
  title: string;
  description?: string;
  image?: string;
  images?: string[];
  price?: number;
  deepLinkPath: string;
}

export default function ContentPage({
  id,
  title,
  description,
  image,
  images,
  price,
  deepLinkPath,
}: ContentPageProps) {
  const imageUrls = parseImageUrls(image, images);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const deepLink = `russm://${deepLinkPath}`;
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
  }, [deepLinkPath]);

  // Ensure title and description are strings, not null
  const safeTitle = title || 'Content';
  const safeDescription = description && typeof description === 'string' ? description.trim() : '';

  const currentImageUrl = imageUrls[activeImageIndex] || imageUrls[0] || '';

  const handleOpenApp = () => {
    window.location.href = `russm://${deepLinkPath}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Main Image Display */}
          {currentImageUrl && (
            <div className="bg-gray-900/5 flex flex-col items-center justify-center p-4 border-b border-gray-100">
              <div className="relative w-full max-h-[500px] flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm p-2">
                <img
                  src={currentImageUrl}
                  alt={safeTitle}
                  className="max-h-[460px] w-auto max-w-full object-contain rounded-lg transition-all duration-300"
                />
              </div>

              {/* Thumbnail Selector if multiple images exist */}
              {imageUrls.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto max-w-full py-1 px-2">
                  {imageUrls.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                        idx === activeImageIndex
                          ? 'border-purple-600 shadow-md scale-105'
                          : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`${safeTitle} - thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content Section */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {safeTitle}
              </h1>
              {price !== undefined && price !== null && (
                <div className="inline-flex items-center text-2xl font-extrabold text-purple-700 bg-purple-50 px-4 py-1.5 rounded-xl border border-purple-100 w-fit">
                  ₦{Number(price).toLocaleString()}
                </div>
              )}
            </div>

            {safeDescription && (
              <p className="text-lg text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
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


