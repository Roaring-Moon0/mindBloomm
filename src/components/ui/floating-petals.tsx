
'use client';

import { useEffect, useState } from 'react';

// This component is client-side only to avoid hydration errors with random values
export function FloatingPetals() {
    const [petals, setPetals] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const createPetals = () => {
            const newPetals = Array.from({ length: 15 }).map((_, i) => {
                const style = {
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${Math.random() * 5 + 10}s`, // 10s to 15s
                    animationDelay: `${Math.random() * 10}s`, // 0s to 10s delay
                    width: `${Math.random() * 15 + 10}px`, // 10px to 25px
                    height: `${Math.random() * 15 + 10}px`,
                };
                return <div key={i} className="petal" style={style} />;
            });
            setPetals(newPetals);
        };
        
        createPetals();

        // Optional: Re-generate petals on window resize to keep it looking good
        window.addEventListener('resize', createPetals);
        return () => window.removeEventListener('resize', createPetals);
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            {petals}
        </div>
    );
}
