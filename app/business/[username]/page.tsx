// Redirect to user profile route
import { redirect } from 'next/navigation';

export default async function BusinessPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  redirect(`/u/${username}`);
}

