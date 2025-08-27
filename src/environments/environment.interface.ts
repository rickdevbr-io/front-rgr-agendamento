export interface Environment {
  production: boolean;
  apiUrl: string;
  apiVersion: string;
  timeout: number;
  retryAttempts: number;
}
