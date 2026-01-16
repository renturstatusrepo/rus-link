import { getVoucher } from '@/lib/api-client';
import { notFound } from 'next/navigation';
import ContentPage from '@/components/ContentPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const voucher = await getVoucher(id);
  
  if (!voucher) {
    notFound();
  }

  return (
    <ContentPage
      id={voucher.id}
      title={voucher.title}
      description={voucher.description}
      image={voucher.image}
      deepLinkPath={`voucher/${id}`}
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const voucher = await getVoucher(id);
  
  if (!voucher) {
    return {
      title: 'Voucher Not Found',
    };
  }

  const ASSET_URL = process.env.ASSET_URL || 'https://rus-assets.fra1.cdn.digitaloceanspaces.com';
  const BASE_URL = process.env.BASE_URL || 'https://link.renturstatus.com';
  const imageUrl = voucher.image ? `${ASSET_URL}/images/${voucher.image}` : '';
  const faviconUrl = `${BASE_URL}/favicon.ico`;
  const ogImageUrl = imageUrl || faviconUrl;

  return {
    title: voucher.title,
    description: voucher.description || voucher.title,
    openGraph: {
      type: 'website',
      title: voucher.title,
      description: voucher.description || voucher.title,
      url: `${BASE_URL}/voucher/${id}`,
      siteName: 'RUS - Rent Ur Status',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: voucher.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: voucher.title,
      description: voucher.description || voucher.title,
      images: [ogImageUrl],
    },
  };
}

