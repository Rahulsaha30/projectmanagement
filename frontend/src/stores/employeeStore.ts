import { create } from 'zustand';
import { 
  getEmployees, 
  addEmployee, 
  updateEmployee, 
  searchEmployeesBySkills 
} from '../api';
import type { EmployeeResponse, EmployeeCreateByManager, EmployeeUpdate } from '../types';

interface EmployeeState {
  employees: EmployeeResponse[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchEmployees: () => Promise<void>;
  createEmployee: (data: EmployeeCreateByManager) => Promise<EmployeeResponse>;
  updateEmployeeById: (empId: number, data: EmployeeUpdate) => Promise<EmployeeResponse>;
  searchBySkills: (params: { skills: string; min_experience?: number; include_assigned?: boolean }) => Promise<void>;
  resetError: () => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  isLoading: false,
  error: null,

  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getEmployees();
      set({ employees: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch employees',
        isLoading: false 
      });
      throw error;
    }
  },

  createEmployee: async (data: EmployeeCreateByManager) => {
    set({ isLoading: true, error: null });
    try {
      const newEmployee = await addEmployee(data);
      set(state => ({ 
        employees: [...state.employees, newEmployee],
        isLoading: false 
      }));
      return newEmployee;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create employee',
        isLoading: false 
      });
      throw error;
    }
  },

  updateEmployeeById: async (empId: number, data: EmployeeUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const updatedEmployee = await updateEmployee(empId, data);
      set(state => ({ 
        employees: state.employees.map(emp => 
          emp.emp_id === empId ? updatedEmployee : emp
        ),
        isLoading: false 
      }));
      return updatedEmployee;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update employee',
        isLoading: false 
      });
      throw error;
    }
  },

  searchBySkills: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await searchEmployeesBySkills(params);
      set({ employees: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search employees',
        isLoading: false 
      });
      throw error;
    }
  },

  resetError: () => {
    set({ error: null });
  },
}));
