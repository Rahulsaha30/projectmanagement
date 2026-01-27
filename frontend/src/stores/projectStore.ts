import { create } from 'zustand';
import { 
  getProjects, 
  createProject, 
  updateProject,
  getProjectStats
} from '../api';
import type { ProjectResponse, ProjectCreate, ProjectUpdate, ProjectStatsResponse } from '../types';

interface ProjectState {
  projects: ProjectResponse[];
  stats: ProjectStatsResponse | null;
  isLoading: boolean;
  isLoadingStats: boolean;
  error: string | null;
  
  // Actions
  fetchProjects: () => Promise<void>;
  fetchStats: () => Promise<void>;
  addProject: (data: ProjectCreate) => Promise<ProjectResponse>;
  updateProjectById: (projectId: number, data: ProjectUpdate) => Promise<ProjectResponse>;
  resetError: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  stats: null,
  isLoading: false,
  isLoadingStats: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getProjects();
      set({ projects: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
        isLoading: false 
      });
      throw error;
    }
  },

  fetchStats: async () => {
    set({ isLoadingStats: true, error: null });
    try {
      const data = await getProjectStats();
      set({ stats: data, isLoadingStats: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch stats',
        isLoadingStats: false 
      });
      throw error;
    }
  },

  addProject: async (data: ProjectCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newProject = await createProject(data);
      set(state => ({ 
        projects: [...state.projects, newProject],
        isLoading: false 
      }));
      return newProject;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create project',
        isLoading: false 
      });
      throw error;
    }
  },

  updateProjectById: async (projectId: number, data: ProjectUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProject = await updateProject(projectId, data);
      set(state => ({ 
        projects: state.projects.map(proj => 
          proj.project_id === projectId ? updatedProject : proj
        ),
        isLoading: false 
      }));
      return updatedProject;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update project',
        isLoading: false 
      });
      throw error;
    }
  },

  resetError: () => {
    set({ error: null });
  },
}));
