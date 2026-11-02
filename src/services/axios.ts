import axios from 'axios';
import { env } from '@/config/env.ts';

export const axiosInst = axios.create({
  baseURL: env.apiUrl
});