
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
    stageName: string;
}

export const getTreeStage = (health: number): TreeStage => {
    if (health < 20) {
        return {
            stageName: 'Withering'
        };
    }
    if (health < 40) {
        return {
            stageName: 'Struggling'
        };
    }
    if (health < 70) {
        return {
            stageName: 'Growing'
        };
    }
    return {
        stageName: 'Flourishing'
    };
};

export const getTreeAge = (createdAt: any): string => {
    if (!createdAt?.toDate) {
        return 'Just Planted';
    }
    return formatDistanceToNow(createdAt.toDate(), { addSuffix: true });
};
