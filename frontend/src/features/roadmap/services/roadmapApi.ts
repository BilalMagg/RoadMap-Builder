import { api } from '../../../services/http/axios';
import type { Roadmap, RoadmapData } from '../types/roadmap.types';
import { RoadmapCategory } from '../types/roadmap.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error?: any;
  timestamp: Date;
}

interface CreateRoadmapDto {
  title: string;
  description?: string;
  category: RoadmapCategory;
  data?: RoadmapData;
}

interface UpdateRoadmapDto {
  title?: string;
  description?: string;
  data?: RoadmapData;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

interface RoadmapListItem {
  id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  nodeCount: number;
  edgeCount: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export class RoadmapApi {
  // Get all roadmaps for the current user
  static async getAllRoadmaps(): Promise<RoadmapListItem[]> {
    try {
      const response = await api.get<ApiResponse<RoadmapListItem[]>>('/roadmaps');
      if (response.data.success && response.data.data) {
        return response.data.data.map(item => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
      }
      throw new Error(response.data.message || 'Failed to fetch roadmaps');
    } catch (error: any) {
      console.error('Error fetching roadmaps:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch roadmaps');
    }
  }

  // Get available categories
  static async getCategories(): Promise<{ key: string; value: string }[]> {
    try {
        const response = await api.get<ApiResponse<{ key: string; value: string }[]>>('/roadmaps/categories');
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch categories');
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        // Fallback to enum values if API fails or endpoint not ready
        return Object.entries(RoadmapCategory).map(([key, value]) => ({
            key,
            value
        }));
    }
  }

  // Get a specific roadmap by ID
  static async getRoadmapById(id: string): Promise<Roadmap> {
    try {
      const response = await api.get<ApiResponse<Roadmap>>(`/roadmaps/${id}`);
      if (response.data.success && response.data.data) {
        return {
          ...response.data.data,
          createdAt: new Date(response.data.data.createdAt),
          updatedAt: new Date(response.data.data.updatedAt),
        };
      }
      throw new Error(response.data.message || 'Roadmap not found');
    } catch (error: any) {
      console.error('Error fetching roadmap:', error);
      if (error.response?.status === 404) {
        throw new Error('Roadmap not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch roadmap');
    }
  }

  // Create a new roadmap
  static async createRoadmap(
    title: string,
    description: string | undefined, // Changed to allow undefined specifically
    category: RoadmapCategory,
    data?: RoadmapData
  ): Promise<Roadmap> {
    try {
      const payload: CreateRoadmapDto = {
        title,
        description,
        category,
        data: data || {
          version: '1.0',
          viewport: { x: 0, y: 0, zoom: 1 },
          nodes: [],
          edges: [],
        },
      };

      const response = await api.post<ApiResponse<Roadmap>>('/roadmaps', payload);
      if (response.data.success && response.data.data) {
        return {
          ...response.data.data,
          createdAt: new Date(response.data.data.createdAt),
          updatedAt: new Date(response.data.data.updatedAt),
        };
      }
      throw new Error(response.data.message || 'Failed to create roadmap');
    } catch (error: any) {
      console.error('Error creating roadmap:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create roadmap';
      if (error.response?.data?.error) {
        const errors = Array.isArray(error.response.data.error)
          ? error.response.data.error.join(', ')
          : error.response.data.error;
        throw new Error(errors);
      }
      throw new Error(errorMessage);
    }
  }

  // Update a roadmap
  static async updateRoadmap(
    id: string,
    updates: UpdateRoadmapDto
  ): Promise<Roadmap> {
    try {
      const response = await api.put<ApiResponse<Roadmap>>(`/roadmaps/${id}`, updates);
      if (response.data.success && response.data.data) {
        return {
          ...response.data.data,
          createdAt: new Date(response.data.data.createdAt),
          updatedAt: new Date(response.data.data.updatedAt),
        };
      }
      throw new Error(response.data.message || 'Failed to update roadmap');
    } catch (error: any) {
      console.error('Error updating roadmap:', error);
      if (error.response?.status === 404) {
        throw new Error('Roadmap not found');
      }
      const errorMessage = error.response?.data?.message || 'Failed to update roadmap';
      if (error.response?.data?.error) {
        const errors = Array.isArray(error.response.data.error)
          ? error.response.data.error.join(', ')
          : error.response.data.error;
        throw new Error(errors);
      }
      throw new Error(errorMessage);
    }
  }

  // Delete a roadmap
  static async deleteRoadmap(id: string): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/roadmaps/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete roadmap');
      }
    } catch (error: any) {
      console.error('Error deleting roadmap:', error);
      if (error.response?.status === 404) {
        throw new Error('Roadmap not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete roadmap');
    }
  }
}

