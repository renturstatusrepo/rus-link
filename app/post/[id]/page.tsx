import { getPost, ASSET_URL } from '@/lib/api-client';
import ContentPage from '@/components/ContentPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return (
      <ContentPage
        id={id}
        title="Post Not Found"
        description="The post you are looking for does not exist or the API is currently unavailable."
        image={undefined}
        deepLinkPath={`post/${id}`}
      />
    );
  }

  const isMedia = post.option === 'image' || post.option === 'video';
  const getMediaName = () => {
    const img = post.content;
    if (!img) return undefined;
    return img.startsWith('http') ? undefined : img; // ContentPage doesn't support absolute URLs for images yet
  };
  const mediaName = isMedia ? getMediaName() : undefined;

  return (
    <ContentPage
      id={post.id}
      title={post.title}
      description={post.description || (isMedia ? '' : post.content)}
      image={mediaName}
      deepLinkPath={`post/${id}`}
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const BASE_URL = process.env.BASE_URL || 'https://link.renturstatus.com';
  const ASSET_URL_ENV = process.env.ASSET_URL || 'https://rus-assets.fra1.cdn.digitaloceanspaces.com';
  const faviconUrl = `${BASE_URL}/favicon.ico`;

  const isMedia = post.option === 'image' || post.option === 'video';
  const getMediaUrl = () => {
    const img = post.content;
    if (!img) return undefined;
    return img.startsWith('http') ? img : `${ASSET_URL_ENV}/images/${img}`;
  };
  const mediaUrl = isMedia ? getMediaUrl() : undefined;

  const ogImageUrl = mediaUrl || faviconUrl;

  return {
    title: post.title,
    description: post.description || post.title,
    openGraph: {
      type: 'website',
      title: post.title,
      description: post.description || post.content || post.title,
      url: `${BASE_URL}/post/${id}`,
      siteName: 'RUS - Rent Ur Status',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || post.content || post.title,
      images: [ogImageUrl],
    },
  };
}
