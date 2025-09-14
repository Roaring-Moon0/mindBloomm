import { formatDistanceToNow } from 'date-fns';

export interface Note {
    id: string;
    content: string;
    type: 'good' | 'bad';
    createdAt: any; // Firestore timestamp
}

export interface Journal {
    treeName: string;
    createdAt: any;
    lastWritten: any;
    treeHealth: number;
    missedDays: number;
    mood: 'happy' | 'sad' | 'neutral' | 'weak';
    emoji: string;
}

interface TreeStage {
    src: string;
    alt:string;
}

export const getTreeStage = (health: number): TreeStage => {
    if (health < 20) {
        return {
            src: '/assets/tree/tree-dying.png',
            alt: 'A weak, dying tree with very few leaves.'
        };
    }
    if (health < 40) {
        return {
            src: '/assets/tree/tree-sad.png',
            alt: 'A sad-looking tree with drooping leaves.'
        };
    }
    if (health < 70) {
        return {
            src: '/assets/tree/tree-small.png',
            alt: 'A small but healthy tree.'
        };
    }
    return {
        src: '/assets/tree/tree-large.png',
        alt: 'A large, flourishing, and happy tree.'
    };
};

export const getTreeAge = (createdAt: any): string => {
    if (!createdAt?.toDate) {
        return 'Just Planted';
    }
    return formatDistanceToNow(createdAt.toDate(), { addSuffix: true });
};
