import { create } from 'zustand';
import { 
  getAssignments, 
  createAssignment, 
  updateAssignment,
  deleteAssignment,
  getMyAssignments,
  completeTask
} from '../api';
import type { AssignmentResponse, AssignmentCreate, AssignmentUpdate, TaskCompletionCreate } from '../types';

interface AssignmentState {
  assignments: AssignmentResponse[];
  myAssignments: AssignmentResponse[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAssignments: () => Promise<void>;
  fetchMyAssignments: () => Promise<void>;
  addAssignment: (data: AssignmentCreate) => Promise<AssignmentResponse>;
  updateAssignmentById: (assignId: number, data: AssignmentUpdate) => Promise<AssignmentResponse>;
  removeAssignment: (assignId: number) => Promise<void>;
  completeAssignment: (data: TaskCompletionCreate) => Promise<void>;
  resetError: () => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignments: [],
  myAssignments: [],
  isLoading: false,
  error: null,

  fetchAssignments: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getAssignments();
      set({ assignments: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch assignments',
        isLoading: false 
      });
      throw error;
    }
  },

  fetchMyAssignments: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getMyAssignments();
      set({ myAssignments: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch my assignments',
        isLoading: false 
      });
      throw error;
    }
  },

  addAssignment: async (data: AssignmentCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newAssignment = await createAssignment(data);
      set(state => ({ 
        assignments: [...state.assignments, newAssignment],
        isLoading: false 
      }));
      return newAssignment;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create assignment',
        isLoading: false 
      });
      throw error;
    }
  },

  updateAssignmentById: async (assignId: number, data: AssignmentUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAssignment = await updateAssignment(assignId, data);
      set(state => ({ 
        assignments: state.assignments.map(assign => 
          assign.assign_id === assignId ? updatedAssignment : assign
        ),
        isLoading: false 
      }));
      return updatedAssignment;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update assignment',
        isLoading: false 
      });
      throw error;
    }
  },

  removeAssignment: async (assignId: number) => {
    set({ isLoading: true, error: null });
    try {
      await deleteAssignment(assignId);
      set(state => ({ 
        assignments: state.assignments.filter(assign => assign.assign_id !== assignId),
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete assignment',
        isLoading: false 
      });
      throw error;
    }
  },

  completeAssignment: async (data: TaskCompletionCreate) => {
    set({ isLoading: true, error: null });
    try {
      await completeTask(data);
      // Update the assignment in the state to mark as completed
      set(state => ({ 
        myAssignments: state.myAssignments.map(assign => 
          assign.assign_id === data.assign_id 
            ? { ...assign, is_completed: true, hours_worked: data.hours_worked, completion_notes: data.completion_notes || null } 
            : assign
        ),
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to complete task',
        isLoading: false 
      });
      throw error;
    }
  },

  resetError: () => {
    set({ error: null });
  },
}));
