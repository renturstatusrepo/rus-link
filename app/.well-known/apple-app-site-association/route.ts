// iOS Universal Links - Apple App Site Association
// This file MUST be served at: https://link.renturstatus.com/.well-known/apple-app-site-association
import { NextResponse } from 'next/server';

export async function GET() {
  const teamId = process.env.APPLE_TEAM_ID || 'W3G35YP6ZX';
  const appId = `${teamId}.com.renturstatus.rus`;
  
  const aasa = {
    applinks: {
      apps: [],
      details: [
        {
          appID: appId,
          paths: [
            '/ads/*',
            '/campaign/*',
            '/c/*',
            '/u/*',
            '/product/*',
            '/p/*',
            '/event/*',
            '/e/*',
            '/good/*',
            '/g/*',
            '/voucher/*',
            '/coupon/*',
            '/cp/*',
            '/category/*',
            '/business/*',
            '/referral*',
            '/home',
            '/discover',
            '/campaigns',
            '/marketplace',
            '/events',
            '/wallet',
            '/profile',
            '/messages',
            '/social-good',
            '/games',
            '/coupons',
            '/vouchers',
            '/users',
            '/leaderboard'
          ]
        }
      ]
    },
    webcredentials: {
      apps: [appId]
    }
  };

  return NextResponse.json(aasa, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

