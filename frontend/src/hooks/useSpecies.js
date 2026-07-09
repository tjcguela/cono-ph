/**
 * useSpecies Hook
 * Custom hook for managing species data
 * 
 * Combines Zustand store with React hooks for convenient data fetching
 * Automatically fetches data when filters change
 * 
 * Usage:
 * const { species, loading, error, pagination } = useSpecies({ page: 1, limit: 10 });
 * 
 * Or access store directly:
 * const species = useSpeciesStore(state => state.species);
 * const fetchSpecies = useSpeciesStore(state => state.fetchSpecies);
 */

import { useEffect } from 'react';
import { useSpeciesStore } from '../store/speciesStore.js';

/**
 * Hook for fetching and managing species list
 * Automatically triggers fetch when filters change
 * 
 * @param {object} filters - { page, limit, search, sortBy, order }
 * @param {number} [filters.page=1] - Current page
 * @param {number} [filters.limit=10] - Items per page
 * @param {string} [filters.search=''] - Search term
 * @param {string} [filters.sortBy='created_at'] - Sort field
 * @param {string} [filters.order='DESC'] - Sort order
 * 
 * @returns {object} - { species, loading, error, pagination, refetch }
 * 
 * @example
 * function SpeciesListPage() {
 *   const [page, setPage] = useState(1);
 *   const { species, loading, error, pagination } = useSpecies({ page, limit: 10 });
 *
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *
 *   return (
 *     <div>
 *       <SpeciesList data={species} />
 *       <Pagination {...pagination} onPageChange={setPage} />
 *     </div>
 *   );
 * }
 */
export const useSpecies = (filters = {}) => {
  const { species, loading, error, pagination, fetchSpecies } = useSpeciesStore();

  /**
   * Refetch handler - allows manual refresh
   */
  const refetch = async () => {
    try {
      await fetchSpecies(filters);
    } catch (err) {
      console.error('Failed to refetch species:', err);
    }
  };

  /**
   * Auto-fetch when filters change
   */
  useEffect(() => {
    refetch();
  }, [filters.page, filters.limit, filters.search, filters.sortBy, filters.order]);

  return {
    species,
    loading,
    error,
    pagination,
    refetch,
  };
};

/**
 * Hook for fetching single species
 * @param {number} id - Species ID
 * @returns {object} - { species, loading, error, refetch }
 * 
 * @example
 * function SpeciesDetailPage({ speciesId }) {
 *   const { species, loading, error } = useSpeciesDetail(speciesId);
 *
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *
 *   return <SpeciesDetail data={species} />;
 * }
 */
export const useSpeciesDetail = (id) => {
  const { currentSpecies, loading, error, fetchSpeciesById } = useSpeciesStore();

  const refetch = async () => {
    if (id) {
      try {
        await fetchSpeciesById(id);
      } catch (err) {
        console.error('Failed to refetch species:', err);
      }
    }
  };

  useEffect(() => {
    refetch();
  }, [id]);

  return {
    species: currentSpecies,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook for species mutations (create, update, delete)
 * @returns {object} - { addSpecies, updateSpecies, deleteSpecies, loading, error }
 * 
 * @example
 * function SpeciesForm() {
 *   const { addSpecies, loading, error } = useSpeciesMutations();
 *
 *   const handleSubmit = async (data) => {
 *     try {
 *       await addSpecies(data);
 *       toast.success('Species created!');
 *     } catch (err) {
 *       toast.error(err.message);
 *     }
 *   };
 *
 *   return <Form onSubmit={handleSubmit} loading={loading} />;
 * }
 */
export const useSpeciesMutations = () => {
  const { addSpecies, updateSpecies, deleteSpecies, loading, error } = useSpeciesStore();

  return {
    addSpecies,
    updateSpecies,
    deleteSpecies,
    loading,
    error,
  };
};
