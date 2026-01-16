import { getSocialGood } from '@/lib/api-client';
import { notFound } from 'next/navigation';
import ContentPage from '@/components/ContentPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const good = await getSocialGood(id);
  
  if (!good) {
    notFound();
  }

  return (
    <ContentPage
      id={good.id}
      title={good.title}
      description={good.description}
      image={good.image}
      deepLinkPath={`g/${id}`}
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const good = await getSocialGood(id);
  
  if (!good) {
    return {
      title: 'Social Good Not Found',
    };
  }

  const ASSET_URL = process.env.ASSET_URL || 'https://rus-assets.fra1.cdn.digitaloceanspaces.com';
  const BASE_URL = process.env.BASE_URL || 'https://link.renturstatus.com';
  const imageUrl = good.image ? `${ASSET_URL}/images/${good.image}` : '';
  const faviconUrl = `${BASE_URL}/favicon.ico`;
  const ogImageUrl = imageUrl || faviconUrl;

  return {
    title: good.title,
    description: good.description || good.title,
    openGraph: {
      type: 'website',
      title: good.title,
      description: good.description || good.title,
      url: `${BASE_URL}/g/${id}`,
      siteName: 'RUS - Rent Ur Status',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: good.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: good.title,
      description: good.description || good.title,
      images: [ogImageUrl],
    },
  };
}

