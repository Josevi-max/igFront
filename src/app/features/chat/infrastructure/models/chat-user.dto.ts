export interface ApiResponseDto<T> {
  success: boolean;
  data: T;
}

export interface UserApiDto {
  id: number;
  name: string;
  username: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}