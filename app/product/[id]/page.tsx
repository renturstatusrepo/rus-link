import { getProduct } from '@/lib/api-client';
import { notFound } from 'next/navigation';
import ContentPage from '@/components/ContentPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    notFound();
  }

  return (
    <ContentPage
      id={product.id}
      title={product.title}
      description={product.description}
      image={product.image}
      deepLinkPath={`p/${id}`}
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const ASSET_URL = process.env.ASSET_URL || 'https://rus-assets.fra1.cdn.digitaloceanspaces.com';
  const BASE_URL = process.env.BASE_URL || 'https://link.renturstatus.com';
  const imageUrl = product.image ? `${ASSET_URL}/images/${product.image}` : '';
  const faviconUrl = `${BASE_URL}/favicon.ico`;
  const ogImageUrl = imageUrl || faviconUrl;

  return {
    title: product.title,
    description: product.description || product.title,
    openGraph: {
      type: 'website',
      title: product.title,
      description: product.description || product.title,
      url: `${BASE_URL}/product/${id}`,
      siteName: 'RUS - Rent Ur Status',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description || product.title,
      images: [ogImageUrl],
    },
  };
}

