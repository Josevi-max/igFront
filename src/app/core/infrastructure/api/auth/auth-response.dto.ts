export interface LoginResponseDto {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserApi;
}

export interface UserApi {
  id: number;
  name: string;
  username: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}