
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const Spline = dynamic(() => import('@splinetool/react-spline/next'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />,
});

export function HomeSpline() {
    return (
        <Spline scene="https://prod.spline.design/twsk8lf1VsNkjC80/scene.splinecode" />
    )
}
