
import type { SVGProps } from 'react';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12" />
        <path d="M12 2C17.5228 2 22 6.47715 22 12C22 14.943 20.8403 17.5753 18.9977 19.5" />
        <path d="M2 12C2 9.05697 3.1597 6.42466 5.00228 4.5" />
        <path d="M12 22C14.0954 22 16.0264 21.4115 17.653 20.3533" />
        <path d="M4.34705 17.653C3.28854 16.0264 2.70001 14.0954 2.70001 12" />
    </svg>
  );
}
