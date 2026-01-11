import { getCampaign } from '@/lib/api-client';
import { notFound } from 'next/navigation';
import CampaignPage from '@/components/CampaignPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  
  if (!campaign) {
    notFound();
  }

  return (
    <CampaignPage
      id={campaign.id}
      title={campaign.title}
      description={campaign.description}
      thumbnail={campaign.thumbnail}
      content={campaign.content}
      option={campaign.option}
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  
  if (!campaign) {
    return {
      title: 'Campaign Not Found',
    };
  }

  const ASSET_URL = process.env.ASSET_URL || 'https://rus-assets.fra1.cdn.digitaloceanspaces.com';
  const BASE_URL = process.env.BASE_URL || 'https://link.renturstatus.com';
  const thumbnailUrl = campaign.thumbnail ? `${ASSET_URL}/images/${campaign.thumbnail}` : '';

  return {
    title: campaign.title,
    description: campaign.description || campaign.title,
    openGraph: {
      title: campaign.title,
      description: campaign.description || campaign.title,
      images: thumbnailUrl ? [thumbnailUrl] : [],
      url: `${BASE_URL}/ads/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: campaign.title,
      description: campaign.description || campaign.title,
      images: thumbnailUrl ? [thumbnailUrl] : [],
    },
  };
}

