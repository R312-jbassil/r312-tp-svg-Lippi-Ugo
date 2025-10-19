import pb from "../../utils/pb";

export async function POST({ request, cookies }) {
  try {
    const { name, svg, chat_history } = await request.json();

    if (!name || !svg) {
      return new Response(
        JSON.stringify({ error: 'Nom ou SVG manquant' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Charger l'auth depuis le cookie pour récupérer l'utilisateur connecté
    const authCookie = cookies.get("pb_auth")?.value;
    if (authCookie) {
      pb.authStore.loadFromCookie(authCookie);
    }

    const userId = pb.authStore?.record?.id;

    const payload = {
      name,
      svg,
      // enregistrer l'historique s'il est fourni
      ...(chat_history !== undefined ? { chat_history } : {}),
      // associer l'utilisateur si le champ existe dans la collection
      ...(userId ? { user: userId } : {}),
    };

    const record = await pb.collection('svgs').create(payload);
    return new Response(JSON.stringify(record), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Erreur PocketBase:', err);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}