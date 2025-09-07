export interface User {
    name: string;
    email: string;
    password: string;
    subscription: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}