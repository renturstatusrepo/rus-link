'use client';

import { useEffect } from 'react';

interface ReferralPageProps {
  code: string;
}

export default function ReferralPage({ code }: ReferralPageProps) {
  const deepLinkPath = code ? `referral?ref=${code}` : 'referral';

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

  const handleOpenApp = () => {
    window.location.href = `russm://${deepLinkPath}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">🎉 Join RUS!</h1>
          <p className="text-lg mb-6 text-white/90">
            Use my referral code to earn rewards together!
          </p>
          
          {/* Referral Code */}
          {code && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-8 mb-6 border-2 border-white/30">
              <p className="text-3xl font-bold tracking-wider">{code}</p>
            </div>
          )}
          
          <p className="text-base mb-8 text-white/80">
            Download the RUS app and use this code when signing up!
          </p>

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
                Download on the App Store
              </a>
              <a
                id="android-download"
                href="https://play.google.com/store/apps/details?id=com.renturstatus.rus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white hover:bg-gray-100 text-purple-600 font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-center shadow-lg hover:shadow-xl"
              >
                Get it on Google Play
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

