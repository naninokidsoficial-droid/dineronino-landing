// LeadForm.tsx
'use client';
import { useEffect, useState } from 'react';

export default function LeadForm() {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // Listen for the custom event to unlock the form
    const handleUnlock = () => setUnlocked(true);
    window.addEventListener('unlock-form', handleUnlock);
    if (unlocked) {
      // Render the Turnstile widget when unlocked
      // @ts-ignore
      if (window.turnstile) window.turnstile.render('#cf-turnstile', { sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY });
    }
    return () => {
      window.removeEventListener('unlock-form', handleUnlock);
    };
  }, [unlocked]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    setErr(null);
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries());
    // @ts-ignore
    const cf_token = document.querySelector('input[name=cf-turnstile-response]')?.value;
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, cf_token })
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Error');
      setOk('¡Listo! Revisa tu WhatsApp o email con la info del próximo show.');
      form.reset();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!unlocked) {
    return null;
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <b>Quiero participar</b>
      <div className="grid grid-2" style={{ marginTop: 12 }}>
        <input className="input" name="name" placeholder="Nombre" />
        <input className="input" name="country" placeholder="País" />
        <input className="input" name="email" placeholder="Email" required />
        <input className="input" name="phone" placeholder="WhatsApp (+52...)" />
      </div>
      <label className="small" style={{ display: 'block', marginTop: 10 }}>
        <input type="checkbox" name="consent_whatsapp" /> Acepto recibir recordatorios por WhatsApp/SMS.
      </label>
      <div id="cf-turnstile" style={{ marginTop: 12 }} data-theme="dark"></div>
      <button className="btn" style={{ marginTop: 12 }} disabled={loading}>{loading ? 'Enviando…' : 'Enviar'}</button>
      {ok && <div className="card success" style={{ marginTop: 12 }}>{ok}</div>}
      {err && <div className="card error" style={{ marginTop: 12 }}>{err}</div>}
    </form>
  );
}

export function GateButton({ onOpen }: { onOpen: () => void }) {
  return <button className="btn" onClick={onOpen}>Desbloquear formulario</button>;
}
