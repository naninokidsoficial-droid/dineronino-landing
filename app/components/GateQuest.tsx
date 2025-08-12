// GateQuest.tsx
'use client';
import { useState } from 'react';

type Props = { onUnlock: () => void };

export default function GateQuest({ onUnlock }: Props) {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');

  const ok = (q1.trim().toLowerCase() === 'dinero' && q2.trim() === '7' && q3.trim().toLowerCase().includes('kick'));

  return (
    <div className="card">
      <b>Desbloqueo rápido (Caja fuerte)</b>
      <p className="small">Responde para habilitar el formulario:</p>
      <div className="grid">
        <input className="input" placeholder="Contraseña mágica del show (pista: $)" value={q1} onChange={e => setQ1(e.target.value)} />
        <input className="input" placeholder="¿Cuántos niveles máximos hay?" value={q2} onChange={e => setQ2(e.target.value)} />
        <input className="input" placeholder="¿En qué plataforma se transmite?" value={q3} onChange={e => setQ3(e.target.value)} />
      </div>
      <div style={{ marginTop: 12 }}>
        <button className="btn" disabled={!ok} onClick={onUnlock}>{ok ? 'Desbloquear formulario' : 'Completa las respuestas'}</button>
      </div>
    </div>
  );
}
