/**
 * Species Zustand Store
 * Global state management for species data
 * 
 * Responsibilities:
 * - Store species data in global state
 * - Manage loading and error states
 * - Provide actions to fetch/create/update/delete species
 * - Handle pagination state
 * 
 * Usage in components:
 * const species = useSpeciesStore(state => state.species);
 * const fetchSpecies = useSpeciesStore(state => state.fetchSpecies);
 */

import { create } from 'zustand';
import { speciesService } from '../services/speciesService.js';

export const useSpeciesStore = create((set) => ({
  // State
  species: [],
  currentSpecies: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  // Actions: Fetch Operations
  /**
   * Fetch all species with optional filters
   * @param {object} filters - { page, limit, search, sortBy, order }
   */
  fetchSpecies: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await speciesService.getAllSpecies(filters);
      set({
        species: response.data,
        pagination: response.pagination || {
          page: filters.page || 1,
          limit: filters.limit || 10,
          total: response.data.length,
          totalPages: 1,
        },
        loading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.message || 'Failed to fetch species',
        loading: false,
      });
      throw error;
    }
  },

  /**
   * Fetch single species by ID
   * @param {number} id - Species ID
   */
  fetchSpeciesById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await speciesService.getSpeciesById(id);
      set({
        currentSpecies: response.data,
        loading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.message || 'Failed to fetch species details',
        loading: false,
      });
      throw error;
    }
  },

  // Actions: Create, Update, Delete
  /**
   * Create new species
   * @param {object} data - { scientific_name, common_name, num_related_publications }
   */
  addSpecies: async (data) => {
    try {
      const response = await speciesService.createSpecies(data);
      // Add to existing list
      set((state) => ({
        species: [response.data, ...state.species],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      }));
      return response;
    } catch (error) {
      set({ error: error.message || 'Failed to create species' });
      throw error;
    }
  },

  /**
   * Update existing species
   * @param {number} id - Species ID
   * @param {object} data - Partial species data
   */
  updateSpecies: async (id, data) => {
    try {
      const response = await speciesService.updateSpecies(id, data);
      // Update in list
      set((state) => ({
        species: state.species.map((s) =>
          s.id === id ? response.data : s
        ),
        currentSpecies:
          state.currentSpecies?.id === id ? response.data : state.currentSpecies,
      }));
      return response;
    } catch (error) {
      set({ error: error.message || 'Failed to update species' });
      throw error;
    }
  },

  /**
   * Delete species
   * @param {number} id - Species ID
   */
  deleteSpecies: async (id) => {
    try {
      const response = await speciesService.deleteSpecies(id);
      // Remove from list
      set((state) => ({
        species: state.species.filter((s) => s.id !== id),
        currentSpecies: state.currentSpecies?.id === id ? null : state.currentSpecies,
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
      }));
      return response;
    } catch (error) {
      set({ error: error.message || 'Failed to delete species' });
      throw error;
    }
  },

  // Actions: State Management
  /**
   * Set current species (useful for detail views)
   */
  setCurrentSpecies: (species) => {
    set({ currentSpecies: species });
  },

  /**
   * Clear current species
   */
  clearCurrentSpecies: () => {
    set({ currentSpecies: null });
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Reset store to initial state
   */
  reset: () => {
    set({
      species: [],
      currentSpecies: null,
      loading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    });
  },
}));
