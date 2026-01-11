'use client';

import { useEffect } from 'react';
import { ASSET_URL } from '@/lib/api-client';

interface UserProfilePageProps {
  username: string;
  name: string;
  photo?: string;
}

export default function UserProfilePage({
  username,
  name,
  photo,
}: UserProfilePageProps) {
  const deepLinkPath = `u/${username}`;

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

  const imageUrl = photo ? `${ASSET_URL}/images/${photo}` : '';
  const initials = name.charAt(0).toUpperCase();

  const handleOpenApp = () => {
    window.location.href = `russm://${deepLinkPath}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center text-white">
          {/* Avatar */}
          <div className="mb-6">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-32 h-32 rounded-full border-4 border-white mx-auto object-cover shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white mx-auto bg-white/20 flex items-center justify-center text-5xl font-bold shadow-lg">
                {initials}
              </div>
            )}
          </div>

          {/* Name and Username */}
          <h1 className="text-3xl font-bold mb-2">{name}</h1>
          <p className="text-xl text-white/90 mb-6">@{username}</p>
          
          <p className="text-lg mb-8 text-white/80">Follow me on RUS!</p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleOpenApp}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 border-2 border-white/50 hover:border-white"
            >
              Open in RUS App
            </button>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                id="ios-download"
                href="https://apps.apple.com/ng/app/rus-speed-marketing-platform/id6503910431"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white hover:bg-gray-100 text-purple-600 font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-center shadow-lg hover:shadow-xl"
              >
                Download on App Store
              </a>
              <a
                id="android-download"
                href="https://play.google.com/store/apps/details?id=com.renturstatus.rus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white hover:bg-gray-100 text-purple-600 font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-center shadow-lg hover:shadow-xl"
              >
                Get on Google Play
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

