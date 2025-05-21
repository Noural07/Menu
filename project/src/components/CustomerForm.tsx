import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTableList } from '../hooks/useTable';
import { startOrder } from '../services/api';

const CustomerForm: React.FC = () => {
  const { tables, loading, error } = useTableList();
  const { dispatch } = useCart();

  const [tableId, setTableId] = useState<number>();
  const [name, setName]       = useState('');
  const [err, setErr]         = useState<string|null>(null);
  const [busy, setBusy]       = useState(false);

  const handleStart = async () => {
    if (!tableId)          { setErr('Choose a table'); return; }
    if (!name.trim())      { setErr('Enter your name'); return; }

    setErr(null);
    setBusy(true);

    const res = await startOrder({
      tableId,
      customerName: name.trim(),
    });

    setBusy(false);

    if (!res.success || !res.data) {
      setErr(res.error || 'Failed to start order');
      return;
    }

    dispatch({ type: 'SET_ORDER_ID',     payload: res.data });
    dispatch({ type: 'SET_TABLE_ID',     payload: tableId });
    dispatch({ type: 'SET_CUSTOMER_NAME',payload: name.trim() });
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-6">Welcome to Bella Cucina</h2>

      {loading && <p>Loading tables…</p>}
      {error   && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4 w-full max-w-sm">
          <select
            className="border px-3 py-2 rounded w-full"
            value={tableId ?? ''}
            onChange={e => setTableId(Number(e.target.value))}
          >
            <option value="">– choose table –</option>
            {tables.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Your name"
            className="border px-3 py-2 rounded w-full"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          {err && <p className="text-red-500 text-sm">{err}</p>}

          <button
            type="button"
            disabled={busy}
            onClick={handleStart}
            className="w-full bg-[#8B0000] text-white py-2 rounded hover:bg-[#6B0000]"
          >
            {busy ? 'Starting…' : 'Start ordering'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerForm;
