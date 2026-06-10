import { Suspense } from 'react';
import DesktopApp from '@/components/desktop/DesktopApp';
import { getRestaurants } from '@/lib/restaurants';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { restaurants, live } = await getRestaurants();

  return (
    <Suspense>
      <DesktopApp restaurants={restaurants} live={live} />
    </Suspense>
  );
}
