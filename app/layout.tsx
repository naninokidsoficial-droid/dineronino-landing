import '../styles/globals.css';

export const metadata = {
  title: 'DINERONINO – Gana en vivo',
  description: 'El show donde lo que gana el jugador… ¡puede ser tuyo!'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Cargar Turnstile */}
        <script
          defer
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
