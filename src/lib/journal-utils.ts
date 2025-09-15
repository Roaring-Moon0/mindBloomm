
export const getTreeStage = (entryCount: number) => {
    if (entryCount >= 30) return { src: '/assets/tree-5.png', alt: 'A large, flourishing tree', stageName: 'Flourishing' };
    if (entryCount >= 20) return { src: '/assets/tree-4.png', alt: 'A healthy, mature tree', stageName: 'Mature' };
    if (entryCount >= 10) return { src: '/assets/tree-3.png', alt: 'A growing, young tree', stageName: 'Young' };
    if (entryCount >= 1) return { src: '/assets/tree-2.png', alt: 'A small sapling', stageName: 'Sapling' };
    return { src: '/assets/tree-1.png', alt: 'A tiny sprout', stageName: 'Sprout' };
};
