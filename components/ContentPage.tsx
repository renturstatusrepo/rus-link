'use client';

import { useEffect } from 'react';
import { ASSET_URL } from '@/lib/api-client';

interface ContentPageProps {
  id: string;
  title: string;
  description?: string;
  image?: string;
  deepLinkPath: string;
}

export default function ContentPage({
  id,
  title,
  description,
  image,
  deepLinkPath,
}: ContentPageProps) {
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

  const imageUrl = image ? `${ASSET_URL}/images/${image}` : '';
  
  // Ensure title and description are strings, not null
  const safeTitle = title || 'Content';
  const safeDescription = description && typeof description === 'string' ? description.trim() : '';

  const handleOpenApp = () => {
    window.location.href = `russm://${deepLinkPath}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Image Section */}
          {imageUrl && (
            <div className="relative w-full aspect-video bg-gray-100">
              <img
                src={imageUrl}
                alt={safeTitle}
                className="w-full h-full object-cover"
              />
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

