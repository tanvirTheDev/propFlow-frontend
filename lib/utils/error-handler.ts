import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
  errors?: string[];
  statusCode?: number;
}

export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.errors?.length) return data.errors[0];
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}
