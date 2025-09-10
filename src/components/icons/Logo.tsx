
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
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path>
        <path d="M12 2a10 10 0 0 0-3.54 19.14"></path>
        <path d="M12 2a10 10 0 0 1 3.54 19.14"></path>
    </svg>
  );
}
