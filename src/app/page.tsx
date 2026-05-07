import { Suspense } from 'react';
import DesktopApp from '@/components/desktop/DesktopApp';
import { HU_RESTAURANTS } from '@/lib/data';

export default function Page() {
  return (
    <Suspense>
      <DesktopApp restaurants={HU_RESTAURANTS} />
    </Suspense>
  );
}
