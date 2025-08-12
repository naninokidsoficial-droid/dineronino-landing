// app/api/lead/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, country, consent_whatsapp, cf_token, utm_source, utm_medium, utm_campaign } = body || {};
    // Validaciones básicas
    if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 });

    // Verificar Turnstile
    const cfSecret = process.env.TURNSTILE_SECRET!;
    if (!cf_token) return NextResponse.json({ error: 'Fallo verificación' }, { status: 400 });
    const vr = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: cfSecret, response: cf_token })
    }).then(r => r.json());

    if (!vr.success) return NextResponse.json({ error: 'Bot detectado' }, { status: 400 });

    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0] || '';
    const ua = req.headers.get('user-agent') || '';

    // Insertar en Supabase via REST (service role)
    const supaUrl = process.env.SUPABASE_URL!;
    const supaKey = process.env.SUPABASE_SERVICE_ROLE!;
    const insertRes = await fetch(`${supaUrl}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supaKey,
        'Authorization': `Bearer ${supaKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        country,
        consent_whatsapp: !!consent_whatsapp,
        utm_source,
        utm_medium,
        utm_campaign,
        ip,
        ua
      })
    });
    if (!insertRes.ok) {
      const txt = await insertRes.text();
      return NextResponse.json({ error: 'DB error: ' + txt }, { status: 500 });
    }
    const inserted = await insertRes.json();

    // Suscribirse a MailerLite
    if (process.env.MAILERLITE_API_KEY && process.env.MAILERLITE_GROUP_ID) {
      await fetch(`https://api.mailerlite.com/api/v2/groups/${process.env.MAILERLITE_GROUP_ID}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY!
        },
        body: JSON.stringify({
          email,
          name,
          fields: { phone }
        })
      }).catch(() => {});
    }

    // Mensaje por WhatsApp (template)
    if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && phone && consent_whatsapp) {
      const payload = {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
          name: process.env.WHATSAPP_TEMPLATE_NAME || 'hello_world',
          language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'es_MX' },
          components: [] as any[]
        }
      };
      await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`
        },
        body: JSON.stringify(payload)
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, lead: inserted[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Error interno' }, { status: 500 });
  }
}
