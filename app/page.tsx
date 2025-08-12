import Countdown from './components/Countdown';
import LeadForm from './components/LeadForm';

export default function Page() {
  return (
    <main>
      <div className="container">
        <section className="hero">
          <div className="badge">Show en vivo</div>
          <div className="logo">DINERONINO</div>
          <h1 style={{ margin: 0 }}>
            El show donde lo que gana el jugador… ¡puede ser tuyo!
          </h1>
          <p className="slogan">
            Apúntate para recibir el acceso y entrar al sorteo durante el vivo.
          </p>
          <a
            className="btn"
            href={process.env.NEXT_PUBLIC_KICK_URL}
            target="_blank"
            rel="noreferrer"
          >
            Ver canal en Kick
          </a>
          <div className="card">
            <b>Próximo episodio</b>
            <div style={{ marginTop: 8 }}>
              <Countdown />
            </div>
          </div>
        </section>

        <section>
          <LeadForm />
        </section>

        <footer className="footer">
          <p className="small">
            © {new Date().getFullYear()} DINERONINO —{' '}
            <a href="/terminos">Términos</a> •{' '}
            <a href="/privacidad">Privacidad</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
