import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export async function POST({ request }) {
  const { name, svg } = await request.json();

  if (!name || !svg) {
    return new Response('Nom ou SVG manquant', { status: 400 });
  }

  try {
    const record = await pb.collection('svgs').create({ name, svg });
    return new Response(JSON.stringify(record), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Erreur PocketBase:', err);
    return new Response('Erreur serveur', { status: 500 });
  }
}