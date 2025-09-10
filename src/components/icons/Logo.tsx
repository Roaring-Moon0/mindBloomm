
import type { SVGProps } from 'react';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M12 2a5 5 0 0 0-5 5c0 1.38.56 2.63 1.46 3.54" />
        <path d="M12 22a5 5 0 0 0 5-5c0-1.38-.56-2.63-1.46-3.54" />
        <path d="M22 12a5 5 0 0 0-5-5c-1.38 0-2.63.56-3.54 1.46" />
        <path d="M2 12a5 5 0 0 0 5 5c1.38 0 2.63-.56 3.54-1.46" />
    </svg>
  );
}
