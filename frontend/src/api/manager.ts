import client from './client';
import type { User, EmployeeCreateByManager } from '../types/index';

export const getEmployees = async () => {
  const response = await client.get<User[]>('/api/manager/employees');
  return response.data;
};

export const addEmployee = async (data: EmployeeCreateByManager) => {
  const response = await client.post('/api/manager/employees', data);
  return response.data;
};

export const searchEmployees = async (skills: string) => {
    const response = await client.get<User[]>('/api/manager/employees/search/by-skills', { params: { skills } });
    return response.data;
};

export const createAssignment = async (data: { emp_id: number, project_id: number, allotted_hours: number }) => {
    const response = await client.post('/api/assignments', data);
    return response.data;
};
