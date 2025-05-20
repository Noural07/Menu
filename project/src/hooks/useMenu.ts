import { useState, useEffect } from 'react';
import { MenuItem, Category } from '../types';
import { getMenuItems } from '../services/api';

/** Return-objekt fra hook */
interface UseMenuResult {
  menuItems: MenuItem[];
  categories: Category[];    // objekt — ikke string længere
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMenu = (): UseMenuResult => {
  const [menuItems,  setMenuItems]  = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading,  setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  /** henter menu og bygger kategori-listen */
  const fetchMenu = async () => {
    setLoading(true);
    setError(null);

    const res = await getMenuItems();

    if (!res.success || !res.data) {
      setError(res.error || 'Failed to fetch menu');
      setLoading(false);
      return;
    }

    setMenuItems(res.data);

    /* 1) læg unikke {id,name} ind i et Map  */
    const map = new Map<number, string>();
    res.data.forEach(i => map.set(i.categoryId, i.categoryName));

    /* 2) konverter til sorteret array */
    const cats: Category[] = Array.from(map, ([id, name]) => ({ id, name }))
                                  .sort((a, b) => a.name.localeCompare(b.name));
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => { fetchMenu(); }, []);

  return { menuItems, categories, isLoading, error, refetch: fetchMenu };
};
