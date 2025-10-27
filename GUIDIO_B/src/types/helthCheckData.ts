export interface HealthCheckData {
  service: string;
  status: string;
  database: string;
  timestamp: string;
  error?: string;
}