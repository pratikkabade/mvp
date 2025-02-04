export interface comment {
    commented_by: string;
    comment: string;
    commented_at: string;
}

export interface Interaction {
    comments: comment[];
    likes: number;
    views: number;
}

export interface AllContent {
    content: string;
    created_at: string;
    created_by: string;
    interaction: Interaction;
    privacy: string;
    _id: string;
}