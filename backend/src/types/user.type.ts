// Define the interface for the User document
export interface UserType {
    email: string;
    password?: string; // Optional because we might exclude it in responses
    username: string;
    firstName?: string;
    lastName?: string;
    role: 'user' | 'admin';
}