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
      <path d="M12 2a10 10 0 0 0-10 10c0 5 4.5 9.4 8.7 10" />
      <path d="M12 2a10 10 0 0 1 10 10c0 2.2-1 4.2-2.5 5.6" />
      <path d="M12 22a10 10 0 0 1-10-10c0-2.2 1-4.2 2.5-5.6" />
      <path d="M12 22a10 10 0 0 0 10-10c0-5-4.5-9.4-8.7-10" />
      <path d="M2 12a10 10 0 0 1 10-10c5 0 9.4 4.5 10 8.7" />
      <path d="M22 12a10 10 0 0 0-10 10c-5 0-9.4-4.5-10-8.7" />
    </svg>
  );
}
