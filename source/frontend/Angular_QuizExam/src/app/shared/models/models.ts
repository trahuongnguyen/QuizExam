export interface LoginRequest {
    email?: string;
    password?: string;
}

export interface LoginResponse {
    token: string;
    message: string;
}

export interface ValidationError {
    [key: string]: string | undefined;
}




export interface Sem {
    id: number;
    name: string;
}

export interface Subject {
    id: number;
    sem: Sem;
    name: string;
    image?: File | null;
    status: number;
}

export interface Chapter {
    id: number;
    name: string;
    status: number;
    subject: Subject;
}

export interface Level {
    id: number;
    name: string;
    point: number;
    status: number;
}

export interface Question {
    id: number;
    content: string;
    image?: File | null;
    subject: Subject;
    chapters: Chapter[];
    level: Level;
    answers: Answer[];
}

export interface Answer {
    content: string;
    isCorrect: number;
}

export interface Examination {
    id: number;
    name: string;
    code: string;
    duration: number;
    startTime: Date;
    endTime: Date;
    subject: Subject;
    markResponses: [];
    studentResponses: [];
    questionRecordResponses: [];
}