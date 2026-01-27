import client from './client';
import type { Assignment } from '../types/index';

export const getMyAssignments = async () => {
  const response = await client.get<Assignment[]>('/api/employee/my-assignments');
  return response.data;
};

export const completeTask = async (data: { assign_id: number, hours_worked: number, completion_notes: string }) => {
    // Spec says 201 response.
    const response = await client.post('/api/employee/task-completions', data);
    return response.data;
};
