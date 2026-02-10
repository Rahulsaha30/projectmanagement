import client from './client';
import type { ProjectCreate, ProjectResponse, ProjectStatsResponse } from '../types/index';

export const getProjects = async (skip = 0, limit = 100) => {
  const response = await client.get<ProjectResponse[]>('/api/admin/projects', { params: { skip, limit } });
  return response.data;
};

export const createProject = async (data: ProjectCreate) => {
  const response = await client.post<ProjectResponse>('/api/admin/projects', data);
  return response.data;
};

export const getProjectStats = async () => {
  const response = await client.get<ProjectStatsResponse>('/api/admin/projects/stats');
  return response.data;
};
