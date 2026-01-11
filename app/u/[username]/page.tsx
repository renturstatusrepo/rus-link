import { getUserBySlug } from '@/lib/api-client';
import { notFound } from 'next/navigation';
import UserProfilePage from '@/components/UserProfilePage';

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await getUserBySlug(username);
  
  if (!user) {
    notFound();
  }

  return (
    <UserProfilePage
      username={user.username}
      name={user.name}
      photo={user.photo}
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await getUserBySlug(username);
  
  if (!user) {
    return {
      title: 'User Not Found',
    };
  }

  const ASSET_URL = process.env.ASSET_URL || 'https://rus-assets.fra1.cdn.digitaloceanspaces.com';
  const BASE_URL = process.env.BASE_URL || 'https://link.renturstatus.com';
  const imageUrl = user.photo ? `${ASSET_URL}/images/${user.photo}` : '';

  return {
    title: `${user.name} (@${user.username})`,
    description: `Follow @${user.username} on RUS!`,
    openGraph: {
      type: 'profile',
      title: user.name,
      description: `Follow @${user.username} on RUS!`,
      images: imageUrl ? [imageUrl] : [],
      url: `${BASE_URL}/u/${username}`,
    },
  };
}
