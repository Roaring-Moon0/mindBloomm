

interface TreeStage {
    src: string;
    alt: string;
    stageName: string;
}

export const getTreeStage = (entryCount: number): TreeStage => {
    if (entryCount === 0) {
        return {
            src: '/assets/tree/seed.png',
            alt: 'A single seed on the ground.',
            stageName: 'Seed'
        };
    }
    if (entryCount >= 1 && entryCount <= 3) {
        return {
            src: '/assets/tree/sprout.png',
            alt: 'A small green sprout emerging from the ground.',
            stageName: 'Sprout'
        };
    }
    if (entryCount > 3 && entryCount <= 7) {
        return {
            src: '/assets/tree/sapling.png',
            alt: 'A young sapling with a few leaves.',
            stageName: 'Sapling'
        };
    }
    if (entryCount > 7 && entryCount <= 15) {
        return {
            src: '/assets/tree/tree-small.png',
            alt: 'A small tree with a developing canopy.',
            stageName: 'Young Tree'
        };
    }
    if (entryCount > 15) {
        return {
            src: '/assets/tree/tree-large.png',
            alt: 'A large, flourishing tree with a full canopy.',
            stageName: 'Flourishing Tree'
        };
    }
    // Default case, should not be reached if entryCount is >= 0
    return {
        src: '/assets/tree/seed.png',
        alt: 'A single seed on the ground.',
        stageName: 'Seed'
    };
};
