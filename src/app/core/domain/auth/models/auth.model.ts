export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  user?: User;
}

export enum InputPasswordField {
    SHOW = 'text',
    HIDE = 'password'
}
