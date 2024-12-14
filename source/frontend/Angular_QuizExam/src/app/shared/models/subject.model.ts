export interface Sem {
    id: number;
    name: string;
}

export interface SubjectResponse {
    id: number;
    name: string;
    image: string;
    status: number;
    sem: Sem;
}

export interface SubjectRequest {
    semId?: number;
    name?: string;
    image?: string;
    file?: File | null;
}