import { getCampaign, trackReferralClick } from '@/lib/api-client';
import { notFound } from 'next/navigation';
import CampaignPage from '@/components/CampaignPage';

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ ref?: string }>
}) {
  const { id } = await params;
  const { ref } = await searchParams;

  const campaign = await getCampaign(id);

  if (!campaign) {
    notFound();
  }

  // Track referral click if ref code is present
  if (ref) {
    trackReferralClick(ref).catch(err => {
      console.error('[CampaignPage] Failed to track referral click:', err);
    });
  }

  return (
    <CampaignPage
      id={campaign.id}
      title={campaign.title}
      description={campaign.description}
      thumbnail={campaign.thumbnail}
      content={campaign.content}
      option={campaign.option}
      refCode={ref}
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
  const faviconUrl = `${BASE_URL}/favicon.ico`;
  const imageUrl = thumbnailUrl || faviconUrl;

  return {
    title: campaign.title,
    description: campaign.description || campaign.title,
    openGraph: {
      type: 'website',
      title: campaign.title,
      description: campaign.description || campaign.title,
      url: `${BASE_URL}/campaign/${id}`,
      siteName: 'RUS - Rent Ur Status',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: campaign.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: campaign.title,
      description: campaign.description || campaign.title,
      images: [imageUrl],
    },
  };
}

