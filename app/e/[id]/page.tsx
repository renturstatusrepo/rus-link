import { getEvent } from '@/lib/api-client';
import { notFound } from 'next/navigation';
import ContentPage from '@/components/ContentPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);
  
  if (!event) {
    notFound();
  }

  return (
    <ContentPage
      id={event.id}
      title={event.title}
      description={event.description}
      image={event.image}
      deepLinkPath={`e/${id}`}
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);
  
  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  const ASSET_URL = process.env.ASSET_URL || 'https://rus-assets.fra1.cdn.digitaloceanspaces.com';
  const BASE_URL = process.env.BASE_URL || 'https://link.renturstatus.com';
  const imageUrl = event.image ? `${ASSET_URL}/images/${event.image}` : '';
  const faviconUrl = `${BASE_URL}/favicon.ico`;
  const ogImageUrl = imageUrl || faviconUrl;

  return {
    title: event.title,
    description: event.description || event.title,
    openGraph: {
      type: 'website',
      title: event.title,
      description: event.description || event.title,
      url: `${BASE_URL}/e/${id}`,
      siteName: 'RUS - Rent Ur Status',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description || event.title,
      images: [ogImageUrl],
    },
  };
}

