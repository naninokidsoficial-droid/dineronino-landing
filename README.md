# DINERONINO Landing (Next.js)

Este repositorio contiene la landing oficial de **DINERONINO**, el game show en vivo donde lo que gana el jugador puede ser regalado al público del chat.

## Funcionalidad

* **Captación de leads**: Formulario para recolectar nombre, email, WhatsApp y país.
* **Verificación anti‑bot**: Utiliza [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) para evitar envíos automatizados.
* **Integraciones opcionales**: Inserta automáticamente cada lead en Supabase. También puede suscribirse a MailerLite y enviar un mensaje de bienvenida por WhatsApp Cloud API si configuras las claves.
* **Countdown al próximo episodio**: Visualiza cuándo será el siguiente programa en función de `NEXT_PUBLIC_SHOW_DATETIME_ISO`.
* **Dashboard simple**: Acceso privado para ver los leads (requiere token en `ADMIN_DASH_TOKEN`).

## Despliegue rápido en Vercel

1. Clona este repositorio o súbelo a Vercel.
2. Crea las variables de entorno según `.env.example`.
3. Crea una tabla `leads` en Supabase con esta estructura:

```sql
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  name text,
  email text not null,
  phone text,
  country text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  consent_whatsapp boolean default false,
  ip text,
  ua text
);
create index on public.leads (email);
```

4. Configura Cloudflare Turnstile y coloca las claves en el entorno.
5. Opcional: configura MailerLite y WhatsApp Cloud API para automatizar mensajes.

## Desarrollo local

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.
