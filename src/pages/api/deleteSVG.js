import PocketBase from 'pocketbase';

export async function POST({ request }) {
  const pb = new PocketBase('http://127.0.0.1:8090');

  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID manquant' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await pb.collection('svgs').delete(id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Erreur suppression :', err);
    return new Response(JSON.stringify({ error: 'Échec de la suppression' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}