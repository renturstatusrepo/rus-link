import { getCoupon } from '@/lib/api-client';
import { notFound } from 'next/navigation';
import ContentPage from '@/components/ContentPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coupon = await getCoupon(id);
  
  if (!coupon) {
    notFound();
  }

  const title = coupon.title || coupon.slug || 'Coupon';

  return (
    <ContentPage
      id={coupon.id}
      title={title}
      description={coupon.description}
      image={coupon.image}
      deepLinkPath={`cp/${id}`}
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coupon = await getCoupon(id);
  
  if (!coupon) {
    return {
      title: 'Coupon Not Found',
    };
  }

  const title = coupon.title || coupon.slug || 'Coupon';
  const ASSET_URL = process.env.ASSET_URL || 'https://rus-assets.fra1.cdn.digitaloceanspaces.com';
  const BASE_URL = process.env.BASE_URL || 'https://link.renturstatus.com';
  const imageUrl = coupon.image ? `${ASSET_URL}/images/${coupon.image}` : '';
  const faviconUrl = `${BASE_URL}/favicon.ico`;

  return {
    title,
    description: coupon.description || title,
    openGraph: {
      title,
      description: coupon.description || title,
      images: imageUrl ? [imageUrl] : [faviconUrl],
      url: `${BASE_URL}/coupon/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: coupon.description || title,
      images: imageUrl ? [imageUrl] : [faviconUrl],
    },
  };
}

