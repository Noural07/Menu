import { useEffect, useState } from 'react';
import { getTables } from '../services/api';
import { Table } from '../types';

export const useTableList = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTables()
      .then(r => {
        if (r.success && r.data) setTables(r.data);
        else throw new Error(r.error);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { tables, loading, error };
};
