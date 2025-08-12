'use client';
import { useEffect, useState } from 'react';

export default function Countdown() {
  const targetIso = process.env.NEXT_PUBLIC_SHOW_DATETIME_ISO || '';
  const [text, setText] = useState('');
  useEffect(() => {
    if (!targetIso) return;
    const target = new Date(targetIso).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setText('¡Es ahora! Entra al vivo');
        clearInterval(interval);
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setText(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetIso]);
  return <div className="countdown">{text}</div>;
}
