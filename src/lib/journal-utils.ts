
export function getTreeStage(entryCount: number) {
    if (entryCount >= 30) {
        return { src: '/assets/trees/tree_stage_5.png', alt: 'A large, flourishing tree with abundant leaves.', stageName: 'Flourishing' };
    }
    if (entryCount >= 20) {
        return { src: '/assets/trees/tree_stage_4.png', alt: 'A healthy, full-grown tree.', stageName: 'Mature' };
    }
    if (entryCount >= 10) {
        return { src: '/assets/trees/tree_stage_3.png', alt: 'A young tree with several branches and leaves.', stageName: 'Growing' };
    }
    if (entryCount >= 1) {
        return { src: '/assets/trees/tree_stage_2.png', alt: 'A small sapling with a few leaves.', stageName: 'Sapling' };
    }
    return { src: '/assets/trees/tree_stage_1.png', alt: 'A tiny sprout just breaking through the soil.', stageName: 'Sprout' };
}

export function getTreeGrowthLevel(goodNoteCount: number): number {
    if (goodNoteCount >= 25) return 3; // Mature
    if (goodNoteCount >= 15) return 2; // Young
    if (goodNoteCount >= 5) return 1;  // Sapling
    return 0; // Seed
}
