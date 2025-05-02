import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { getMenuItems } from '../services/api';

interface UseMenuResult {
  menuItems: MenuItem[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMenu = (): UseMenuResult => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    setIsLoading(true);
    setError(null);
    
    const response = await getMenuItems();
    
    if (response.success && response.data) {
      setMenuItems(response.data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(response.data.map(item => item.category))
      ).sort();
      setCategories(uniqueCategories);
    } else {
      setError(response.error || 'Failed to fetch menu items');
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return {
    menuItems,
    categories,
    isLoading,
    error,
    refetch: fetchMenuItems
  };
};