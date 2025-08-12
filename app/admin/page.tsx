// app/admin/page.tsx
export const dynamic = 'force-dynamic';

async function getLeads() {
  // TODO: Replace with API call to fetch leads from the database
  return [];
}

export default async function Page({ searchParams }:{ searchParams: { token?: string } }) {
  const token = searchParams?.token || '';
  if (token !== process.env.ADMIN_DASH_TOKEN) {
    return (
      <div className="container">
        <h1>Acceso denegado</h1>
        <p>Token inválido</p>
      </div>
    );
  }
  const leads = await getLeads();
  return (
    <div className="container">
      <h1>Dashboard DINERONINO</h1>
      <p>Total leads (vista demo): {leads.length}</p>
      <p>Integra la lectura real creando /api/admin/list y consumiéndola aquí con fetch server-side.</p>
    </div>
  );
}
