import axios, { AxiosError } from 'axios';

const BASE_URL = process.env.COMPOSER_REST_URL || 'http://localhost:3000/api';

const client = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } });

// Formats Composer resource string: "resource:org.acme.Manufacturer#m1"
export const toRef = (type: string, id: string): string =>
  `resource:org.acme.${type}#${id}`;

export async function getAll<T>(resource: string): Promise<T[]> {
  const res = await client.get<T[]>(`/${resource}`);
  return res.data;
}

export async function getById<T>(resource: string, id: string): Promise<T> {
  const res = await client.get<T>(`/${resource}/${id}`);
  return res.data;
}

export async function create<T>(resource: string, body: object): Promise<T> {
  const res = await client.post<T>(`/${resource}`, body);
  return res.data;
}

export async function update<T>(resource: string, id: string, body: object): Promise<T> {
  const res = await client.put<T>(`/${resource}/${id}`, body);
  return res.data;
}

export async function remove(resource: string, id: string): Promise<void> {
  await client.delete(`/${resource}/${id}`);
}

export async function submitTransaction<T>(txName: string, payload: object): Promise<T> {
  const body = { $class: `org.acme.${txName}`, ...payload };
  const res = await client.post<T>(`/${txName}`, body);
  return res.data;
}

export async function query<T>(queryName: string, params?: Record<string, string>): Promise<T[]> {
  const res = await client.get<T[]>(`/queries/${queryName}`, { params });
  return res.data;
}

export async function ping(): Promise<object> {
  const res = await client.get('/system/ping');
  return res.data;
}

export function extractError(err: unknown): string {
  if (err instanceof AxiosError) {
    return err.response?.data?.error?.message || err.message;
  }
  return String(err);
}
