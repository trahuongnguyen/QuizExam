import { Role } from './role.model';

export interface UserResponse {
    id: number;
    fullName: string;
    dob: Date;
    gender: number;
    address: string;
    phoneNumber: string;
    email: string;
    role: Role;
}

export interface UserRequest {
    fullName?: string;
    dob?: Date;
    gender?: number;
    address?: string;
    phoneNumber?: string;
    email?: string;
    roleId?: number;
}

export interface UserValidationError {
    fullName?: string;
    dob?: string;
    gender?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    roleId?: string;
    restore?: string;
}