import PocketBase from 'pocketbase';

export async function POST({ request }) {
  const pb = new PocketBase('http://127.0.0.1:8090');
  const body = await request.json();

  try {
    // Normalize incoming fields: client sends { id, svg, chat_history }
    const svgValue = body.svg ?? body.svg_code ?? body.code_svg ?? body.codeSvg ?? null;

    let chatHistoryValue = body.chat_history ?? null;
    if (typeof chatHistoryValue === 'string') {
      try {
        chatHistoryValue = JSON.parse(chatHistoryValue);
      } catch (err) {
        // If parsing fails, leave as string — PocketBase can store JSON strings too
        console.warn('updateSVG: failed to parse chat_history JSON, saving raw string');
      }
    }

    const updated = await pb.collection('svgs').update(body.id, {
      // Use the `svg` field which matches the schema (see pocketbase-types.ts)
      ...(svgValue !== null ? { svg: svgValue } : {}),
      chat_history: chatHistoryValue,
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