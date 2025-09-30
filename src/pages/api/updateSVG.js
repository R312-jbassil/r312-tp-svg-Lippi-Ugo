import PocketBase from 'pocketbase';

export async function POST({ request }) {
  const pb = new PocketBase('http://127.0.0.1:8090');
  const body = await request.json();

  try {
    const updated = await pb.collection('svgs').update(body.id, {
      svg_code: body.svg_code,
      chat_history: JSON.parse(body.chat_history),
    });

    return new Response(JSON.stringify({ success: true, data: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur updateSVG:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}