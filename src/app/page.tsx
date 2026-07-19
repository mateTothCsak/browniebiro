import { Suspense } from 'react';
import AppShell from '@/components/app/AppShell';
import { getRestaurants } from '@/lib/restaurants';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { restaurants, live } = await getRestaurants();

  return (
    <Suspense>
      <AppShell restaurants={restaurants} live={live} />
    </Suspense>
  );
}
