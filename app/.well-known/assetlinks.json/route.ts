// Android App Links - Asset Links
// This file MUST be served at: https://link.renturstatus.com/.well-known/assetlinks.json
import { NextResponse } from 'next/server';

export async function GET() {
  const sha256 = process.env.ANDROID_SHA256_FINGERPRINT || 
    '38:40:96:D4:99:4F:80:20:4D:B1:39:1B:A0:7D:57:59:A8:1C:DD:D2:07:DF:EB:5A:5A:A3:B3:81:53:B3:3D:0E';
  
  const assetlinks = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.renturstatus.rus',
        sha256_cert_fingerprints: [sha256]
      }
    }
  ];

  return NextResponse.json(assetlinks, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

