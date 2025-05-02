import { useState, useEffect } from 'react';
import { startOrder } from '../services/api';
import { useCart } from '../context/CartContext';

interface UseTableResult {
  tableId: number | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  setTable: (tableNumber: number) => Promise<void>;
}

export const useTable = (): UseTableResult => {
  const { state, dispatch } = useCart();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initializeTable = async (tableId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await startOrder(tableId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to start order');
      }

      dispatch({ type: 'SET_TABLE_ID', payload: tableId });
      setIsInitialized(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to initialize table');
    } finally {
      setIsLoading(false);
    }
  };

  const setTable = async (tableNumber: number) => {
    await initializeTable(tableNumber);
  };

  return {
    tableId: state.tableId,
    isInitialized,
    isLoading,
    error,
    setTable
  };
};