export interface User{
    name: string
    email: string;
    password: string;
    confirmPassword: string;
    role?: Role;
}
export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
    MAIN_HR = 'MAIN_HR'
  }
  