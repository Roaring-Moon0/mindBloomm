'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the Spline component with SSR turned off
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full rounded-xl" />,
});

export default function HomeSpline() {
  return (
    <Spline
      scene="https://prod.spline.design/DW27VIa45VURIOPD/scene.splinecode"
    />
  );
}
