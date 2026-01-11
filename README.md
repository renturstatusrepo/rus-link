# RUS Link Service

A Next.js application that provides deep linking and social sharing pages for the RUS (RentUrStatus) platform. This replaces the previous Rust-based link service and integrates with the NestJS backend API.

## Features

- **Deep Link Pages**: Generate HTML pages for campaigns, products, events, social goods, vouchers, coupons, and user profiles
- **Universal Links**: iOS Universal Links support via Apple App Site Association
- **App Links**: Android App Links support via Asset Links
- **Social Sharing**: Open Graph and Twitter Card meta tags for rich social media previews
- **Auto-Redirect**: Smart app detection and redirect logic with fallback to app stores

## Routes

### Campaign Routes
- `/ads/:id` - Campaign page (image/video)
- `/campaign/:id` - Campaign page (alternative route)
- `/c/:id` - Campaign page (short route)

### Product Routes
- `/product/:id` - Product page
- `/p/:id` - Product page (short route)

### Event Routes
- `/event/:slug` - Event page
- `/e/:slug` - Event page (short route)

### Social Good Routes
- `/good/:id` - Social good page
- `/g/:id` - Social good page (short route)

### Voucher & Coupon Routes
- `/voucher/:id` - Voucher page
- `/coupon/:id` - Coupon page
- `/cp/:id` - Coupon page (short route)

### User Profile Routes
- `/u/:username` - User profile page
- `/business/:username` - User profile page (redirects to /u/:username)

### Referral Route
- `/referral?ref=CODE` - Referral page with optional referral code

### Universal Links Configuration
- `/.well-known/apple-app-site-association` - iOS Universal Links configuration
- `/.well-known/assetlinks.json` - Android App Links configuration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Running NestJS backend API (rus-api-nestjs)

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `API_URL` - Your NestJS backend API URL (default: `http://localhost:3000/api`)
- `ASSET_URL` - CDN URL for images/videos (default: DigitalOcean Spaces URL)
- `BASE_URL` - Base URL for this link service (default: `https://link.renturstatus.com`)
- `APPLE_TEAM_ID` - Apple Developer Team ID for Universal Links
- `ANDROID_SHA256_FINGERPRINT` - SHA256 fingerprint for Android app signing

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the home page.

### Building for Production

```bash
npm run build
npm run start
```

## API Integration

This service fetches data from the NestJS backend API. Ensure the following endpoints are available and public (marked with `@Public()` decorator):

- `GET /api/campaign/:id` or `/api/campaign/slug/:slug`
- `GET /api/product/:id` or `/api/product/slug/:slug`
- `GET /api/event/:slug`
- `GET /api/socialgood/:id`
- `GET /api/voucher/:id`
- `GET /api/coupon/:id` or `/api/coupon/slug/:slug`
- `GET /api/user/slug/:slug`

**Note**: Some campaign endpoints may need to be marked as `@Public()` in the NestJS backend to allow unauthenticated access for link pages.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Other Platforms

This Next.js app can be deployed on any platform that supports Next.js:
- Vercel
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify
- Self-hosted with Node.js

Make sure to:
1. Set all environment variables
2. Configure your domain's DNS to point to the deployment
3. Set up HTTPS (required for Universal Links)
4. Verify `.well-known` routes are accessible

## Universal Links Setup

### iOS Universal Links

1. Ensure your domain has HTTPS enabled
2. The `/.well-known/apple-app-site-association` file must be served with `Content-Type: application/json`
3. Configure your Apple App ID in the environment variable `APPLE_TEAM_ID`
4. Update your iOS app's Associated Domains entitlement

### Android App Links

1. Ensure your domain has HTTPS enabled
2. The `/.well-known/assetlinks.json` file must be accessible
3. Update `ANDROID_SHA256_FINGERPRINT` with your app's signing certificate fingerprint
4. Configure your Android app's `AndroidManifest.xml` with intent filters

## Project Structure

```
rus-link/
├── app/                    # Next.js App Router pages
│   ├── .well-known/       # Universal Links configuration
│   ├── ads/               # Campaign routes
│   ├── campaign/          # Campaign routes (alt)
│   ├── c/                 # Campaign routes (short)
│   ├── product/           # Product routes
│   ├── p/                 # Product routes (short)
│   ├── event/             # Event routes
│   ├── e/                 # Event routes (short)
│   ├── good/              # Social good routes
│   ├── g/                 # Social good routes (short)
│   ├── voucher/           # Voucher routes
│   ├── coupon/            # Coupon routes
│   ├── cp/                # Coupon routes (short)
│   ├── u/                 # User profile routes
│   ├── business/          # Business profile routes
│   └── referral/          # Referral route
├── lib/                   # Utility functions
│   ├── api-client.ts     # API client for NestJS backend
│   └── utils.ts          # HTML generation and deep link utilities
└── public/               # Static assets
```

## Migration from Rust Service

This Next.js implementation replaces the previous Rust-based link service (`rus-api-rust`). Key differences:

- **No RethinkDB**: Now uses NestJS backend API instead of direct database access
- **TypeScript/Next.js**: Modern web framework with better SEO and performance
- **Server Components**: Leverages Next.js Server Components for better performance
- **Better DX**: Easier to maintain and extend with TypeScript

## License

Part of the RUS (RentUrStatus) platform.
