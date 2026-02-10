import client from './client';
import type { 
  EmployeeCreateByManager, 
  EmployeeResponse, 
  EmployeeUpdate,
  AssignmentCreate,
  AssignmentResponse,
  AssignmentUpdate,
  ProjectCreate,
  ProjectResponse,
  ProjectUpdate,
  ProjectStatsResponse,
  RemoveEmployeeRequest,
  RemoveEmployeeResponse,
  TaskCompletionCreate,
  TaskCompletionResponse
} from '../types/index';

// Manager API
export const getEmployees = async () => {
  const response = await client.get<EmployeeResponse[]>('/api/manager/employees');
  return response.data;
};

export const addEmployee = async (data: EmployeeCreateByManager) => {
  const response = await client.post<EmployeeResponse>('/api/manager/employees', data);
  return response.data;
};

export const getEmployeeById = async (empId: number) => {
  const response = await client.get<EmployeeResponse>(`/api/manager/employees/${empId}`);
  return response.data;
};

export const updateEmployee = async (empId: number, data: EmployeeUpdate) => {
  const response = await client.put<EmployeeResponse>(`/api/manager/employees/${empId}`, data);
  return response.data;
};

export const searchEmployeesBySkills = async (params: {
  skills: string;
  min_experience?: number;
  include_assigned?: boolean;
}) => {
  const response = await client.get<EmployeeResponse[]>('/api/manager/employees/search/by-skills', { params });
  return response.data;
};

export const createAssignment = async (data: AssignmentCreate) => {
  const response = await client.post<AssignmentResponse>('/api/assignments', data);
  return response.data;
};

// Admin API
export const getProjects = async (params: { skip?: number; limit?: number } = {}) => {
  const response = await client.get<ProjectResponse[]>('/api/admin/projects', { params });
  return response.data;
};

export const createProject = async (data: ProjectCreate) => {
  const response = await client.post<ProjectResponse>('/api/admin/projects', data);
  return response.data;
};

export const getProjectById = async (projectId: number) => {
  const response = await client.get<ProjectResponse>(`/api/admin/projects/${projectId}`);
  return response.data;
};

export const updateProject = async (projectId: number, data: ProjectUpdate) => {
  const response = await client.put<ProjectResponse>(`/api/admin/projects/${projectId}`, data);
  return response.data;
};

export const getProjectStats = async () => {
  const response = await client.get<ProjectStatsResponse>('/api/admin/projects/stats');
  return response.data;
};

// Assignments API
export const getAssignments = async (params: { emp_id?: number; project_id?: number } = {}) => {
  const response = await client.get<AssignmentResponse[]>('/api/assignments', { params });
  return response.data;
};

export const updateAssignment = async (assignId: number, data: AssignmentUpdate) => {
  const response = await client.put<AssignmentResponse>(`/api/assignments/${assignId}`, data);
  return response.data;
};

export const deleteAssignment = async (assignId: number) => {
  const response = await client.delete(`/api/assignments/${assignId}`);
  return response.data;
};

export const removeEmployeeFromProject = async (data: RemoveEmployeeRequest) => {
  const response = await client.post<RemoveEmployeeResponse>('/api/assignments/remove-employee', data);
  return response.data;
};

// Employee API
export const getMyAssignments = async () => {
  const response = await client.get<AssignmentResponse[]>('/api/employee/my-assignments');
  return response.data;
};

export const getAssignmentDetails = async (assignId: number) => {
  const response = await client.get<AssignmentResponse>(`/api/employee/my-assignments/${assignId}`);
  return response.data;
};

export const completeTask = async (data: TaskCompletionCreate) => {
  const response = await client.post<TaskCompletionResponse>('/api/employee/task-completions', data);
  return response.data;
};

export const getMyTaskCompletions = async () => {
  const response = await client.get<TaskCompletionResponse[]>('/api/employee/my-task-completions');
  return response.data;
};