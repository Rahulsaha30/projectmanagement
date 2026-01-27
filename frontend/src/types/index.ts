export interface User {
  emp_id: number;
  emp_name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  billable_work_hours?: number;
  skills?: string;
  experience?: number;
  dept?: string;
  is_active?: boolean;
}

export interface ProjectCreate {
  name: string;
  client: string;
  expected_hours?: number | null;
  status?: boolean | null;
  end_date?: string | null;
}

export interface ProjectResponse {
  project_id: number;
  name: string;
  client: string;
  expected_hours: number | null;
  status: boolean;
  start_date: string;
  end_date: string | null;
}

export interface ProjectUpdate {
  name?: string | null;
  client?: string | null;
  expected_hours?: number | null;
  status?: boolean | null;
  end_date?: string | null;
}

export interface AssignmentCreate {
  emp_id: number;
  project_id: number;
  allotted_hours: number;
}

export interface AssignmentResponse {
  assign_id: number;
  emp_id: number;
  project_id: number;
  assigned_at: string;
  allotted_hours: number;
  emp_name: string;
  project_name: string;
  is_completed: boolean;
  completed_at: string | null;
  hours_worked: number;
  completion_notes: string | null;
}

export interface AssignmentUpdate {
  allotted_hours?: number | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface ProjectStatsResponse {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_expected_hours: number;
}

export interface SignupRequest {
  emp_name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'employee';
  pin: string;
}

export interface ForgotPasswordRequest {
  email: string;
  pin: string;
  new_password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  grant_type?: string | null;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
}

export interface EmployeeCreateByManager {
  emp_name: string;
  email: string;
  password: string;
  billable_work_hours?: number | null;
  skills?: string | null;
  experience?: number | null;
  dept?: string | null;
}

export interface EmployeeResponse {
  emp_id: number;
  emp_name: string;
  email: string;
  role: string;
  billable_work_hours: number;
  skills: string | null;
  experience: number | null;
  dept: string | null;
  is_active: boolean;
  added_by: number | null;
}

export interface EmployeeUpdate {
  emp_name?: string | null;
  email?: string | null;
  role?: 'admin' | 'manager' | 'employee' | null;
  billable_work_hours?: number | null;
  skills?: string | null;
  experience?: number | null;
  dept?: string | null;
}

export interface RemoveEmployeeRequest {
  emp_id: number;
  project_id: number;
}

export interface RemoveEmployeeResponse {
  message: string;
  emp_id: number;
  project_id: number;
  emp_name: string;
  project_name: string;
  hours_returned: number;
  new_billable_hours: number;
}

export interface TaskCompletionCreate {
  assign_id: number;
  hours_worked: number;
  completion_notes?: string | null;
}

export interface TaskCompletionResponse {
  assign_id: number;
  emp_id: number;
  project_id: number;
  emp_name: string;
  project_name: string;
  assigned_at: string;
  completed_at: string;
  allotted_hours: number;
  hours_worked: number;
  completion_notes: string | null;
}

// Aliases for backward compatibility
export type Project = ProjectResponse;
export type Assignment = AssignmentResponse;
export type ProjectStats = ProjectStatsResponse;
