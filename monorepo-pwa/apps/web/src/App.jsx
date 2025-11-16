import React, { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function queueKey() { return 'pending-increments'; }
function getQueue() {
  try { return JSON.parse(localStorage.getItem(queueKey()) || '[]'); } catch { return []; }
}
function pushQueue(delta) {
  const q = getQueue();
  q.push({ delta, t: Date.now() });
  localStorage.setItem(queueKey(), JSON.stringify(q));
}
function clearQueue() { localStorage.removeItem(queueKey()); }

export default function App() {
  const [count, setCount] = useState(0);
  const [online, setOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchCount();
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  async function fetchCount() {
    try {
      const r = await fetch(`${API}/api/count`);
      const j = await r.json();
      if (j.ok) setCount(j.count);
    } catch {}
  }

  async function increment() {
    if (!navigator.onLine) {
      pushQueue(1);
      setCount(prev => prev + 1);
      return;
    }
    const res = await fetch(`${API}/api/increment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ delta: 1 })});
    const j = await res.json();
    if (j.ok) setCount(j.count);
    await syncQueue();
  }

  async function syncQueue() {
    const q = getQueue();
    if (!q.length) return;
    setSyncing(true);
    try {
      const total = q.reduce((s, e) => s + (e.delta || 0), 0);
      const res = await fetch(`${API}/api/increment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ delta: total })});
      const j = await res.json();
      if (j.ok) {
        setCount(j.count);
        clearQueue();
      }
    } catch (err) {
    } finally {
      setSyncing(false);
    }
  }

  async function handleReset() {
    try {
      await fetch(`${API}/api/reset`, { method: 'POST' });
      setCount(0);
      clearQueue();
    } catch {
      clearQueue();
      setCount(0);
    }
  }

  function handleOnline() { setOnline(true); syncQueue(); }
  function handleOffline() { setOnline(false); }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 520, margin: '0 auto' }}>
      <h1>Contador de Cliques</h1>
      <p>Contador global (todos os usuários veem o mesmo valor).</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 48, fontWeight: 700 }}>{count}</div>
        <div>
          <button onClick={increment} style={{ padding: '8px 16px', fontSize: 16 }}>+1</button>
          <button onClick={handleReset} style={{ padding: '8px 12px', marginLeft: 8 }}>Reset</button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Conexão:</strong> {online ? 'online' : 'offline'} {syncing ? ' — sincronizando...' : ''}
      </div>

      <div style={{ marginTop: 18, fontSize: 13, color: '#555' }}>
        <p>Dicas:</p>
        <ul>
          <li>Se ficar offline, cliques são salvos localmente e sincronizados ao voltar online.</li>
          <li>O PWA é instalável (manifest + service worker).</li>
        </ul>
      </div>
    </div>
  );
}
