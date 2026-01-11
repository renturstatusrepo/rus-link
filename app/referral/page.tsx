import { notFound } from 'next/navigation';
import ReferralPage from '@/components/ReferralPage';

export default async function Page({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  const code = ref || '';

  return <ReferralPage code={code} />;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  const code = ref || '';
  
  return {
    title: 'Join RUS - Referral Program',
    description: code ? `Join RUS with referral code: ${code}` : 'Join RUS and earn rewards together!',
    openGraph: {
      title: 'Join RUS with my referral code!',
      description: 'Earn rewards together on RUS!',
      type: 'website',
    },
  };
}
